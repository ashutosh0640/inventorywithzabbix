package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.MessageDTO;
import com.ashutosh0640.inventy.entity.Group;
import com.ashutosh0640.inventy.entity.Message;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.NotificationType;
import com.ashutosh0640.inventy.mapper.MessageMapper;
import com.ashutosh0640.inventy.repository.GroupRepository;
import com.ashutosh0640.inventy.repository.MessageRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final RedisService redisService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final NotificationService notificationService;
    private static final Logger LOGGER = LoggerFactory.getLogger(MessageService.class);

    public MessageService(MessageRepository messageRepository,
                          UserRepository userRepository,
                          GroupRepository groupRepository,
                          RedisService redisService,
                          SimpMessagingTemplate simpMessagingTemplate,
                          NotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.redisService = redisService;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.notificationService = notificationService;
    }

    public MessageDTO sendDirectMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.getReferenceById(senderId);
        User receiver = userRepository.getReferenceById(receiverId);

        Message message = new Message(sender, receiver, content);
        message = messageRepository.save(message);
        MessageDTO messageDTO = MessageMapper.convertToDTO(message);

        // Store in Redis for real-time access
        redisService.cacheMessage(messageDTO);

        // Send via WebSocket
        simpMessagingTemplate.convertAndSendToUser(
                receiver.getUsername(),
                "/queue/messages",
                messageDTO
        );

        // Create notification
        notificationService.createNotification(
                receiver,
                "New Message",
                "You have a new message from " + sender.getUsername(),
                NotificationType.MESSAGE
        );
        return messageDTO;
    }

    public MessageDTO sendGroupMessage(Long senderId, Long groupId, String content) {
        User sender = userRepository.getReferenceById(senderId);
        Group group = groupRepository.getReferenceById(groupId);

        Message message = new Message(sender, group, content);
        message = messageRepository.save(message);

        MessageDTO messageDTO = MessageMapper.convertToDTO(message);

        // Store in Redis
        redisService.cacheGroupMessage(groupId, messageDTO);

        // Send to all group members via WebSocket
        group.getMembers().forEach(member -> {
            if (!member.getId().equals(senderId)) {
                simpMessagingTemplate.convertAndSendToUser(
                        member.getUser().getUsername(),
                        "/queue/group-messages",
                        messageDTO
                );

                // Create notification for each member
                notificationService.createNotification(
                        member.getUser(),
                        "New Group Message",
                        "New message in " + group.getName(),
                        NotificationType.MESSAGE
                );
            }
        });
        return messageDTO;
    }

    public List<MessageDTO> getConversation(Long senderId, Long receiverId) {
        User sender = userRepository.getReferenceById(senderId);
        User receiver = userRepository.getReferenceById(receiverId);
        List<MessageDTO> cachedMessages = redisService.getCachedConversation(senderId, receiverId);
        if (cachedMessages != null && !cachedMessages.isEmpty()) {
            return cachedMessages;
        }

        // Get from database
        List<Message> messages = messageRepository.findConversationBetweenUsers(sender, receiver);
        List<MessageDTO> messageDTOs = messages.stream()
                .map(MessageMapper::convertToDTO)
                .collect(Collectors.toList());

        // Cache the conversation
        redisService.cacheConversation(senderId, receiverId, messageDTOs);
        return messageDTOs;
    }


    public List<MessageDTO> getGroupMessages(Long groupId) {
        Group group = groupRepository.getReferenceById(groupId);
        // Try Redis cache first
        List<MessageDTO> cachedMessages = redisService.getCachedGroupMessages(groupId);
        if (cachedMessages != null && !cachedMessages.isEmpty()) {
            return cachedMessages;
        }

        // Get from database
        List<Message> messages = messageRepository.findByGroupOrderByTimestamp(group);
        List<MessageDTO> messageDTOs = messages.stream()
                .map(MessageMapper::convertToDTO)
                .collect(Collectors.toList());

        // Cache the messages
        redisService.cacheGroupMessages(groupId, messageDTOs);

        return messageDTOs;
    }

    public void markAsRead(Long messageId, Long userId) {
        Optional<Message> message = messageRepository.findById(messageId);
        if (message.isPresent() && message.get().getReceiver().getId().equals(userId)) {
            message.get().setRead(true);
            messageRepository.save(message.get());

            // Update cache
            redisService.updateMessageReadStatus(messageId, true);
        }
    }

    public List<MessageDTO> getUnreadMessages(Long userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {
            List<Message> unreadMessages = messageRepository.findByReceiverAndIsReadFalse(user.get());
            return unreadMessages.stream()
                    .map(MessageMapper::convertToDTO)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    /**
     * Fetches older messages before a given timestamp.
     * Use this for "scrolling up" to load historical messages.
     *
     * @param timestamp The timestamp to use as a cursor.
     * @param pageNumber The page number from which message fetched.
     * @param pageSize     The number of messages to fetch.
     * @return A list of messages older than the given timestamp.
     */
    public List<MessageDTO> getOlderMessages(LocalDateTime timestamp, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("timestamp").descending());
        List<Message> messages = messageRepository.findByTimestampBefore(timestamp, pageable);
        return messages.stream()
                .map(MessageMapper::convertToDTO)
                .toList();
    }

    /**
     * Fetches newer messages after a given timestamp.
     * Use this for "scrolling down" or for loading new messages.
     *
     * @param timestamp The timestamp to use as a cursor.
     * @param pageNumber The page number from which message fetched.
     * @param pageSize     The number of messages to fetch.
     * @return A list of messages newer than the given timestamp.
     */
    public List<MessageDTO> getNewerMessages(LocalDateTime timestamp, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("timestamp").ascending());
        List<Message> messages = messageRepository.findByTimestampAfter(timestamp, pageable);
        return messages.stream()
                .map(MessageMapper::convertToDTO)
                .toList();
    }
}
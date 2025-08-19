package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.MessageDTO;
import com.ashutosh0640.inventy.entity.Group;
import com.ashutosh0640.inventy.entity.Message;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.NotificationType;
import com.ashutosh0640.inventy.repository.GroupRepository;
import com.ashutosh0640.inventy.repository.MessageRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private RedisService redisService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationService notificationService;

    public MessageDTO sendDirectMessage(Long senderId, Long receiverId, String content) {
        Optional<User> sender = userRepository.findById(senderId);
        Optional<User> receiver = userRepository.findById(receiverId);

        if (sender.isPresent() && receiver.isPresent()) {
            Message message = new Message(sender.get(), receiver.get(), content);
            message = messageRepository.save(message);

            MessageDTO messageDTO = convertToDTO(message);

            // Store in Redis for real-time access
            redisService.cacheMessage(messageDTO);

            // Send via WebSocket
            messagingTemplate.convertAndSendToUser(
                    receiver.get().getUsername(),
                    "/queue/messages",
                    messageDTO
            );

            // Create notification
            notificationService.createNotification(
                    receiver.get(),
                    "New Message",
                    "You have a new message from " + sender.get().getUsername(),
                    NotificationType.MESSAGE
            );

            return messageDTO;
        }
        throw new RuntimeException("Sender or receiver not found");
    }

    public MessageDTO sendGroupMessage(Long senderId, Long groupId, String content) {
        Optional<User> sender = userRepository.findById(senderId);
        Optional<Group> group = groupRepository.findById(groupId);

        if (sender.isPresent() && group.isPresent()) {
            Message message = new Message(sender.get(), group.get(), content);
            message = messageRepository.save(message);

            MessageDTO messageDTO = convertToDTO(message);

            // Store in Redis
            redisService.cacheGroupMessage(groupId, messageDTO);

            // Send to all group members via WebSocket
            group.get().getMembers().forEach(member -> {
                if (!member.getId().equals(senderId)) {
                    messagingTemplate.convertAndSendToUser(
                            member.getUsername(),
                            "/queue/group-messages",
                            messageDTO
                    );

                    // Create notification for each member
                    notificationService.createNotification(
                            member,
                            "New Group Message",
                            "New message in " + group.get().getName(),
                            NotificationType.MESSAGE
                    );
                }
            });

            return messageDTO;
        }
        throw new RuntimeException("Sender or group not found");
    }

    public List<MessageDTO> getConversation(Long user1Id, Long user2Id) {
        Optional<User> user1 = userRepository.findById(user1Id);
        Optional<User> user2 = userRepository.findById(user2Id);

        if (user1.isPresent() && user2.isPresent()) {
            // Try to get from Redis cache first
            List<MessageDTO> cachedMessages = redisService.getCachedConversation(user1Id, user2Id);
            if (cachedMessages != null && !cachedMessages.isEmpty()) {
                return cachedMessages;
            }

            // Get from database
            List<Message> messages = messageRepository.findConversationBetweenUsers(user1.get(), user2.get());
            List<MessageDTO> messageDTOs = messages.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // Cache the conversation
            redisService.cacheConversation(user1Id, user2Id, messageDTOs);

            return messageDTOs;
        }
        throw new RuntimeException("Users not found");
    }

    public List<MessageDTO> getGroupMessages(Long groupId) {
        Optional<Group> group = groupRepository.findById(groupId);

        if (group.isPresent()) {
            // Try Redis cache first
            List<MessageDTO> cachedMessages = redisService.getCachedGroupMessages(groupId);
            if (cachedMessages != null && !cachedMessages.isEmpty()) {
                return cachedMessages;
            }

            // Get from database
            List<Message> messages = messageRepository.findByGroupOrderByTimestamp(group.get());
            List<MessageDTO> messageDTOs = messages.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // Cache the messages
            redisService.cacheGroupMessages(groupId, messageDTOs);

            return messageDTOs;
        }
        throw new RuntimeException("Group not found");
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
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    private MessageDTO convertToDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderUsername(message.getSender().getUsername());

        if (message.getReceiver() != null) {
            dto.setReceiverId(message.getReceiver().getId());
            dto.setReceiverUsername(message.getReceiver().getUsername());
        }

        if (message.getGroup() != null) {
            dto.setGroupId(message.getGroup().getId());
            dto.setGroupName(message.getGroup().getName());
        }

        dto.setContent(message.getContent());
        dto.setMessageType(message.getMessageType());
        dto.setTimestamp(message.getTimestamp());
        dto.setDelivered(message.isDelivered());
        dto.setRead(message.isRead());

        return dto;
    }
}

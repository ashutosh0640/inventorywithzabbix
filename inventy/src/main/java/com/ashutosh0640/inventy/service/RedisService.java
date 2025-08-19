package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.MessageDTO;
import com.ashutosh0640.inventy.dto.NotificationDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class RedisService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String MESSAGE_PREFIX = "message:";
    private static final String CONVERSATION_PREFIX = "conversation:";
    private static final String GROUP_MESSAGE_PREFIX = "group_messages:";
    private static final String NOTIFICATION_PREFIX = "notification:";
    private static final String USER_NOTIFICATIONS_PREFIX = "user_notifications:";
    private static final String ONLINE_USERS_KEY = "online_users";

    // Message caching
    public void cacheMessage(MessageDTO message) {
        String key = MESSAGE_PREFIX + message.getId();
        redisTemplate.opsForValue().set(key, message, 24, TimeUnit.HOURS);
    }

    public void cacheConversation(Long user1Id, Long user2Id, List<MessageDTO> messages) {
        String key = CONVERSATION_PREFIX + Math.min(user1Id, user2Id) + ":" + Math.max(user1Id, user2Id);
        redisTemplate.opsForValue().set(key, messages, 1, TimeUnit.HOURS);
    }

    public List<MessageDTO> getCachedConversation(Long user1Id, Long user2Id) {
        String key = CONVERSATION_PREFIX + Math.min(user1Id, user2Id) + ":" + Math.max(user1Id, user2Id);
        Object cached = redisTemplate.opsForValue().get(key);
        if (cached != null) {
            return objectMapper.convertValue(cached, new TypeReference<List<MessageDTO>>() {});
        }
        return null;
    }

    public void cacheGroupMessages(Long groupId, List<MessageDTO> messages) {
        String key = GROUP_MESSAGE_PREFIX + groupId;
        redisTemplate.opsForValue().set(key, messages, 1, TimeUnit.HOURS);
    }

    public void cacheGroupMessage(Long groupId, MessageDTO message) {
        String key = GROUP_MESSAGE_PREFIX + groupId;
        List<MessageDTO> messages = getCachedGroupMessages(groupId);
        if (messages != null) {
            messages.add(message);
            redisTemplate.opsForValue().set(key, messages, 1, TimeUnit.HOURS);
        }
    }

    public List<MessageDTO> getCachedGroupMessages(Long groupId) {
        String key = GROUP_MESSAGE_PREFIX + groupId;
        Object cached = redisTemplate.opsForValue().get(key);
        if (cached != null) {
            return objectMapper.convertValue(cached, new TypeReference<List<MessageDTO>>() {});
        }
        return null;
    }

    public void updateMessageReadStatus(Long messageId, boolean read) {
        String key = MESSAGE_PREFIX + messageId;
        MessageDTO message = (MessageDTO) redisTemplate.opsForValue().get(key);
        if (message != null) {
            message.setRead(read);
            redisTemplate.opsForValue().set(key, message, 24, TimeUnit.HOURS);
        }
    }

    // Notification caching
    public void cacheNotification(NotificationDTO notification) {
        String key = NOTIFICATION_PREFIX + notification.getId();
        redisTemplate.opsForValue().set(key, notification, 24, TimeUnit.HOURS);
    }

    public void cacheUserNotifications(Long userId, List<NotificationDTO> notifications) {
        String key = USER_NOTIFICATIONS_PREFIX + userId;
        redisTemplate.opsForValue().set(key, notifications, 30, TimeUnit.MINUTES);
    }

    public List<NotificationDTO> getCachedNotifications(Long userId) {
        String key = USER_NOTIFICATIONS_PREFIX + userId;
        Object cached = redisTemplate.opsForValue().get(key);
        if (cached != null) {
            return objectMapper.convertValue(cached, new TypeReference<List<NotificationDTO>>() {});
        }
        return null;
    }

    public void updateNotificationReadStatus(Long notificationId, boolean read) {
        String key = NOTIFICATION_PREFIX + notificationId;
        NotificationDTO notification = (NotificationDTO) redisTemplate.opsForValue().get(key);
        if (notification != null) {
            notification.setRead(read);
            redisTemplate.opsForValue().set(key, notification, 24, TimeUnit.HOURS);
        }
    }

    // Online users management
    public void addOnlineUser(String username) {
        redisTemplate.opsForSet().add(ONLINE_USERS_KEY, username);
        redisTemplate.expire(ONLINE_USERS_KEY, 1, TimeUnit.DAYS);
    }

    public void removeOnlineUser(String username) {
        redisTemplate.opsForSet().remove(ONLINE_USERS_KEY, username);
    }

    public boolean isUserOnline(String username) {
        return Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(ONLINE_USERS_KEY, username));
    }

    public List<String> getOnlineUsers() {
        return Objects.requireNonNull(redisTemplate.opsForSet().members(ONLINE_USERS_KEY))
                .stream()
                .map(Object::toString)
                .collect(Collectors.toList());
    }

    // Publish/Subscribe for real-time updates
    public void publishMessage(String channel, Object message) {
        redisTemplate.convertAndSend(channel, message);
    }
}

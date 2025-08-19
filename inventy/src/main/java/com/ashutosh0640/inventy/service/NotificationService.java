package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.NotificationDTO;
import com.ashutosh0640.inventy.entity.Notification;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.NotificationType;
import com.ashutosh0640.inventy.enums.Priority;
import com.ashutosh0640.inventy.repository.NotificationRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RedisService redisService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public NotificationDTO createNotification(User user, String title, String content, NotificationType type) {
        return createNotification(user, title, content, type, Priority.MEDIUM);
    }

    public NotificationDTO createNotification(User user, String title, String content, NotificationType type, Priority priority) {
        Notification notification = new Notification(user, title, content, type);
        notification.setPriority(priority);
        notification = notificationRepository.save(notification);

        NotificationDTO notificationDTO = convertToDTO(notification);

        // Cache in Redis
        redisService.cacheNotification(notificationDTO);

        // Send real-time notification via WebSocket
        messagingTemplate.convertAndSendToUser(
                user.getUsername(),
                "/queue/notifications",
                notificationDTO
        );

        return notificationDTO;
    }

    public List<NotificationDTO> getUserNotifications(Long userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {
            // Try Redis cache first
            List<NotificationDTO> cachedNotifications = redisService.getCachedNotifications(userId);
            if (cachedNotifications != null && !cachedNotifications.isEmpty()) {
                return cachedNotifications;
            }

            // Get from database
            List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user.get());
            List<NotificationDTO> notificationDTOs = notifications.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // Cache the notifications
            redisService.cacheUserNotifications(userId, notificationDTOs);

            return notificationDTOs;
        }
        return List.of();
    }

    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {
            List<Notification> unreadNotifications = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user.get());
            return unreadNotifications.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    public void markAsRead(Long notificationId, Long userId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);

        if (notification.isPresent() && notification.get().getUser().getId().equals(userId)) {
            notification.get().setRead(true);
            notification.get().setReadAt(LocalDateTime.now());
            notificationRepository.save(notification.get());

            // Update cache
            redisService.updateNotificationReadStatus(notificationId, true);
        }
    }

    public long getUnreadCount(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(value -> notificationRepository.countByUserAndIsReadFalse(value)).orElse(0L);
    }

    // Method to send inventory alerts
    public void sendInventoryAlert(Long userId, String productName, int currentStock, int minStock) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            String title = "Low Stock Alert";
            String content = String.format("Product '%s' is running low. Current stock: %d, Minimum stock: %d",
                    productName, currentStock, minStock);

            createNotification(user.get(), title, content, NotificationType.LOW_STOCK, Priority.HIGH);
        }
    }

    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUser().getId());
        dto.setTitle(notification.getTitle());
        dto.setContent(notification.getContent());
        dto.setType(notification.getType());
        dto.setPriority(notification.getPriority());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setReadAt(notification.getReadAt());
        return dto;
    }
}

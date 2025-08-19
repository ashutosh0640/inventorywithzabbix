package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.dto.NotificationDTO;
import com.ashutosh0640.inventy.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(@PathVariable Long userId) {
        List<NotificationDTO> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(@PathVariable Long userId) {
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId, @RequestParam Long userId) {
        notificationService.markAsRead(notificationId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/inventory-alert")
    public ResponseEntity<Void> sendInventoryAlert(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String productName = payload.get("productName").toString();
        int currentStock = Integer.parseInt(payload.get("currentStock").toString());
        int minStock = Integer.parseInt(payload.get("minStock").toString());

        notificationService.sendInventoryAlert(userId, productName, currentStock, minStock);
        return ResponseEntity.ok().build();
    }
}

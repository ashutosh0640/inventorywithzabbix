package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.NotificationType;
import com.ashutosh0640.inventy.enums.Priority;
import com.ashutosh0640.inventy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryAlertService {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    // Method to check inventory levels and send alerts
    public void checkInventoryLevels(String productName, int currentStock, int minStock, int reorderLevel) {
        if (currentStock <= minStock) {
            sendLowStockAlert(productName, currentStock, minStock);
        }

        if (currentStock <= reorderLevel) {
            sendReorderAlert(productName, currentStock, reorderLevel);
        }

        if (currentStock == 0) {
            sendOutOfStockAlert(productName);
        }
    }

    private void sendLowStockAlert(String productName, int currentStock, int minStock) {
        List<User> adminUsers = getAdminUsers();

        adminUsers.forEach(admin -> {
            String title = "Low Stock Alert";
            String content = String.format("Product '%s' is running low. Current stock: %d, Minimum stock: %d",
                    productName, currentStock, minStock);

            notificationService.createNotification(
                    admin,
                    title,
                    content,
                    NotificationType.LOW_STOCK,
                    Priority.HIGH
            );
        });
    }

    private void sendReorderAlert(String productName, int currentStock, int reorderLevel) {
        List<User> adminUsers = getAdminUsers();

        adminUsers.forEach(admin -> {
            String title = "Reorder Alert";
            String content = String.format("Product '%s' needs reordering. Current stock: %d, Reorder level: %d",
                    productName, currentStock, reorderLevel);

            notificationService.createNotification(
                    admin,
                    title,
                    content,
                    NotificationType.INVENTORY_ALERT,
                    Priority.MEDIUM
            );
        });
    }

    private void sendOutOfStockAlert(String productName) {
        List<User> adminUsers = getAdminUsers();

        adminUsers.forEach(admin -> {
            String title = "Out of Stock Alert";
            String content = String.format("Product '%s' is out of stock!", productName);

            notificationService.createNotification(
                    admin,
                    title,
                    content,
                    NotificationType.INVENTORY_ALERT,
                    Priority.CRITICAL
            );
        });
    }

    public void sendBulkOrderAlert(String orderNumber, int totalItems, double totalValue) {
        List<User> adminUsers = getAdminUsers();

        adminUsers.forEach(admin -> {
            String title = "Large Order Alert";
            String content = String.format("Large order received: #%s with %d items worth $%.2f",
                    orderNumber, totalItems, totalValue);

            notificationService.createNotification(
                    admin,
                    title,
                    content,
                    NotificationType.ORDER_UPDATE,
                    Priority.HIGH
            );
        });
    }

    private List<User> getAdminUsers() {
        // Implement logic to get admin users
        // For now, returning all active users
        return userRepository.findAll().stream()
                .filter(User::getActive)
                .collect(Collectors.toList());
    }
}
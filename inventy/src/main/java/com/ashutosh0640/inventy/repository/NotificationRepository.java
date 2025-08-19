package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.Notification;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
    List<Notification> findByUserAndTypeOrderByCreatedAtDesc(User user, NotificationType type);
    long countByUserAndIsReadFalse(User user);
}

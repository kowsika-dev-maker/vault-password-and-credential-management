package com.securevault.backend.repository;

import com.securevault.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    // Get all notifications for a user
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Get unread notifications for a user
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(
            Long userId
    );

    // Count unread notifications
    long countByUserIdAndIsReadFalse(Long userId);

    // Check whether a notification type already exists for a user
    boolean existsByUserIdAndType(Long userId, String type);
}
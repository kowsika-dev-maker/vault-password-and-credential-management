package com.securevault.backend.controller;

import com.securevault.backend.entity.Notification;
import com.securevault.backend.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationService notificationService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }


    // =========================================================
    // GET ALL NOTIFICATIONS
    // =========================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.getUserNotifications(userId)
        );
    }


    // =========================================================
    // GET UNREAD NOTIFICATIONS
    // =========================================================

    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(userId)
        );
    }


    // =========================================================
    // GET UNREAD COUNT
    // =========================================================

    @GetMapping("/count/{userId}")
    public ResponseEntity<Long> getUnreadCount(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.getUnreadCount(userId)
        );
    }


    // =========================================================
    // MARK NOTIFICATION AS READ
    // =========================================================

    @PutMapping("/read/{notificationId}")
    public ResponseEntity<String> markAsRead(
            @PathVariable Long notificationId) {

        String result =
                notificationService.markAsRead(
                        notificationId
                );

        if ("Notification not found".equals(result)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(result);
    }
}
package com.securevault.backend.service;

import com.securevault.backend.entity.Notification;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.NotificationRepository;
import com.securevault.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            EmailService emailService) {

        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public Notification createNotification(
            Long userId,
            String type,
            String title,
            String message) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);

        Notification savedNotification =
                notificationRepository.save(notification);

        // Send email only for important security notifications
        sendEmailForNotification(user, type, title, message);

        return savedNotification;
    }

    private void sendEmailForNotification(
            User user,
            String type,
            String title,
            String message) {

        try {

            switch (type) {

                case "LOGIN_SUCCESS":

                    emailService.sendEmail(
                            user.getEmail(),
                            "SecureVault - Successful Login",
                            "Hello " + user.getName() + ",\n\n"
                                    + "A successful login was detected on your SecureVault account.\n\n"
                                    + "Account: " + user.getEmail() + "\n"
                                    + "Date & Time: " + LocalDateTime.now() + "\n\n"
                                    + "If this was not you, please review your account security immediately.\n\n"
                                    + "SecureVault Security Team"
                    );
                    break;

                case "MULTIPLE_FAILED_LOGINS":

                    emailService.sendEmail(
                            user.getEmail(),
                            "SecureVault - Security Alert",
                            "Hello " + user.getName() + ",\n\n"
                                    + "Multiple failed login attempts were detected on your SecureVault account.\n\n"
                                    + "Account: " + user.getEmail() + "\n"
                                    + "Date & Time: " + LocalDateTime.now() + "\n\n"
                                    + "If you did not attempt these logins, please secure your account immediately.\n\n"
                                    + "SecureVault Security Team"
                    );
                    break;

                case "CREDENTIAL_SHARED":

                    emailService.sendEmail(
                            user.getEmail(),
                            "SecureVault - Credential Shared With You",
                            "Hello " + user.getName() + ",\n\n"
                                    + message + "\n\n"
                                    + "Important: Your shared credential password is never included in this email.\n\n"
                                    + "SecureVault Security Team"
                    );
                    break;

                case "PASSWORD_HEALTH":

                    emailService.sendEmail(
                            user.getEmail(),
                            "SecureVault - Password Health Alert",
                            "Hello " + user.getName() + ",\n\n"
                                    + message + "\n\n"
                                    + "Please review your weak or medium-strength passwords and update them when necessary.\n\n"
                                    + "SecureVault Security Team"
                    );
                    break;

                default:
                    // No email for other notification types
                    break;
            }

        } catch (Exception e) {

            // Email failure should not break the main SecureVault operation
            System.out.println(
                    "Email notification failed for user: "
                            + user.getEmail()
            );

            e.printStackTrace();
        }
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository
                .countByUserIdAndIsReadFalse(userId);
    }

    public boolean notificationExists(Long userId, String type) {
        return notificationRepository
                .existsByUserIdAndType(userId, type);
    }

    public String markAsRead(Long notificationId) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElse(null);

        if (notification == null) {
            return "Notification not found";
        }

        notification.setRead(true);
        notificationRepository.save(notification);

        return "Notification marked as read";
    }
}
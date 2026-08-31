package com.securevault.backend.service;

import com.securevault.backend.entity.SecurityAlert;
import com.securevault.backend.repository.SecurityAlertRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SecurityAlertService {

    private final SecurityAlertRepository repository;

    public SecurityAlertService(
            SecurityAlertRepository repository) {

        this.repository = repository;
    }

    // =========================================================
    // CREATE SECURITY ALERT
    // =========================================================

    public SecurityAlert createSecurityAlert(
            String email,
            String alertType,
            String message,
            String severity) {

        SecurityAlert alert =
                new SecurityAlert();

        alert.setEmail(email);

        alert.setAlertType(alertType);

        alert.setMessage(message);

        alert.setSeverity(severity);

        alert.setCreatedAt(
                LocalDateTime.now()
        );

        alert.setStatus("UNREAD");

        return repository.save(alert);
    }

    // =========================================================
    // GET USER SECURITY ALERTS
    // =========================================================

    public List<SecurityAlert> getSecurityAlerts(
            String email) {

        return repository
                .findByEmailOrderByCreatedAtDesc(email);
    }
}
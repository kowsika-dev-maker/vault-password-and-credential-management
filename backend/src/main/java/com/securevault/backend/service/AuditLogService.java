package com.securevault.backend.service;

import com.securevault.backend.entity.AuditLog;
import com.securevault.backend.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository repository;

    public AuditLogService(
            AuditLogRepository repository) {

        this.repository = repository;
    }

    // =========================================================
    // CREATE AUDIT LOG
    // =========================================================

    public AuditLog createAuditLog(
            String email,
            String action,
            String description) {

        AuditLog log =
                new AuditLog();

        log.setEmail(email);

        log.setAction(action);

        log.setDescription(description);

        log.setTimestamp(
                LocalDateTime.now()
        );

        return repository.save(log);
    }

    // =========================================================
    // GET USER AUDIT LOGS
    // =========================================================

    public List<AuditLog> getAuditLogs(
            String email) {

        return repository
                .findByEmailOrderByTimestampDesc(email);
    }
}
package com.securevault.backend.controller;

import com.securevault.backend.entity.AuditLog;
import com.securevault.backend.repository.AuditLogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "http://localhost:3000")
public class SecurityController {

    private final AuditLogRepository auditLogRepository;

    public SecurityController(
            AuditLogRepository auditLogRepository
    ) {
        this.auditLogRepository = auditLogRepository;
    }


    // =========================================================
    // GET SECURITY ACTIVITY
    // =========================================================

    @GetMapping("/activity/{email}")
    public List<AuditLog> getSecurityActivity(
            @PathVariable String email
    ) {

        return auditLogRepository
                .findByEmailOrderByTimestampDesc(email);

    }

}
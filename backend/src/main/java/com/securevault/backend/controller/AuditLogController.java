package com.securevault.backend.controller;

import com.securevault.backend.entity.AuditLog;
import com.securevault.backend.service.AuditLogService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001"
})
public class AuditLogController {

    private final AuditLogService auditLogService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AuditLogController(
            AuditLogService auditLogService) {

        this.auditLogService = auditLogService;
    }


    // =========================================================
    // GET USER AUDIT LOGS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAuditLogs(
            @RequestParam String email) {

        List<AuditLog> logs =
                auditLogService.getAuditLogs(email);

        return ResponseEntity.ok(logs);
    }
}
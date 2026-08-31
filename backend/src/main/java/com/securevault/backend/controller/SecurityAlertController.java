package com.securevault.backend.controller;

import com.securevault.backend.entity.SecurityAlert;
import com.securevault.backend.service.SecurityAlertService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security-alerts")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001"
})
public class SecurityAlertController {

    private final SecurityAlertService securityAlertService;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public SecurityAlertController(
            SecurityAlertService securityAlertService) {

        this.securityAlertService =
                securityAlertService;
    }

    // =========================================================
    // GET USER SECURITY ALERTS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<SecurityAlert>> getSecurityAlerts(
            @RequestParam String email) {

        List<SecurityAlert> alerts =
                securityAlertService
                        .getSecurityAlerts(email);

        return ResponseEntity.ok(alerts);
    }
}
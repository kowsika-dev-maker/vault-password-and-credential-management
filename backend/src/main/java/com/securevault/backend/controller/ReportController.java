package com.securevault.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.securevault.backend.service.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }


    // =========================================================
    // PASSWORD HEALTH REPORT
    // =========================================================

    @GetMapping("/password-health")
    public ResponseEntity<Map<String, Object>> getPasswordHealth(
            @RequestParam Long userId) {

        Map<String, Object> report =
                reportService.getPasswordHealthReport(userId);

        return ResponseEntity.ok(report);
    }


    // =========================================================
    // LOGIN ACTIVITY REPORT
    // =========================================================

    @GetMapping("/login-activity")
    public ResponseEntity<Map<String, Object>> getLoginActivity(
            @RequestParam String email) {

        Map<String, Object> report =
                reportService.getLoginActivityReport(email);

        return ResponseEntity.ok(report);
    }
}
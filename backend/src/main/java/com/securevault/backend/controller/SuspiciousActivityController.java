package com.securevault.backend.controller;

import com.securevault.backend.entity.SuspiciousActivity;
import com.securevault.backend.service.SuspiciousActivityService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suspicious-activity")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001"
})
public class SuspiciousActivityController {

    private final SuspiciousActivityService suspiciousActivityService;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public SuspiciousActivityController(
            SuspiciousActivityService suspiciousActivityService) {

        this.suspiciousActivityService =
                suspiciousActivityService;
    }

    // =========================================================
    // GET USER SUSPICIOUS ACTIVITIES
    // =========================================================

    @GetMapping
    public ResponseEntity<List<SuspiciousActivity>> getSuspiciousActivities(
            @RequestParam String email) {

        List<SuspiciousActivity> activities =
                suspiciousActivityService
                        .getSuspiciousActivities(email);

        return ResponseEntity.ok(activities);
    }
}
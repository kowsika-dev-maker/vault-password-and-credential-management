package com.securevault.backend.service;

import com.securevault.backend.entity.SuspiciousActivity;
import com.securevault.backend.repository.SuspiciousActivityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SuspiciousActivityService {

    private final SuspiciousActivityRepository repository;

    public SuspiciousActivityService(
            SuspiciousActivityRepository repository) {

        this.repository = repository;
    }

    // =========================================================
    // CREATE SUSPICIOUS ACTIVITY
    // =========================================================

    public SuspiciousActivity createSuspiciousActivity(
            String email,
            String activityType,
            String description) {

        SuspiciousActivity activity =
                new SuspiciousActivity();

        activity.setEmail(email);

        activity.setActivityType(activityType);

        activity.setDescription(description);

        activity.setDetectedAt(
                LocalDateTime.now()
        );

        activity.setStatus("FLAGGED");

        return repository.save(activity);
    }

    // =========================================================
    // GET USER SUSPICIOUS ACTIVITIES
    // =========================================================

    public List<SuspiciousActivity> getSuspiciousActivities(
            String email) {

        return repository
                .findByEmailOrderByDetectedAtDesc(email);
    }
}
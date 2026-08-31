package com.securevault.backend.service;

import com.securevault.backend.entity.Credential;
import com.securevault.backend.entity.LoginActivity;
import com.securevault.backend.repository.CredentialRepository;
import com.securevault.backend.repository.LoginActivityRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final CredentialRepository credentialRepository;
    private final LoginActivityRepository loginActivityRepository;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public ReportService(
            CredentialRepository credentialRepository,
            LoginActivityRepository loginActivityRepository) {

        this.credentialRepository = credentialRepository;
        this.loginActivityRepository = loginActivityRepository;
    }


    // =========================================================
    // PASSWORD HEALTH REPORT
    // =========================================================

    public Map<String, Object> getPasswordHealthReport(Long userId) {

        List<Credential> credentials =
                credentialRepository.findByUserId(userId);


        int totalCredentials = credentials.size();

        int strongPasswords = 0;
        int mediumPasswords = 0;
        int weakPasswords = 0;


        // =====================================================
        // ANALYZE PASSWORD STRENGTH
        // =====================================================

        for (Credential credential : credentials) {

            String password = credential.getPassword();

            if (password == null || password.isEmpty()) {

                weakPasswords++;

                continue;
            }


            int score = calculatePasswordScore(password);


            if (score >= 4) {

                strongPasswords++;

            } else if (score >= 2) {

                mediumPasswords++;

            } else {

                weakPasswords++;
            }
        }


        // =====================================================
        // HEALTH SCORE
        // =====================================================

        int healthScore = 0;

        if (totalCredentials > 0) {

            healthScore =
                    (strongPasswords * 100
                            + mediumPasswords * 60)
                            / totalCredentials;
        }


        // =====================================================
        // SUMMARY
        // =====================================================

        String summary;

        if (totalCredentials == 0) {

            summary = "No credentials available";

        } else if (healthScore >= 80) {

            summary = "Excellent password health";

        } else if (healthScore >= 60) {

            summary = "Good password health";

        } else if (healthScore >= 40) {

            summary = "Moderate password health";

        } else {

            summary = "Weak password health";
        }


        // =====================================================
        // RESPONSE
        // =====================================================

        Map<String, Object> report =
                new HashMap<>();

        report.put(
                "totalCredentials",
                totalCredentials
        );

        report.put(
                "strongPasswords",
                strongPasswords
        );

        report.put(
                "mediumPasswords",
                mediumPasswords
        );

        report.put(
                "weakPasswords",
                weakPasswords
        );

        report.put(
                "healthScore",
                healthScore
        );

        report.put(
                "summary",
                summary
        );


        return report;
    }


    // =========================================================
    // PASSWORD STRENGTH CALCULATOR
    // =========================================================

    private int calculatePasswordScore(String password) {

        int score = 0;


        // Length

        if (password.length() >= 8) {

            score++;
        }


        // Uppercase

        if (password.matches(".*[A-Z].*")) {

            score++;
        }


        // Lowercase

        if (password.matches(".*[a-z].*")) {

            score++;
        }


        // Number

        if (password.matches(".*[0-9].*")) {

            score++;
        }


        // Special character

        if (password.matches(".*[^a-zA-Z0-9].*")) {

            score++;
        }


        return score;
    }


    // =========================================================
    // LOGIN ACTIVITY REPORT
    // =========================================================

    public Map<String, Object> getLoginActivityReport(
            String email) {

        List<LoginActivity> activities =
                loginActivityRepository
                        .findByEmailOrderByLoginTimeDesc(email);


        int totalAttempts =
                activities.size();

        int successfulLogins = 0;

        int failedLogins = 0;


        // =====================================================
        // CALCULATE LOGIN STATISTICS
        // =====================================================

        for (LoginActivity activity : activities) {

            if ("SUCCESS".equals(
                    activity.getStatus())) {

                successfulLogins++;

            } else if ("FAILED".equals(
                    activity.getStatus())) {

                failedLogins++;
            }
        }


        // =====================================================
        // RESPONSE
        // =====================================================

        Map<String, Object> report =
                new HashMap<>();

        report.put(
                "totalAttempts",
                totalAttempts
        );

        report.put(
                "successfulLogins",
                successfulLogins
        );

        report.put(
                "failedLogins",
                failedLogins
        );

        report.put(
                "recentActivities",
                activities
        );


        return report;
    }
}
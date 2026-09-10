package com.securevault.backend.service;

import com.securevault.backend.entity.Credential;
import com.securevault.backend.entity.LoginActivity;
import com.securevault.backend.repository.CredentialRepository;
import com.securevault.backend.repository.LoginActivityRepository;
import com.securevault.backend.util.AESUtil;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final CredentialRepository credentialRepository;
    private final LoginActivityRepository loginActivityRepository;
    private final NotificationService notificationService;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public ReportService(
            CredentialRepository credentialRepository,
            LoginActivityRepository loginActivityRepository,
            NotificationService notificationService) {

        this.credentialRepository = credentialRepository;
        this.loginActivityRepository = loginActivityRepository;
        this.notificationService = notificationService;
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

            String encryptedPassword =
                    credential.getPassword();

            // -------------------------------------------------
            // EMPTY PASSWORD
            // -------------------------------------------------

            if (encryptedPassword == null
                    || encryptedPassword.isEmpty()) {

                weakPasswords++;

                continue;
            }

            // -------------------------------------------------
            // DECRYPT PASSWORD
            // -------------------------------------------------

            String password;

            try {

                password =
                        AESUtil.decrypt(
                                encryptedPassword
                        );

            } catch (Exception e) {

                System.out.println(
                        "Password decryption failed for credential ID: "
                                + credential.getId()
                );

                weakPasswords++;

                continue;
            }

            // -------------------------------------------------
            // CHECK DECRYPTED PASSWORD
            // -------------------------------------------------

            if (password == null
                    || password.isEmpty()) {

                weakPasswords++;

                continue;
            }

            // -------------------------------------------------
            // CALCULATE PASSWORD SCORE
            // -------------------------------------------------

            int score =
                    calculatePasswordScore(password);

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

            summary =
                    "No credentials available";

        } else if (healthScore >= 80) {

            summary =
                    "Excellent password health";

        } else if (healthScore >= 60) {

            summary =
                    "Good password health";

        } else if (healthScore >= 40) {

            summary =
                    "Moderate password health";

        } else {

            summary =
                    "Weak password health";
        }

        // =====================================================
        // PASSWORD HEALTH NOTIFICATION
        // =====================================================

        if (totalCredentials > 0
                && healthScore < 60) {

            notificationService.createNotification(
                    userId,
                    "PASSWORD_HEALTH",
                    "Password Health Alert",
                    "Your password health score is "
                            + healthScore
                            + "%. Please review your weak or medium-strength credentials."
            );
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

    private int calculatePasswordScore(
            String password) {

        int score = 0;

        // -----------------------------------------------------
        // LENGTH
        // -----------------------------------------------------

        if (password.length() >= 8) {

            score++;
        }

        // -----------------------------------------------------
        // UPPERCASE
        // -----------------------------------------------------

        if (password.matches(".*[A-Z].*")) {

            score++;
        }

        // -----------------------------------------------------
        // LOWERCASE
        // -----------------------------------------------------

        if (password.matches(".*[a-z].*")) {

            score++;
        }

        // -----------------------------------------------------
        // NUMBER
        // -----------------------------------------------------

        if (password.matches(".*[0-9].*")) {

            score++;
        }

        // -----------------------------------------------------
        // SPECIAL CHARACTER
        // -----------------------------------------------------

        if (password.matches(
                ".*[^a-zA-Z0-9].*")) {

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
                        .findByEmailOrderByLoginTimeDesc(
                                email
                        );

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
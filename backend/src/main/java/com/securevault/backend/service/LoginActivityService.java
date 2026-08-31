package com.securevault.backend.service;

import com.securevault.backend.entity.LoginActivity;
import com.securevault.backend.repository.LoginActivityRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoginActivityService {

    private final LoginActivityRepository loginActivityRepository;


    public LoginActivityService(
            LoginActivityRepository loginActivityRepository) {

        this.loginActivityRepository =
                loginActivityRepository;
    }


    // =========================================================
    // RECORD LOGIN ACTIVITY
    // =========================================================

    public void recordLogin(
            String email,
            String status,
            String reason) {

        LoginActivity activity =
                new LoginActivity();

        activity.setEmail(email);

        activity.setLoginTime(
                LocalDateTime.now()
        );

        activity.setActivity("Login");

        activity.setStatus(status);

        activity.setReason(reason);

        loginActivityRepository.save(activity);
    }


    // =========================================================
    // GET USER LOGIN ACTIVITY
    // =========================================================

    public List<LoginActivity> getLoginActivity(
            String email) {

        return loginActivityRepository
                .findByEmailOrderByLoginTimeDesc(email);
    }


    // =========================================================
    // COUNT RECENT FAILED ATTEMPTS
    // =========================================================

    public long countRecentFailedAttempts(
            String email) {

        LocalDateTime fiveMinutesAgo =
                LocalDateTime.now()
                        .minusMinutes(5);

        return loginActivityRepository
                .findByEmailOrderByLoginTimeDesc(email)
                .stream()
                .filter(activity ->
                        "FAILED".equals(
                                activity.getStatus()
                        )
                )
                .filter(activity ->
                        activity.getLoginTime()
                                .isAfter(
                                        fiveMinutesAgo
                                )
                )
                .count();
    }


    // =========================================================
    // COUNT SUCCESSFUL LOGINS
    // =========================================================

    public long countSuccessfulLogins(
            String email) {

        return loginActivityRepository
                .findByEmailOrderByLoginTimeDesc(email)
                .stream()
                .filter(activity ->
                        "SUCCESS".equals(
                                activity.getStatus()
                        )
                )
                .count();
    }


    // =========================================================
    // COUNT FAILED LOGINS
    // =========================================================

    public long countFailedLogins(
            String email) {

        return loginActivityRepository
                .findByEmailOrderByLoginTimeDesc(email)
                .stream()
                .filter(activity ->
                        "FAILED".equals(
                                activity.getStatus()
                        )
                )
                .count();
    }


    // =========================================================
    // COUNT SUSPICIOUS LOGINS
    // =========================================================

    public long countSuspiciousLogins(
            String email) {

        return loginActivityRepository
                .findByEmailOrderByLoginTimeDesc(email)
                .stream()
                .filter(activity ->
                        "SUSPICIOUS".equals(
                                activity.getStatus()
                        )
                )
                .count();
    }
}
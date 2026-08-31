package com.securevault.backend.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.securevault.backend.dto.ForgotPasswordRequest;
import com.securevault.backend.dto.LoginRequest;
import com.securevault.backend.dto.LoginResponse;
import com.securevault.backend.dto.RegisterRequest;
import com.securevault.backend.dto.VerifyOtpRequest;
import com.securevault.backend.entity.User;
import com.securevault.backend.jwt.JwtUtil;
import com.securevault.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final LoginActivityService loginActivityService;

    private final SuspiciousActivityService suspiciousActivityService;

    private final SecurityAlertService securityAlertService;

    private final AuditLogService auditLogService;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public UserService(
            UserRepository userRepository,
            LoginActivityService loginActivityService,
            SuspiciousActivityService suspiciousActivityService,
            SecurityAlertService securityAlertService,
            AuditLogService auditLogService) {

        this.userRepository = userRepository;

        this.loginActivityService =
                loginActivityService;

        this.suspiciousActivityService =
                suspiciousActivityService;

        this.securityAlertService =
                securityAlertService;

        this.auditLogService =
                auditLogService;
    }


    // =========================================================
    // REGISTER
    // =========================================================

    public String register(RegisterRequest request) {

        if (userRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            return "Email already exists!";
        }


        User user = new User();

        user.setName(
                request.getName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );


        userRepository.save(user);


        return "Registration Successful";
    }


    // =========================================================
    // LOGIN + SECURITY MONITORING
    // =========================================================

    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail();


        // =====================================================
        // FIND USER
        // =====================================================

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);


        // =====================================================
        // USER NOT FOUND
        // =====================================================

        if (user == null) {

            // Login activity
            loginActivityService.recordLogin(
                    email,
                    "FAILED",
                    "User not found"
            );


            // Audit log
            auditLogService.createAuditLog(
                    email,
                    "LOGIN_FAILED",
                    "Login failed because user was not found"
            );


            return new LoginResponse(
                    "User not found",
                    null
            );
        }


        // =====================================================
        // INVALID PASSWORD
        // =====================================================

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {


            // -------------------------------------------------
            // Record login failure
            // -------------------------------------------------

            loginActivityService.recordLogin(
                    email,
                    "FAILED",
                    "Invalid password"
            );


            // -------------------------------------------------
            // Record audit log
            // -------------------------------------------------

            auditLogService.createAuditLog(
                    email,
                    "LOGIN_FAILED",
                    "Login failed due to invalid password"
            );


            // -------------------------------------------------
            // Count recent failed attempts
            // -------------------------------------------------

            long failedAttempts =
                    loginActivityService
                            .countRecentFailedAttempts(
                                    email
                            );


            // =================================================
            // SUSPICIOUS ACTIVITY DETECTION
            // =================================================

            if (failedAttempts >= 5) {


                // -------------------------------------------------
                // Create suspicious activity record
                // -------------------------------------------------

                suspiciousActivityService
                        .createSuspiciousActivity(
                                email,
                                "MULTIPLE_FAILED_LOGINS",
                                "5 or more failed login attempts detected within 5 minutes"
                        );


                // -------------------------------------------------
                // Create security alert
                // -------------------------------------------------

                securityAlertService
                        .createSecurityAlert(
                                email,
                                "MULTIPLE_FAILED_LOGINS",
                                "Multiple failed login attempts detected for your account",
                                "HIGH"
                        );


                // -------------------------------------------------
                // Create audit log
                // -------------------------------------------------

                auditLogService.createAuditLog(
                        email,
                        "SUSPICIOUS_ACTIVITY",
                        "Multiple failed login attempts detected"
                );


                // -------------------------------------------------
                // Return security response
                // -------------------------------------------------

                return new LoginResponse(
                        "Suspicious login activity detected",
                        null
                );
            }


            // =================================================
            // NORMAL FAILED LOGIN
            // =================================================

            return new LoginResponse(
                    "Invalid Password",
                    null
            );
        }


        // =====================================================
        // SUCCESSFUL LOGIN
        // =====================================================

        loginActivityService.recordLogin(
                email,
                "SUCCESS",
                "Valid credentials"
        );


        // -----------------------------------------------------
        // Audit successful login
        // -----------------------------------------------------

        auditLogService.createAuditLog(
                email,
                "LOGIN_SUCCESS",
                "User logged in successfully with valid credentials"
        );


        // =====================================================
        // GENERATE JWT
        // =====================================================

        String token =
                JwtUtil.generateToken(
                        user.getEmail()
                );


        // =====================================================
        // RETURN LOGIN RESPONSE
        // Includes userId for Reports module
        // =====================================================

        return new LoginResponse(
                "Login Successful",
                token,
                user.getId()
        );
    }


    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    public String forgotPassword(
            ForgotPasswordRequest request) {

        User user =
                userRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElse(null);


        if (user == null) {

            return "Email not found";
        }


        // Generate 6-digit OTP

        String otp =
                String.valueOf(
                        100000 +
                                new Random().nextInt(900000)
                );


        user.setOtp(otp);

        user.setOtpExpiry(
                LocalDateTime.now()
                        .plusMinutes(5)
        );


        userRepository.save(user);


        // Display OTP in backend console
        // for development/testing

        System.out.println(
                "=================================="
        );

        System.out.println(
                "OTP : " + otp
        );

        System.out.println(
                "=================================="
        );


        return "OTP Sent Successfully";
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    public String resetPassword(
            VerifyOtpRequest request) {

        User user =
                userRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElse(null);


        // -----------------------------------------------------
        // USER NOT FOUND
        // -----------------------------------------------------

        if (user == null) {

            return "Email not found";
        }


        // -----------------------------------------------------
        // CHECK OTP
        // -----------------------------------------------------

        if (!request.getOtp()
                .equals(user.getOtp())) {

            return "Invalid OTP";
        }


        // -----------------------------------------------------
        // CHECK OTP EXPIRY
        // -----------------------------------------------------

        if (user.getOtpExpiry()
                .isBefore(
                        LocalDateTime.now()
                )) {

            return "OTP Expired";
        }


        // -----------------------------------------------------
        // UPDATE PASSWORD
        // -----------------------------------------------------

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );


        // Clear OTP after successful reset

        user.setOtp(null);

        user.setOtpExpiry(null);


        userRepository.save(user);


        return "Password Reset Successful";
    }
}
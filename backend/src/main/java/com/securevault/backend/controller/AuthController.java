package com.securevault.backend.controller;

import com.securevault.backend.dto.ForgotPasswordRequest;
import com.securevault.backend.dto.LoginRequest;
import com.securevault.backend.dto.LoginResponse;
import com.securevault.backend.dto.RegisterRequest;
import com.securevault.backend.dto.VerifyOtpRequest;
import com.securevault.backend.service.UserService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001"
})
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }


    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public String register(
            @RequestBody RegisterRequest request
    ) {

        return userService.register(request);
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request
    ) {

        System.out.println(
                "LOGIN REQUEST RECEIVED: "
                        + request.getEmail()
        );

        LoginResponse response =
                userService.login(request);

        System.out.println(
                "LOGIN RESPONSE: "
                        + response.getMessage()
        );

        return response;
    }


    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    @PostMapping("/forgot-password")
    public String forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) {

        return userService.forgotPassword(request);
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @PostMapping("/reset-password")
    public String resetPassword(
            @RequestBody VerifyOtpRequest request
    ) {

        return userService.resetPassword(request);
    }
}
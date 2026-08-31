package com.securevault.backend.controller;

import com.securevault.backend.entity.LoginActivity;
import com.securevault.backend.service.LoginActivityService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/login-activity")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001"
})
public class LoginActivityController {

    private final LoginActivityService loginActivityService;

    public LoginActivityController(
            LoginActivityService loginActivityService) {

        this.loginActivityService =
                loginActivityService;
    }


    // =========================================================
    // GET LOGIN ACTIVITY
    // =========================================================

    @GetMapping("/{email}")
    public List<LoginActivity> getLoginActivity(
            @PathVariable String email) {

        return loginActivityService
                .getLoginActivity(email);
    }
}
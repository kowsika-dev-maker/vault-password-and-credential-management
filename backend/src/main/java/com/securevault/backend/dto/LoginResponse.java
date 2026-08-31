package com.securevault.backend.dto;

public class LoginResponse {

    private String message;
    private String token;
    private Long userId;


    public LoginResponse() {
    }


    // Existing constructor
    // Keeps your previous code working
    public LoginResponse(
            String message,
            String token) {

        this.message = message;
        this.token = token;
    }


    // New constructor with userId
    public LoginResponse(
            String message,
            String token,
            Long userId) {

        this.message = message;
        this.token = token;
        this.userId = userId;
    }


    public String getMessage() {
        return message;
    }


    public void setMessage(String message) {
        this.message = message;
    }


    public String getToken() {
        return token;
    }


    public void setToken(String token) {
        this.token = token;
    }


    public Long getUserId() {
        return userId;
    }


    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
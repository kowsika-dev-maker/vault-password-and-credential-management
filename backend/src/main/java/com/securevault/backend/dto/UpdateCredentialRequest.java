package com.securevault.backend.dto;

public class UpdateCredentialRequest {

    private String website;
    private String username;
    private String password;

    public UpdateCredentialRequest() {
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
package com.securevault.backend.dto;

public class SharedCredentialResponse {

    private Long shareId;

    private Long credentialId;

    private String website;

    private String username;

    private String password;

    private String ownerEmail;

    private String permission;

    public SharedCredentialResponse() {
    }

    public SharedCredentialResponse(
            Long shareId,
            Long credentialId,
            String website,
            String username,
            String password,
            String ownerEmail,
            String permission
    ) {

        this.shareId = shareId;
        this.credentialId = credentialId;
        this.website = website;
        this.username = username;
        this.password = password;
        this.ownerEmail = ownerEmail;
        this.permission = permission;
    }

    public Long getShareId() {
        return shareId;
    }

    public void setShareId(Long shareId) {
        this.shareId = shareId;
    }

    public Long getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(Long credentialId) {
        this.credentialId = credentialId;
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

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }
}
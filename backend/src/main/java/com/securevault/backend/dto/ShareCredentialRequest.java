package com.securevault.backend.dto;

public class ShareCredentialRequest {

    private Long credentialId;

    private String recipientEmail;

    private String permission;


    public ShareCredentialRequest() {
    }


    public Long getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(Long credentialId) {
        this.credentialId = credentialId;
    }


    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }


    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }
}
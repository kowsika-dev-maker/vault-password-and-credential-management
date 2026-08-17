package com.securevault.backend.service;

import com.securevault.backend.dto.ShareCredentialRequest;
import com.securevault.backend.dto.SharedCredentialResponse;
import com.securevault.backend.entity.Credential;
import com.securevault.backend.entity.CredentialShare;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.CredentialRepository;
import com.securevault.backend.repository.CredentialShareRepository;
import com.securevault.backend.repository.UserRepository;
import com.securevault.backend.util.AESUtil;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SharingService {

    private final CredentialRepository credentialRepository;
    private final CredentialShareRepository credentialShareRepository;
    private final UserRepository userRepository;

    public SharingService(
            CredentialRepository credentialRepository,
            CredentialShareRepository credentialShareRepository,
            UserRepository userRepository
    ) {
        this.credentialRepository = credentialRepository;
        this.credentialShareRepository = credentialShareRepository;
        this.userRepository = userRepository;
    }


    // =========================================================
    // SHARE CREDENTIAL
    // =========================================================

    public String shareCredential(
            ShareCredentialRequest request,
            String ownerEmail
    ) {

        // Find logged-in owner
        User owner = userRepository
                .findByEmail(ownerEmail)
                .orElse(null);

        if (owner == null) {
            return "Owner not found";
        }


        // Check credential ID
        if (request.getCredentialId() == null) {
            return "Credential ID is required";
        }


        // Find credential
        Credential credential = credentialRepository
                .findById(request.getCredentialId())
                .orElse(null);

        if (credential == null) {
            return "Credential not found";
        }


        // Make sure credential belongs to logged-in owner
        if (credential.getUser() == null ||
                !credential.getUser()
                        .getId()
                        .equals(owner.getId())) {

            return "You are not allowed to share this credential";
        }


        // Find recipient
        // IMPORTANT:
        // ShareCredentialRequest uses recipientEmail
        User recipient = userRepository
                .findByEmail(request.getRecipientEmail())
                .orElse(null);

        if (recipient == null) {
            return "Recipient user not found";
        }


        // Prevent sharing with yourself
        if (recipient.getId().equals(owner.getId())) {
            return "You cannot share a credential with yourself";
        }


        // Check recipient email
        if (request.getRecipientEmail() == null ||
                request.getRecipientEmail().trim().isEmpty()) {

            return "Recipient email is required";
        }


        // Validate permission
        String permission = request.getPermission();

        if (permission == null ||
                (
                        !"VIEW_ONLY".equals(permission) &&
                                !"EDIT".equals(permission) &&
                                !"FULL_MANAGEMENT".equals(permission)
                )
        ) {

            return "Invalid permission";
        }


        // Check duplicate sharing
        boolean alreadyShared =
                credentialShareRepository
                        .existsByCredentialIdAndRecipientId(
                                credential.getId(),
                                recipient.getId()
                        );

        if (alreadyShared) {
            return "Credential already shared with this user";
        }


        // Create share
        CredentialShare share =
                new CredentialShare();

        share.setCredential(credential);

        share.setOwner(owner);

        share.setRecipient(recipient);

        // Permission is stored as String
        share.setPermission(permission);


        // Save share
        credentialShareRepository.save(share);


        return "Credential Shared Successfully";
    }


    // =========================================================
    // GET SHARED CREDENTIALS
    // =========================================================

    public List<SharedCredentialResponse> getSharedCredentials(
            String recipientEmail
    ) {

        User recipient = userRepository
                .findByEmail(recipientEmail)
                .orElse(null);

        if (recipient == null) {
            return List.of();
        }


        // Find all credentials shared with this user
        List<CredentialShare> shares =
                credentialShareRepository
                        .findByRecipientId(
                                recipient.getId()
                        );


        List<SharedCredentialResponse> response =
                new ArrayList<>();


        for (CredentialShare share : shares) {

            Credential credential =
                    share.getCredential();

            if (credential == null) {
                continue;
            }


            // Decrypt password
            String decryptedPassword;

            try {

                decryptedPassword =
                        AESUtil.decrypt(
                                credential.getPassword()
                        );

            } catch (Exception e) {

                decryptedPassword =
                        "Password decryption failed";
            }


            // Get owner email safely
            String ownerEmail;

            if (share.getOwner() != null) {

                ownerEmail =
                        share.getOwner().getEmail();

            } else {

                ownerEmail = "Unknown";
            }


            // Create response
            SharedCredentialResponse item =
                    new SharedCredentialResponse(

                            share.getId(),

                            credential.getId(),

                            credential.getWebsite(),

                            credential.getUsername(),

                            decryptedPassword,

                            ownerEmail,

                            share.getPermission()
                    );


            response.add(item);
        }


        return response;
    }
}
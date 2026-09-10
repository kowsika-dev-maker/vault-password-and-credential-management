package com.securevault.backend.service;

import com.securevault.backend.dto.ShareCredentialRequest;
import com.securevault.backend.dto.SharedCredentialResponse;
import com.securevault.backend.dto.UpdateCredentialRequest;
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
public class CredentialShareService {

    private final CredentialShareRepository credentialShareRepository;
    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;

    private final NotificationService notificationService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public CredentialShareService(
            CredentialShareRepository credentialShareRepository,
            CredentialRepository credentialRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {
        this.credentialShareRepository = credentialShareRepository;
        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }


    // =========================================================
    // SHARE CREDENTIAL
    // =========================================================

    public String shareCredential(
            ShareCredentialRequest request,
            String ownerEmail
    ) {

        User owner = userRepository
                .findByEmail(ownerEmail)
                .orElse(null);

        if (owner == null) {
            return "Owner not found";
        }


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


        User recipient = userRepository
                .findByEmail(request.getRecipientEmail())
                .orElse(null);

        if (recipient == null) {
            return "Recipient user not found";
        }


        // Owner cannot share with themselves
        if (recipient.getId().equals(owner.getId())) {
            return "You cannot share a credential with yourself";
        }


        // Validate permission
        String permission = request.getPermission();

        if (!"VIEW_ONLY".equals(permission)
                && !"EDIT".equals(permission)
                && !"FULL_MANAGEMENT".equals(permission)) {

            return "Invalid permission";
        }


        // Check duplicate
        boolean alreadyShared =
                credentialShareRepository
                        .existsByCredentialIdAndRecipientId(
                                credential.getId(),
                                recipient.getId()
                        );

        if (alreadyShared) {
            return "Credential already shared with this user";
        }


        // =====================================================
        // CREATE SHARE
        // =====================================================

        CredentialShare share =
                new CredentialShare();

        share.setCredential(credential);
        share.setOwner(owner);
        share.setRecipient(recipient);
        share.setPermission(permission);

        credentialShareRepository.save(share);


        // =====================================================
        // CREATE NOTIFICATION FOR RECIPIENT
        // =====================================================

        notificationService.createNotification(
                recipient.getId(),
                "CREDENTIAL_SHARED",
                "Credential Shared",
                "The credential for "
                        + credential.getWebsite()
                        + " was shared with your account by "
                        + owner.getEmail()
                        + " with "
                        + permission
                        + " permission."
        );


        return "Credential Shared Successfully";
    }


    // =========================================================
    // GET SHARED CREDENTIALS
    // =========================================================

    public List<SharedCredentialResponse>
    getSharedCredentials(String recipientEmail) {

        User recipient = userRepository
                .findByEmail(recipientEmail)
                .orElse(null);

        if (recipient == null) {
            return List.of();
        }


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


            String ownerEmail =
                    share.getOwner() != null
                            ? share.getOwner().getEmail()
                            : "Unknown";


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


    // =========================================================
    // GET PERMISSION
    // =========================================================

    public String getPermission(
            Long credentialId,
            String recipientEmail
    ) {

        User recipient =
                userRepository
                        .findByEmail(recipientEmail)
                        .orElse(null);

        if (recipient == null) {
            return "NO_ACCESS";
        }


        CredentialShare share =
                credentialShareRepository
                        .findByCredentialIdAndRecipientId(
                                credentialId,
                                recipient.getId()
                        )
                        .orElse(null);

        if (share == null) {
            return "NO_ACCESS";
        }


        return share.getPermission();
    }


    // =========================================================
    // UPDATE SHARED CREDENTIAL
    // EDIT or FULL_MANAGEMENT
    // =========================================================

    public String updateSharedCredential(
            Long credentialId,
            UpdateCredentialRequest request,
            String recipientEmail
    ) {

        User recipient =
                userRepository
                        .findByEmail(recipientEmail)
                        .orElse(null);

        if (recipient == null) {
            return "User not found";
        }


        CredentialShare share =
                credentialShareRepository
                        .findByCredentialIdAndRecipientId(
                                credentialId,
                                recipient.getId()
                        )
                        .orElse(null);


        if (share == null) {
            return "You do not have access to this credential";
        }


        String permission =
                share.getPermission();


        // VIEW_ONLY cannot edit
        if (!"EDIT".equals(permission)
                && !"FULL_MANAGEMENT".equals(permission)) {

            return "You only have View Only permission";
        }


        Credential credential =
                credentialRepository
                        .findById(credentialId)
                        .orElse(null);


        if (credential == null) {
            return "Credential not found";
        }


        credential.setWebsite(
                request.getWebsite()
        );

        credential.setUsername(
                request.getUsername()
        );


        // Encrypt password before saving
        credential.setPassword(
                AESUtil.encrypt(
                        request.getPassword()
                )
        );


        credentialRepository.save(credential);


        return "Shared Credential Updated Successfully";
    }


    // =========================================================
    // DELETE SHARED CREDENTIAL
    // FULL_MANAGEMENT ONLY
    // =========================================================

    public String deleteSharedCredential(
            Long credentialId,
            String recipientEmail
    ) {

        User recipient =
                userRepository
                        .findByEmail(recipientEmail)
                        .orElse(null);

        if (recipient == null) {
            return "User not found";
        }


        CredentialShare share =
                credentialShareRepository
                        .findByCredentialIdAndRecipientId(
                                credentialId,
                                recipient.getId()
                        )
                        .orElse(null);


        if (share == null) {
            return "You do not have access to this credential";
        }


        // Only FULL_MANAGEMENT can delete
        if (!"FULL_MANAGEMENT".equals(
                share.getPermission())) {

            return "You do not have Full Management permission";
        }


        Credential credential =
                credentialRepository
                        .findById(credentialId)
                        .orElse(null);


        if (credential == null) {
            return "Credential not found";
        }


        // Delete the share first
        credentialShareRepository.delete(share);

        // Then delete the credential
        credentialRepository.delete(credential);


        return "Shared Credential Deleted Successfully";
    }
}
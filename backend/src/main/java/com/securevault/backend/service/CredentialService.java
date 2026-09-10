package com.securevault.backend.service;

import com.securevault.backend.dto.CredentialRequest;
import com.securevault.backend.dto.UpdateCredentialRequest;
import com.securevault.backend.entity.Credential;
import com.securevault.backend.entity.CredentialShare;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.CredentialRepository;
import com.securevault.backend.repository.CredentialShareRepository;
import com.securevault.backend.repository.UserRepository;
import com.securevault.backend.util.AESUtil;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;
    private final CredentialShareRepository credentialShareRepository;
    private final AuditLogService auditLogService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public CredentialService(
            CredentialRepository credentialRepository,
            UserRepository userRepository,
            CredentialShareRepository credentialShareRepository,
            AuditLogService auditLogService) {

        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
        this.credentialShareRepository = credentialShareRepository;
        this.auditLogService = auditLogService;
    }


    // =========================================================
    // ADD CREDENTIAL
    // =========================================================

    public String addCredential(CredentialRequest request) {

        User user =
                userRepository
                        .findByEmail(request.getEmail())
                        .orElse(null);

        if (user == null) {
            return "User not found";
        }


        Credential credential = new Credential();

        credential.setWebsite(
                request.getWebsite()
        );

        credential.setUsername(
                request.getUsername()
        );


        // Encrypt password before storing
        credential.setPassword(
                AESUtil.encrypt(
                        request.getPassword()
                )
        );

        credential.setUser(user);

        credentialRepository.save(credential);


        // =====================================================
        // AUDIT LOG
        // =====================================================

        auditLogService.createAuditLog(
                request.getEmail(),
                "CREDENTIAL_ADDED",
                "New credential added for website: "
                        + request.getWebsite()
        );


        System.out.println(
                "Credential saved successfully for user: "
                        + request.getEmail()
        );

        return "Credential Saved Successfully";
    }


    // =========================================================
    // GET ALL OWNER CREDENTIALS
    // =========================================================

    public List<Credential> getCredentials(String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user == null) {

            System.out.println(
                    "USER NOT FOUND: " + email
            );

            return List.of();
        }


        List<Credential> credentials =
                credentialRepository.findByUserId(
                        user.getId()
                );


        System.out.println(
                "======================================"
        );

        System.out.println(
                "GET CREDENTIALS"
        );

        System.out.println(
                "EMAIL: " + email
        );

        System.out.println(
                "CREDENTIAL COUNT: "
                        + credentials.size()
        );


        // =====================================================
        // DECRYPT PASSWORDS
        // =====================================================

        for (Credential credential : credentials) {

            System.out.println(
                    "--------------------------------------"
            );

            System.out.println(
                    "Credential ID: "
                            + credential.getId()
            );

            System.out.println(
                    "Website: "
                            + credential.getWebsite()
            );

            System.out.println(
                    "Username: "
                            + credential.getUsername()
            );


            String encryptedPassword =
                    credential.getPassword();


            if (encryptedPassword == null
                    || encryptedPassword.isEmpty()) {

                System.out.println(
                        "PASSWORD IS NULL OR EMPTY"
                );

                credential.setPassword(
                        "DECRYPTION_ERROR"
                );

                continue;
            }


            System.out.println(
                    "Encrypted password exists: true"
            );


            try {

                String decryptedPassword =
                        AESUtil.decrypt(
                                encryptedPassword
                        );

                credential.setPassword(
                        decryptedPassword
                );


                System.out.println(
                        "DECRYPTION SUCCESS for ID: "
                                + credential.getId()
                );

            } catch (Exception e) {

                System.out.println(
                        "DECRYPTION FAILED for ID: "
                                + credential.getId()
                );

                e.printStackTrace();


                credential.setPassword(
                        "DECRYPTION_ERROR"
                );
            }
        }


        System.out.println(
                "======================================"
        );


        return credentials;
    }


    // =========================================================
    // UPDATE CREDENTIAL
    //
    // Owner       -> allowed
    // EDIT        -> allowed
    // FULL_MANAGEMENT -> allowed
    // VIEW_ONLY   -> denied
    // =========================================================

    public String updateCredential(
            Long id,
            UpdateCredentialRequest request,
            String requesterEmail) {

        Credential credential =
                credentialRepository
                        .findById(id)
                        .orElse(null);

        if (credential == null) {
            return "Credential not found";
        }


        User requester =
                userRepository
                        .findByEmail(requesterEmail)
                        .orElse(null);

        if (requester == null) {
            return "User not found";
        }


        // =====================================================
        // OWNER
        // =====================================================

        if (credential.getUser() != null
                && credential.getUser()
                .getId()
                .equals(requester.getId())) {

            return performUpdate(
                    credential,
                    request,
                    requesterEmail
            );
        }


        // =====================================================
        // SHARED USER
        // =====================================================

        CredentialShare share =
                credentialShareRepository
                        .findByCredentialIdAndRecipientId(
                                id,
                                requester.getId()
                        )
                        .orElse(null);

        if (share == null) {
            return "You do not have access to this credential";
        }


        String permission =
                share.getPermission();


        // EDIT permission
        if ("EDIT".equals(permission)
                || "FULL_MANAGEMENT".equals(permission)) {

            return performUpdate(
                    credential,
                    request,
                    requesterEmail
            );
        }


        // VIEW_ONLY
        return "You have View Only permission";
    }


    // =========================================================
    // ACTUAL UPDATE OPERATION
    // =========================================================

    private String performUpdate(
            Credential credential,
            UpdateCredentialRequest request,
            String requesterEmail) {

        credential.setWebsite(
                request.getWebsite()
        );

        credential.setUsername(
                request.getUsername()
        );


        // Encrypt updated password
        credential.setPassword(
                AESUtil.encrypt(
                        request.getPassword()
                )
        );


        credentialRepository.save(
                credential
        );


        // =====================================================
        // AUDIT LOG
        // =====================================================

        auditLogService.createAuditLog(
                requesterEmail,
                "CREDENTIAL_UPDATED",
                "Credential updated for website: "
                        + request.getWebsite()
        );


        return "Credential Updated Successfully";
    }


    // =========================================================
    // DELETE CREDENTIAL
    //
    // Owner            -> allowed
    // FULL_MANAGEMENT  -> allowed
    // EDIT             -> denied
    // VIEW_ONLY        -> denied
    // =========================================================

    @Transactional
    public String deleteCredential(
            Long id,
            String requesterEmail) {

        Credential credential =
                credentialRepository
                        .findById(id)
                        .orElse(null);

        if (credential == null) {
            return "Credential not found";
        }


        User requester =
                userRepository
                        .findByEmail(requesterEmail)
                        .orElse(null);

        if (requester == null) {
            return "User not found";
        }


        // =====================================================
        // SAVE WEBSITE BEFORE DELETE
        // =====================================================

        String website =
                credential.getWebsite();


        // =====================================================
        // OWNER
        // =====================================================

        if (credential.getUser() != null
                && credential.getUser()
                .getId()
                .equals(requester.getId())) {

            // -------------------------------------------------
            // DELETE RELATED SHARES FIRST
            // -------------------------------------------------

            credentialShareRepository.deleteByCredentialId(id);


            // -------------------------------------------------
            // DELETE CREDENTIAL
            // -------------------------------------------------

            credentialRepository.delete(
                    credential
            );


            // =================================================
            // AUDIT LOG
            // =================================================

            auditLogService.createAuditLog(
                    requesterEmail,
                    "CREDENTIAL_DELETED",
                    "Credential deleted for website: "
                            + website
            );


            return "Credential Deleted Successfully";
        }


        // =====================================================
        // SHARED USER
        // =====================================================

        CredentialShare share =
                credentialShareRepository
                        .findByCredentialIdAndRecipientId(
                                id,
                                requester.getId()
                        )
                        .orElse(null);

        if (share == null) {
            return "You do not have access to this credential";
        }


        String permission =
                share.getPermission();


        // =====================================================
        // FULL MANAGEMENT
        // =====================================================

        if ("FULL_MANAGEMENT".equals(permission)) {

            // -------------------------------------------------
            // DELETE ALL SHARES FIRST
            // -------------------------------------------------

            credentialShareRepository.deleteByCredentialId(id);


            // -------------------------------------------------
            // DELETE CREDENTIAL
            // -------------------------------------------------

            credentialRepository.delete(
                    credential
            );


            // =================================================
            // AUDIT LOG
            // =================================================

            auditLogService.createAuditLog(
                    requesterEmail,
                    "CREDENTIAL_DELETED",
                    "Shared credential deleted for website: "
                            + website
            );


            return "Credential Deleted Successfully";
        }


        // =====================================================
        // EDIT
        // =====================================================

        if ("EDIT".equals(permission)) {
            return "Edit permission does not allow deletion";
        }


        // =====================================================
        // VIEW ONLY
        // =====================================================

        return "You have View Only permission";
    }


    // =========================================================
    // OLD DELETE METHOD
    // =========================================================

    @Transactional
    public String deleteCredential(Long id) {

        Credential credential =
                credentialRepository
                        .findById(id)
                        .orElse(null);

        if (credential == null) {
            return "Credential not found";
        }


        // Delete related shares first
        credentialShareRepository.deleteByCredentialId(id);


        // Delete credential
        credentialRepository.delete(
                credential
        );


        return "Credential Deleted Successfully";
    }
}
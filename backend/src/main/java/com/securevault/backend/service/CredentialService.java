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

import java.util.List;

@Service
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;
    private final CredentialShareRepository credentialShareRepository;

    public CredentialService(
            CredentialRepository credentialRepository,
            UserRepository userRepository,
            CredentialShareRepository credentialShareRepository) {

        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
        this.credentialShareRepository = credentialShareRepository;
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

        credential.setWebsite(request.getWebsite());

        credential.setUsername(request.getUsername());

        // Encrypt password before storing
        credential.setPassword(
                AESUtil.encrypt(request.getPassword())
        );

        credential.setUser(user);

        credentialRepository.save(credential);

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


        // Decrypt every password
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
                    request
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
                    request
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
            UpdateCredentialRequest request) {

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
        // OWNER
        // =====================================================

        if (credential.getUser() != null
                && credential.getUser()
                .getId()
                .equals(requester.getId())) {

            credentialRepository.delete(
                    credential
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


        // Only FULL_MANAGEMENT can delete
        if ("FULL_MANAGEMENT".equals(permission)) {

            credentialRepository.delete(
                    credential
            );

            return "Credential Deleted Successfully";
        }


        if ("EDIT".equals(permission)) {
            return "Edit permission does not allow deletion";
        }


        return "You have View Only permission";
    }


    // =========================================================
    // OLD DELETE METHOD
    // =========================================================
    //
    // Kept so existing code does not suddenly break.
    //
    // =========================================================

    public String deleteCredential(Long id) {

        Credential credential =
                credentialRepository
                        .findById(id)
                        .orElse(null);

        if (credential == null) {
            return "Credential not found";
        }

        credentialRepository.delete(
                credential
        );

        return "Credential Deleted Successfully";
    }
}
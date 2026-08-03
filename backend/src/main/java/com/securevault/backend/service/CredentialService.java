package com.securevault.backend.service;

import com.securevault.backend.dto.CredentialRequest;
import com.securevault.backend.dto.UpdateCredentialRequest;
import com.securevault.backend.entity.Credential;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.CredentialRepository;
import com.securevault.backend.repository.UserRepository;
import com.securevault.backend.util.AESUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;

    public CredentialService(CredentialRepository credentialRepository,
                             UserRepository userRepository) {
        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
    }

    // Add Credential
    public String addCredential(CredentialRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return "User not found";
        }

        Credential credential = new Credential();

        credential.setWebsite(request.getWebsite());
        credential.setUsername(request.getUsername());

        // Encrypt password before saving
        credential.setPassword(AESUtil.encrypt(request.getPassword()));

        credential.setUser(user);

        credentialRepository.save(credential);

        return "Credential Saved Successfully";
    }

    // Get All Credentials
    public List<Credential> getCredentials(String email) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return List.of();
        }

        List<Credential> credentials =
                credentialRepository.findByUserId(user.getId());

        // Decrypt passwords before returning
        for (Credential credential : credentials) {
            credential.setPassword(
                    AESUtil.decrypt(credential.getPassword())
            );
        }

        return credentials;
    }

    // Update Credential
    public String updateCredential(Long id, UpdateCredentialRequest request) {

        Credential credential = credentialRepository.findById(id).orElse(null);

        if (credential == null) {
            return "Credential not found";
        }

        credential.setWebsite(request.getWebsite());
        credential.setUsername(request.getUsername());

        // Encrypt updated password before saving
        credential.setPassword(
                AESUtil.encrypt(request.getPassword())
        );

        credentialRepository.save(credential);

        return "Credential Updated Successfully";
    }

    // Delete Credential
    public String deleteCredential(Long id) {

        Credential credential = credentialRepository.findById(id).orElse(null);

        if (credential == null) {
            return "Credential not found";
        }

        credentialRepository.delete(credential);

        return "Credential Deleted Successfully";
    }
}
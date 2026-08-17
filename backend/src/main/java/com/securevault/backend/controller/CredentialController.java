package com.securevault.backend.controller;

import com.securevault.backend.dto.CredentialRequest;
import com.securevault.backend.dto.UpdateCredentialRequest;
import com.securevault.backend.entity.Credential;
import com.securevault.backend.service.CredentialService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credentials")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001"
})
public class CredentialController {

    private final CredentialService credentialService;

    public CredentialController(
            CredentialService credentialService) {

        this.credentialService = credentialService;
    }


    // =========================================================
    // ADD CREDENTIAL
    // =========================================================

    @PostMapping("/add")
    public String addCredential(
            @RequestBody CredentialRequest request) {

        return credentialService.addCredential(request);
    }


    // =========================================================
    // TEST API
    // =========================================================

    @GetMapping("/hello")
    public String hello() {

        return "Hello Credential Controller";
    }


    // =========================================================
    // GET ALL OWNER CREDENTIALS
    // =========================================================

    @GetMapping("/all/{email}")
    public List<Credential> getCredentials(
            @PathVariable String email) {

        return credentialService.getCredentials(email);
    }


    // =========================================================
    // UPDATE CREDENTIAL
    // =========================================================

    @PutMapping("/update/{id}")
    public String updateCredential(
            @PathVariable Long id,
            @RequestBody UpdateCredentialRequest request,
            Authentication authentication) {

        // Get logged-in user's email from JWT
        String requesterEmail =
                authentication.getName();

        return credentialService.updateCredential(
                id,
                request,
                requesterEmail
        );
    }


    // =========================================================
    // DELETE CREDENTIAL
    // =========================================================

    @DeleteMapping("/delete/{id}")
    public String deleteCredential(
            @PathVariable Long id,
            Authentication authentication) {

        // Get logged-in user's email from JWT
        String requesterEmail =
                authentication.getName();

        return credentialService.deleteCredential(
                id,
                requesterEmail
        );
    }
}
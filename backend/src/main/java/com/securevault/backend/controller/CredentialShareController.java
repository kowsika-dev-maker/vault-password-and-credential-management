package com.securevault.backend.controller;

import com.securevault.backend.dto.ShareCredentialRequest;
import com.securevault.backend.dto.SharedCredentialResponse;
import com.securevault.backend.dto.UpdateCredentialRequest;
import com.securevault.backend.service.CredentialShareService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sharing")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001"
})
public class CredentialShareController {

    private final CredentialShareService credentialShareService;

    public CredentialShareController(
            CredentialShareService credentialShareService
    ) {
        this.credentialShareService =
                credentialShareService;
    }


    // =========================================================
    // SHARE
    // =========================================================

    @PostMapping("/share")
    public String shareCredential(
            @RequestBody ShareCredentialRequest request,
            Authentication authentication
    ) {

        String ownerEmail =
                authentication.getName();

        return credentialShareService.shareCredential(
                request,
                ownerEmail
        );
    }


    // =========================================================
    // GET SHARED WITH ME
    // =========================================================

    @GetMapping("/shared/{email}")
    public List<SharedCredentialResponse>
    getSharedCredentials(
            @PathVariable String email
    ) {

        return credentialShareService
                .getSharedCredentials(email);
    }


    // =========================================================
    // GET PERMISSION
    // =========================================================

    @GetMapping("/permission/{credentialId}/{email}")
    public String getPermission(
            @PathVariable Long credentialId,
            @PathVariable String email
    ) {

        return credentialShareService.getPermission(
                credentialId,
                email
        );
    }


    // =========================================================
    // EDIT SHARED CREDENTIAL
    // EDIT + FULL_MANAGEMENT
    // =========================================================

    @PutMapping("/update/{credentialId}")
    public String updateSharedCredential(
            @PathVariable Long credentialId,
            @RequestBody UpdateCredentialRequest request,
            Authentication authentication
    ) {

        String recipientEmail =
                authentication.getName();

        return credentialShareService
                .updateSharedCredential(
                        credentialId,
                        request,
                        recipientEmail
                );
    }


    // =========================================================
    // DELETE SHARED CREDENTIAL
    // FULL_MANAGEMENT ONLY
    // =========================================================

    @DeleteMapping("/delete/{credentialId}")
    public String deleteSharedCredential(
            @PathVariable Long credentialId,
            Authentication authentication
    ) {

        String recipientEmail =
                authentication.getName();

        return credentialShareService
                .deleteSharedCredential(
                        credentialId,
                        recipientEmail
                );
    }
}
package com.securevault.backend.controller;

import com.securevault.backend.dto.CredentialRequest;
import com.securevault.backend.dto.UpdateCredentialRequest;
import com.securevault.backend.entity.Credential;
import com.securevault.backend.service.CredentialService;
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

    public CredentialController(CredentialService credentialService) {
        this.credentialService = credentialService;
    }

    // Add Credential
    @PostMapping("/add")
    public String addCredential(@RequestBody CredentialRequest request) {
        return credentialService.addCredential(request);
    }

    // Test API
    @GetMapping("/hello")
    public String hello() {
        return "Hello Credential Controller";
    }

    // Get All Credentials
    @GetMapping("/all/{email}")
    public List<Credential> getCredentials(@PathVariable String email) {
        return credentialService.getCredentials(email);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteCredential(@PathVariable Long id) {
        return credentialService.deleteCredential(id);
    }

    // Update Credential
    @PutMapping("/update/{id}")
    public String updateCredential(@PathVariable Long id,
                                   @RequestBody UpdateCredentialRequest request) {
        return credentialService.updateCredential(id, request);
    }
}
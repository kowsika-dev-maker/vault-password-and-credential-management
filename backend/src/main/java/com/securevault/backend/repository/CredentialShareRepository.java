package com.securevault.backend.repository;

import com.securevault.backend.entity.CredentialShare;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CredentialShareRepository
        extends JpaRepository<CredentialShare, Long> {

    List<CredentialShare> findByRecipientId(Long recipientId);

    List<CredentialShare> findByOwnerId(Long ownerId);

    Optional<CredentialShare> findByCredentialIdAndRecipientId(
            Long credentialId,
            Long recipientId
    );

    boolean existsByCredentialIdAndRecipientId(
            Long credentialId,
            Long recipientId
    );

    // Delete all shares associated with a credential
    void deleteByCredentialId(Long credentialId);
}
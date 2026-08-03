package com.securevault.backend.repository;

import com.securevault.backend.entity.Credential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CredentialRepository extends JpaRepository<Credential, Long> {

    List<Credential> findByUserId(Long userId);

}
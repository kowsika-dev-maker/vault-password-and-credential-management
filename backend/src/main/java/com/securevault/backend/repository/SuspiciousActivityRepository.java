package com.securevault.backend.repository;

import com.securevault.backend.entity.SuspiciousActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SuspiciousActivityRepository
        extends JpaRepository<SuspiciousActivity, Long> {

    List<SuspiciousActivity> findByEmailOrderByDetectedAtDesc(
            String email
    );
}
package com.securevault.backend.repository;

import com.securevault.backend.entity.LoginActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoginActivityRepository
        extends JpaRepository<LoginActivity, Long> {

    List<LoginActivity> findByEmailOrderByLoginTimeDesc(
            String email
    );
}
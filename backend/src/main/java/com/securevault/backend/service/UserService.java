package com.securevault.backend.service;

import com.securevault.backend.dto.LoginRequest;
import com.securevault.backend.dto.RegisterRequest;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists!";
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return "Registration Successful";
    }

    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return "User not found";
        }

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return "Login Successful";
        }

        return "Invalid Password";
    }
}
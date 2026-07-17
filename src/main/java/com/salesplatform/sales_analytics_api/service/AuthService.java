package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.config.JwtConfig;
import com.salesplatform.sales_analytics_api.dto.LoginRequest;
import com.salesplatform.sales_analytics_api.dto.LoginResponse;
import com.salesplatform.sales_analytics_api.dto.RegisterRequest;
import com.salesplatform.sales_analytics_api.entity.User;
import com.salesplatform.sales_analytics_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtConfig jwtConfig;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final PasswordEncoder passwordEncoder;

    // Register ne user - pword hashed with bcrypt before saving
    public String register(RegisterRequest registerRequest) {

        // make sure username isnt taken already
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already in use" + registerRequest.getUsername());
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .tier(registerRequest.getTier())
                .createdAt(LocalDate.now())
                .build();

        userRepository.save(user);
        return "User registered successfully";

    }

    // For loggingnin a existing user
    // return a JWT token with the username and tier
    public LoginResponse login(LoginRequest loginRequest) {

        // find the user or throw exception
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Username not found"));

        // cjeck the password matches
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Passwords don't match");
        }

        // generate JWT token with username and tier
        String token = jwtConfig.generateToken(user.getUsername(), user.getTier());

        return LoginResponse.builder()
                .token(token)
                .tier(user.getTier())
                .build();
    }



}
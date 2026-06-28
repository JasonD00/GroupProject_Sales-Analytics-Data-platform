package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.config.JwtConfig;
import com.salesplatform.sales_analytics_api.dto.LoginRequest;
import com.salesplatform.sales_analytics_api.dto.LoginResponse;
import com.salesplatform.sales_analytics_api.entity.User;
import com.salesplatform.sales_analytics_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/*
    Handles all the login auth logic

    - receives the username + password from controller
    - looks up user in dbo.users by username
    - uses BCrypt to verify the password against the stored hashed password
    - returns LoginResponse with username + tier if valid
    - throws RuntimeException if username isnt found or if the password is wrong

    BCryptPasswordEncoder.matches() compares the plain text password with the hash without storing the plain text
*/

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtConfig jwtConfig;

    public LoginResponse login(LoginRequest request) {

        System.out.println("=== LOGIN DEBUG ===");
        System.out.println("Username received: " + request.getUsername());
        System.out.println("Password received: " + request.getPassword());

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        System.out.println("User found: " + user.getUsername());
        System.out.println("Hash in DB: " + user.getPassword());
        System.out.println("Password matches: " + passwordEncoder.matches(request.getPassword(), user.getPassword()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtConfig.generateToken(user.getUsername(), user.getTier());

        return LoginResponse.builder()
                .username(user.getUsername())
                .tier(user.getTier())
                .token(token)
                .build();
    }
}
package com.salesplatform.sales_analytics_api.controller;

import com.salesplatform.sales_analytics_api.dto.LoginRequest;
import com.salesplatform.sales_analytics_api.dto.LoginResponse;
import com.salesplatform.sales_analytics_api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*
    Entry point for auth HTTP request
    POST /api/auth/login
    
    Main body: {"username": "jason", "password": "password"}
    Returns: {"username": "jason", "tier": "ENTERPRISE"}
*/

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("=== CONTROLLER DEBUG ===");
            LoginResponse response = authService.login(request);
            System.out.println("Login successful, returning response: " + response);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("Login failed with error: " + e.getMessage());
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}
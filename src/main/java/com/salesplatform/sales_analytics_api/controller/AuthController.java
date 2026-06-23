package com.salesplatform.sales_analytics_api.controller;

import com.salesplatform.sales_analytics_api.dto.LoginRequest;
import com.salesplatform.sales_analytics_api.dto.LoginResponse;
import com.salesplatform.sales_analytics_api.dto.RegisterRequest;
import com.salesplatform.sales_analytics_api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
       Auth Controller

       entry point for all auth requests: (AuthService)

       Creat a new user and return JWT token on success
 */

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    // api/auth/register
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.register(registerRequest));
    }

    // /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }
}

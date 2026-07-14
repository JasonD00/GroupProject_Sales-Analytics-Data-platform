package com.salesplatform.sales_analytics_api.config;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtAuthFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(request -> {
                var config =
                    new org.springframework.web.cors.CorsConfiguration();

                config.setAllowedOrigins(
                    List.of("http://localhost:5173")
                );

                config.setAllowedMethods(
                    List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                    )
                );

                config.setAllowedHeaders(List.of("*"));
                config.setExposedHeaders(
                    List.of(
                        "Authorization",
                        "Content-Disposition"
                    )
                );
                config.setAllowCredentials(true);

                return config;
            }))

            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

                // Allow browser preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public authentication endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Allow export requests from the React frontend
                .requestMatchers("/api/export", "/api/export/**").permitAll()

                // Temporarily open invoices while testing
                .requestMatchers("/api/invoices/**").permitAll()

                // Protected endpoints
                .requestMatchers("/api/sales/**")
                    .hasAnyRole("GROWTH", "PRO", "ENTERPRISE")

                .requestMatchers("/api/clients/**")
                    .hasAnyRole("GROWTH", "PRO", "ENTERPRISE")

                .requestMatchers("/api/products/**")
                    .hasAnyRole("GROWTH", "PRO", "ENTERPRISE")

                .requestMatchers("/api/territory/**")
                    .hasAnyRole("PRO", "ENTERPRISE")

                // Everything else requires login
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
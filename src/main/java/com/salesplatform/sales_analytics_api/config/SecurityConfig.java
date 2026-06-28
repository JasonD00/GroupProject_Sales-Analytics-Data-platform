package com.salesplatform.sales_analytics_api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/*

    Testing endpoints, Spring Security locks down endpoints at default so I must open them up here.
    This config will have to change and only servers as testing for the DB connection.

*/

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtAuthFilter;

    //used by AuthService 
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()

                        // All users of each tier can access - sales, clients and products
                        .requestMatchers("/api/sales/**").hasAnyRole("GROWTH", "PRO", "ENTERPRISE")
                        .requestMatchers("/api/clients/**").hasAnyRole("GROWTH", "PRO", "ENTERPRISE")
                        .requestMatchers("/api/products/**").hasAnyRole("GROWTH", "PRO", "ENTERPRISE")

                        // Pro and Enterprise can use these
                        .requestMatchers("/api/territory/**").hasAnyRole("PRO","ENTERPRISE")

                        // Enterprise Only
                        .requestMatchers("/api/invoices/**").hasAnyRole("ENTERPRISE")

                        .anyRequest().authenticated()
                )

        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
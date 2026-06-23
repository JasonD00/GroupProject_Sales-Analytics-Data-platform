package com.salesplatform.sales_analytics_api.config;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
/*
       JWT Config

       The class is responsible for creating JWTs and reading data out of them. It checks if the token is valid based on expiration date.

       Handle token operations

       generateToken (username, tier): signed token, embed username and tier

       extractUsername (pull username from token)
       extractTier (pull tier from token)
       isTokenValid (check if token is expired)

       Good reference point for the project which helped alot:
       https://github.com/jwtk/jjwt
       Quickstart section specifically handles Claims and builder methods.

 */

@Component
public class JwtConfig {

    @Value("${JWT_SECRET}")
    private String secret;


    private static final long EXPIRATION_TIME = 864_000_000; // auto gend, temp aswell

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Gen a JWT token for a user
    // embed the username and tier as claims so they ccan be read later
    public String generateToken(String username, String tier) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tier", tier);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract username for the token
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // Extract tier form token
    public String extractTier(String token) {
        return extractClaims(token).get("tier", String.class);
    }

    // Check if token is still valid
    public boolean isTokenValid(String token) {
        return extractClaims(token).getExpiration().after(new Date());
    }


    // Pull claim s from tokens
    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


}

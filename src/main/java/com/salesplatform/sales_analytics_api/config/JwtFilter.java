package com.salesplatform.sales_analytics_api.config;

import com.salesplatform.sales_analytics_api.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/*      JwtFilter

        Filter runs once per request, checks for a Bearer token in the
        Authorization header, and validates it, if it is valid, the user is
        authenticated int Spring Security context.



 */

@Component("jwtAuthFilter")
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtConfig jwtConfig;
    private final UserRepository userRepository;

    // Filter logic, receive requests and responses and the rest of the filter chain
    @Override
    protected void doFilterInternal(
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain
    ) throws IOException, ServletException {

        // skip filter entirely for auth endpoints (my docker issues fix)
        String path = req.getRequestURI();
        if (path.startsWith("/api/auth/")) {
            chain.doFilter(req, res);
            return;
        }

        // Read the auth header from request
        final String authorizationHeader = req.getHeader("Authorization");

        // if the header is not there or there is no Bearer token, continue and pass forward
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }

        // Remove Bearer prefix
        final String token = authorizationHeader.substring(7);

        try {
            final String username = jwtConfig.extractUsername(token); // read username from the token
            final String tier = jwtConfig.extractTier(token); // read tier claim from the token

            // Check if the username exists, the token has expired or no auth has been sent for this req
            if(username != null && jwtConfig.isTokenValid(token)
                && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Spring security roles from tier: GROWTH, PRO etc..
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + tier)
                );

                // Authenticated user object is created, pword is null as auth is handed by token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, null, authorities);
                authToken.setDetails (
                        new WebAuthenticationDetailsSource().buildDetails(req)
                );

                    // store authenticated user in Spring Security context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
        }

    } catch (Exception e) {
            SecurityContextHolder.clearContext();
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.getWriter().write("Invalid or Expired token");
            return;
        }
        chain.doFilter(req, res);
    }
}
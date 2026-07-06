package com.salesplatform.sales_analytics_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

    /*
            Lets the frontend running at: localhost:5173 call backend endpoints via /api/
            Allows basic Http methods and allows headers

     */

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // mapped to api routes
                .allowedOrigins("http://localhost:5173") // allowed requests, if we use observable later we add this here too
                .allowedMethods("GET", "POST", "PUT", "DELETE") // allow basic methods
                .allowedHeaders("*")
                .allowCredentials(false)
                .exposedHeaders("Authorization");
    }
}


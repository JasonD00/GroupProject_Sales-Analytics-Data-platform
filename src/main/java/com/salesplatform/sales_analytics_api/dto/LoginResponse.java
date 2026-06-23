package com.salesplatform.sales_analytics_api.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
      Login Response DTO

      Return on successful login and will contain a JWT token and use tier

        Front end stores token and sends it in the auth header on very req
        (bearer)
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private String tier;
}

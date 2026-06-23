package com.salesplatform.sales_analytics_api.dto;
import lombok.Data;

 /*
        Login Request DTO

        Request body for POST auth/login
        Will contain teh credentials the user sends to log in
 */

@Data
public class LoginRequest {
    private String username;
    private String password;

}

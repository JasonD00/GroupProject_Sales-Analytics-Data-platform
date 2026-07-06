package com.salesplatform.sales_analytics_api.dto;

import lombok.Data;

/*
    Register Request DTO

    Incoming request for POST auth/register
    Contains user details needed to create a new user

    username
    password
    tier
 */

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String tier;
}
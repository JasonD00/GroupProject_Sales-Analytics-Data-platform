package com.salesplatform.sales_analytics_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class SalesAnalyticsApiApplication {

	public static void main(String[] args) {
		// TEMPORARY — prints hash then starts app
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("Hash: " + encoder.encode("Admin123!"));
		SpringApplication.run(SalesAnalyticsApiApplication.class, args);
	}

}

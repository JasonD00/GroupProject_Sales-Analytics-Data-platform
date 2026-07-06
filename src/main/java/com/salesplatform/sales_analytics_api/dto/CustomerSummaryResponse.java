package com.salesplatform.sales_analytics_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/*
    Client Summary Response DTO

    Aggregated customer data via ClientRepo
    gold.dim_clients = client info
    gold.fact_sales = sales per client


 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerSummaryResponse {

    private Integer clientId;
    private String firstName;
    private String lastName;
    private String country;
    private String clientSegment;
    private String accountStatus;
    private Double totalSpend;
    private Long orderCount;
    private Double avgOrder;
    private LocalDate lastOrderDate;
}
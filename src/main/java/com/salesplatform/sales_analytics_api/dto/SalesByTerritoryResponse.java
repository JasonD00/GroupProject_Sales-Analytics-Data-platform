package com.salesplatform.sales_analytics_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
        Sales By Territory

        Aggregated sales by:
        gold.fact_sales = sales amount
        gold.dim_territory = country and segment
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalesByTerritoryResponse {

    private String country;
    private String clientSegment;
    private Double totalRevenue;
    private Long totalOrders;
    private Double avgOrderValue;
}
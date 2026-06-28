package com.salesplatform.sales_analytics_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
    Product Summary Response

    Aggregated product data:
    gold.dim_products = product_info
    gold.fact_sales = sales data per product
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductSummaryResponse {

    private Integer productId;
    private String productName;
    private String category;
    private String subcategory;
    private Integer cost;
    private String productType;
    private Long soldAmount;
    private Double totalRevenue;
}

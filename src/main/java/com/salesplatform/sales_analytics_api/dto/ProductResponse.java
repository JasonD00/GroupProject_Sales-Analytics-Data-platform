package com.salesplatform.sales_analytics_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/*
       Product Response DTO

       Source - Target Mapping = gold layer
       Response DTO, what is sent to the frontend when a product is requested.

       It mirrors gold.dim_products but exists to carry data.
       Product entity is mapped to this DTO inside the service layer.


*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long productKey;
    private Integer productId;
    private String productNumber;
    private String productName;
    private Integer cost;
    private String productType;
    private String category;
    private String subcategory;
    private String maintenance;
    private Integer productLevel;
    private LocalDate startDate;
}

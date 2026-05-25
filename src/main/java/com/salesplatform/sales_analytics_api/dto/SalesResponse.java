package com.salesplatform.sales_analytics_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/*
       Sales Response DTO

       It mirrors fact.sales but exists to carry data.
       Sales entity is mapped to this DTO inside the service layer.
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesResponse {

    private String orderNumber;
    private Long clientKey;
    private Long productKey;
    private Long territoryKey;
    private Long invoiceStatusKey;
    private LocalDate orderDate;
    private LocalDate shipDate;
    private LocalDate dueDate;
    private Double salesAmount;
    private Integer quantity;
    private Double price;
}

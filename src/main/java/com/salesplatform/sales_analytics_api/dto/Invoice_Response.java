package com.salesplatform.sales_analytics_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
       Invoice Response DTO

       Source - Target Mapping = gold layer
       Response DTO, what is sent to the frontend when a client is requested.

       It mirrors gold.dim_invoice_status but exists to carry data.
       Invoice entity is mapped to this DTO inside the service layer.



*/

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Invoice_Response {

    private Long invoiceStatusKey;
    private String invoiceStatus;
}
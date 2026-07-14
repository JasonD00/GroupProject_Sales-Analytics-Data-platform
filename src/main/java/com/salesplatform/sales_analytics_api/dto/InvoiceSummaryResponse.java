/*
Sarah Molloy
*/
package com.salesplatform.sales_analytics_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/*
    Invoice Summary Response

    Aggregated invoice data from:
    gold.fact_sales
    gold.dim_clients
    gold.dim_invoice_status
*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceSummaryResponse {

    private String orderNumber;
    private String customerName;
    private Double salesAmount;
    private LocalDate orderDate;
    private LocalDate dueDate;
    private String invoiceStatus;
}
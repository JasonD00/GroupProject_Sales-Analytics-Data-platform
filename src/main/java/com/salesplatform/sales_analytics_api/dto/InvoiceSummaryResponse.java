package com.salesplatform.sales_analytics_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

/*
        Invoice Summary Response

        Aggregated invoice data:
        gold.fact_sales = amount and dates
        gold.dim_clients = customer name
        gold.dim_invoice_status = invoice status
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceSummaryResponse {

    private String orderNumber;
    public String customerName;
    private Double salesAmount;
    private LocalDate orderDate;
    private LocalDate dueDate;
    private String invoiceStatus;
}
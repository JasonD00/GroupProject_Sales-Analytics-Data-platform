package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.dto.InvoiceSummaryResponse;
import com.salesplatform.sales_analytics_api.dto.Invoice_Response;
import com.salesplatform.sales_analytics_api.dto.TerritoryResponse;
import com.salesplatform.sales_analytics_api.entity.Invoice;
import com.salesplatform.sales_analytics_api.exception.ResourceNotFoundException;
import com.salesplatform.sales_analytics_api.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/*
       Invoice Service

       Business logic for Invoice data.
       Exists as a basic request for this data

       InvoiceController --> InvoiceService --> Invoice_Repository --> gold.invoice_status


      */

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    // Fetch all invoices
    public List<Invoice_Response> getAllInvoices() {
        return invoiceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Fetch invoice by id by (invoiceId)
    public Invoice_Response getInvoiceById(Long invoiceId) {
        Invoice invoice  = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException( "Invoice status not found via key: " + invoiceId));
        return mapToResponse(invoice);
    }

    // Fetch invoice summary
    // Joins fact_sales with dim_clients and dim_invoice_status
    public List<InvoiceSummaryResponse> getInvoiceSummary() {
        return invoiceRepository.findInvoiceSummary()
                .stream()
                .map(row -> InvoiceSummaryResponse.builder()
                        .orderNumber((String) row[0])
                        .customerName((String) row[1])
                        .salesAmount(((Number) row[2]).doubleValue())
                        .orderDate(row[3] != null ?
                                java.time.LocalDate.parse(row[3].toString()) : null)
                        .dueDate(row[4] != null ?
                                java.time.LocalDate.parse(row[4].toString()) : null)
                        .invoiceStatus((String) row[5])
                        .build())
                .collect(Collectors.toList());
    }

    private Invoice_Response mapToResponse(Invoice invoice) {
        return Invoice_Response.builder()
                .invoiceStatusKey(invoice.getInvoiceStatusKey())
                .invoiceStatus(invoice.getInvoiceStatus())
                .build();
    }


}

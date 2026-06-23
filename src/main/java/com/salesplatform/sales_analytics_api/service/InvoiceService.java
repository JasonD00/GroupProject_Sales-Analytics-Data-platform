package com.salesplatform.sales_analytics_api.service;

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

    private InvoiceRepository invoiceRepository;

    public List<Invoice_Response> getAllInvoices() {
        return invoiceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Invoice_Response getInvoiceById(Long invoiceId) {
        Invoice invoice  = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException( "Invoice status not found via key: " + invoiceId));
        return mapToResponse(invoice);
    }

    private Invoice_Response mapToResponse(Invoice invoice) {
        return Invoice_Response.builder()
                .invoiceStatusKey(invoice.getInvoiceStatusKey())
                .invoiceStatus(invoice.getInvoiceStatus())
                .build();
    }


}

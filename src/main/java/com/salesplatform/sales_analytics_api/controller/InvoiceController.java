package com.salesplatform.sales_analytics_api.controller;

import com.salesplatform.sales_analytics_api.dto.Invoice_Response;
import com.salesplatform.sales_analytics_api.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/invoice_status")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<Invoice_Response>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices()); 
    }
}
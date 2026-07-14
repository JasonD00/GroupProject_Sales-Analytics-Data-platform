/*
Sarah Molloy
*/
package com.salesplatform.sales_analytics_api.controller;

import com.salesplatform.sales_analytics_api.dto.InvoiceSummaryResponse;
import com.salesplatform.sales_analytics_api.dto.Invoice_Response;
import com.salesplatform.sales_analytics_api.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/*
    Invoice Controller

    Entry point for HTTP requests relating to invoice data.
*/

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    // GET /api/invoices
    // Returns the available invoice statuses.
    @GetMapping
    public ResponseEntity<List<Invoice_Response>> getAllInvoiceStatuses() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    // GET /api/invoices/summary
    // Returns invoice rows with customer, amount, dates and status.
    @GetMapping("/summary")
    public ResponseEntity<List<InvoiceSummaryResponse>> getInvoiceSummary() {
        return ResponseEntity.ok(invoiceService.getInvoiceSummary());
    }

    // GET /api/invoices/1
    // Returns one invoice status by its key.
    @GetMapping("/{invoiceStatusKey}")
    public ResponseEntity<Invoice_Response> getInvoiceById(
            @PathVariable Long invoiceStatusKey
    ) {
        return ResponseEntity.ok(
                invoiceService.getInvoiceById(invoiceStatusKey)
        );
    }
}
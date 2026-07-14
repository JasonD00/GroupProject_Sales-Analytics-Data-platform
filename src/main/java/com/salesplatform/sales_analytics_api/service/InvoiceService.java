/*
Sarah Molloy
*/
package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.dto.InvoiceSummaryResponse;
import com.salesplatform.sales_analytics_api.dto.Invoice_Response;
import com.salesplatform.sales_analytics_api.dto.TerritoryResponse;
import com.salesplatform.sales_analytics_api.entity.Invoice;
import com.salesplatform.sales_analytics_api.exception.ResourceNotFoundException;
import com.salesplatform.sales_analytics_api.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

/*
    Invoice Service

    InvoiceController
        -> InvoiceService
        -> InvoiceRepository
        -> gold database tables
*/

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    // Fetch all invoice statuses.
    public List<Invoice_Response> getAllInvoices() {
        return invoiceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Fetch one invoice status by its key.
    public Invoice_Response getInvoiceById(Long invoiceStatusKey) {
        Invoice invoice = invoiceRepository.findById(invoiceStatusKey)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Invoice status not found via key: "
                                        + invoiceStatusKey
                        )
                );

        return mapToResponse(invoice);
    }

    // Fetch full invoice summary.
    public List<InvoiceSummaryResponse> getInvoiceSummary() {
        return invoiceRepository.findInvoiceSummary()
                .stream()
                .map(this::mapSummaryRow)
                .toList();
    }

    private InvoiceSummaryResponse mapSummaryRow(Object[] row) {
        return InvoiceSummaryResponse.builder()
                .orderNumber(row[0] != null
                        ? row[0].toString()
                        : null)

                .customerName(row[1] != null
                        ? row[1].toString()
                        : "Unknown customer")

                .salesAmount(row[2] instanceof Number
                        ? ((Number) row[2]).doubleValue()
                        : 0.0)

                .orderDate(convertToLocalDate(row[3]))

                .dueDate(convertToLocalDate(row[4]))

                .invoiceStatus(row[5] != null
                        ? row[5].toString()
                        : "N/A")

                .build();
    }

    private LocalDate convertToLocalDate(Object value) {
        if (value == null) {
            return null;
        }

        if (value instanceof LocalDate localDate) {
            return localDate;
        }

        if (value instanceof Date sqlDate) {
            return sqlDate.toLocalDate();
        }

        return LocalDate.parse(value.toString());
    }

    private Invoice_Response mapToResponse(Invoice invoice) {
        return Invoice_Response.builder()
                .invoiceStatusKey(invoice.getInvoiceStatusKey())
                .invoiceStatus(invoice.getInvoiceStatus())
                .build();
    }
}
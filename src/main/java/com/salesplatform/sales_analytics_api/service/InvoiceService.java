package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.dto.Invoice_Response;
import com.salesplatform.sales_analytics_api.dto.TerritoryResponse;
import com.salesplatform.sales_analytics_api.entity.Invoice;
import com.salesplatform.sales_analytics_api.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public List<Invoice_Response> getAllInvoices() {   
        return invoiceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Invoice_Response mapToResponse(Invoice invoice) { 
        return Invoice_Response.builder()
                .invoiceStatusKey(invoice.getInvoiceStatusKey())
                .invoiceStatus(invoice.getInvoiceStatus())
                .build();
    }
}
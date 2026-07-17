package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.dto.Invoice_Response;
import com.salesplatform.sales_analytics_api.entity.Invoice;
import com.salesplatform.sales_analytics_api.repository.InvoiceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @InjectMocks
    private InvoiceService invoiceService;

    // Functional Test 1
    // Get all Invoices

    @Test
    void getAllInvoices() {
        Invoice invoice1 = Invoice.builder().invoiceStatusKey(1L).invoiceStatus("Paid").build();
        Invoice invoice2 = Invoice.builder().invoiceStatusKey(2L).invoiceStatus("Pending").build();
        when(invoiceRepository.findAll()).thenReturn(List.of(invoice1, invoice2));

        List<Invoice_Response> result = invoiceService.getAllInvoices();

        assertEquals(2, result.size());
        verify(invoiceRepository, times(1)).findAll();


    }

}

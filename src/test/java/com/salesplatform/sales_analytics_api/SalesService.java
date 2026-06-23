package com.salesplatform.sales_analytics_api;

import com.salesplatform.sales_analytics_api.dto.SalesResponse;
import com.salesplatform.sales_analytics_api.entity.Sales;
import com.salesplatform.sales_analytics_api.repository.SaleRepository;
import com.salesplatform.sales_analytics_api.service.SalesService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SalesServiceTest {

    @Mock
    private SaleRepository saleRepository;

    @InjectMocks
    private SalesService salesService;

    private Sales sale;

    @BeforeEach
    void setUp() {
        sale = Sales.builder()
                .orderNumber("ORD-001")
                .clientKey(1L)
                .productKey(100L)
                .territoryKey(10L)
                .invoiceStatusKey(1L)
                .orderDate(LocalDate.of(2025, 1, 1))
                .shipDate(LocalDate.of(2025, 1, 2))
                .dueDate(LocalDate.of(2025, 1, 5))
                .salesAmount(500.0)
                .quantity(2)
                .price(250.0)
                .build();
    }

    @Test
    void getAllSales_returnsMappedSalesResponses() {

        when(saleRepository.findAll())
                .thenReturn(List.of(sale));

        List<SalesResponse> result = salesService.getAllSales();

        assertEquals(1, result.size());

        SalesResponse response = result.get(0);

        assertEquals("ORD-001", response.getOrderNumber());
        assertEquals(500.0, response.getSalesAmount());

        verify(saleRepository).findAll();
    }

}

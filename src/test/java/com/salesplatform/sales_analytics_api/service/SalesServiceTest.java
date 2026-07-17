package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.dto.SalesResponse;
import com.salesplatform.sales_analytics_api.entity.Sales;
import com.salesplatform.sales_analytics_api.repository.SaleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SalesServiceTest {

    @Mock
    SaleRepository saleRepository;

    @InjectMocks
    private SalesService salesService;

    // Functional Test 1
    // Get all sales

    @Test
    void getAllSales() {
        Sales sale1 = Sales.builder().clientKey(1L).orderNumber("1").price(500.50).build();
        Sales sale2 = Sales.builder().clientKey(2L).orderNumber("2").price(300.50).build();
        when(saleRepository.findAll()).thenReturn(List.of(sale1, sale2));

        List<SalesResponse> result = salesService.getAllSales();

        assertEquals(2, result.size());
        verify(saleRepository, times(1)).findAll();
    }
}

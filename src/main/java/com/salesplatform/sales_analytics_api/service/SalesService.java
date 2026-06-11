package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.dto.SalesResponse;
import com.salesplatform.sales_analytics_api.entity.Sales;
import com.salesplatform.sales_analytics_api.repository.SaleRepository;
import com.salesplatform.sales_analytics_api.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/*
       Sales Service

       Business logic for Sales data:
       Exists as:
       SaleController --> SalesService --> SaleRepository --> gold.fact_sales


       Methods:
       getAllSales():           fetches every sales record from gold.fact_sales
       getSaleByOrderNumber():  fetches a single sale by its order_number (the natural key)
       mapToResponse(sales):    converts a Sales entity into a SalesResponse DTO
*/

@Service
@RequiredArgsConstructor
public class SalesService {

    private final SaleRepository saleRepository;

    // Fetch all sales records from gold.fact_sales
    public List<SalesResponse> getAllSales() {
        return saleRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Fetch a single sale by order_number
    public SalesResponse getSaleByOrderNumber(String orderNumber) {
        Sales sale = saleRepository.findById(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sale not found with order number: " + orderNumber));
        return mapToResponse(sale);
    }

    // Fetch sales for a client by client key
    public List<SalesResponse> getSalesByClient(Long clientKey) {
        return saleRepository.findByClientKey(clientKey)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Fetch all sales for a product by the product key
    public List<SalesResponse> getSalesByProduct(Long productKey) {
        return saleRepository.findByProductKey(productKey)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Fetch sales between a certain 2 dates
    public List<SalesResponse> getSalesByDateRange(LocalDate start, LocalDate end) {
        return saleRepository.findByOrderDateBetween(start,end)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Sum of all sales amount, via the fact (sales) table
    public Double getTotalRevenue() {
        return saleRepository.findAll()
                .stream()
                .mapToDouble(s -> s.getSalesAmount() != null ? s.getSalesAmount() : 0.0)
                .sum();
    }



    // Maps a Sales entity --> SalesResponse DTO
    private SalesResponse mapToResponse(Sales sale) {
        return SalesResponse.builder()
                .orderNumber(sale.getOrderNumber())
                .clientKey(sale.getClientKey())
                .productKey(sale.getProductKey())
                .territoryKey(sale.getTerritoryKey())
                .invoiceStatusKey(sale.getInvoiceStatusKey())
                .orderDate(sale.getOrderDate())
                .shipDate(sale.getShipDate())
                .dueDate(sale.getDueDate())
                .salesAmount(sale.getSalesAmount())
                .quantity(sale.getQuantity())
                .price(sale.getPrice())
                .build();
    }
}
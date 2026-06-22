package com.salesplatform.sales_analytics_api.controller;

import com.salesplatform.sales_analytics_api.dto.SalesResponse;
import com.salesplatform.sales_analytics_api.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/*
       Sale Controller

       Entry point for HTTP requests (Sales data)

       Endpoints:
       GET /api/sales                     returns all sales from gold.fact_sales
       GET /api/sales/{orderNumber}       returns a single sale by its order_number


*/

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SalesService salesService;

    // GET /api/sales
    // Returns all sales records as a list of SalesResponse DTOs
    @GetMapping
    public ResponseEntity<List<SalesResponse>> getAllSales() {

        return ResponseEntity.ok(salesService.getAllSales());
    }

    // GET /api/sales/{orderNumber}
    // Returns a single sale matching the given order_number
    // Returns 404 via ResourceNotFoundException
    @GetMapping("/{orderNumber}")
    public ResponseEntity<SalesResponse> getSaleByOrderNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(salesService.getSaleByOrderNumber(orderNumber));
    }

    // GET /api/sales/client/product/{clientKey}
    @GetMapping("/client/{clientKey}")
    public ResponseEntity<List<SalesResponse>> getSaleByClientKey(@PathVariable Long clientKey) {
        return ResponseEntity.ok(salesService.getSalesByClient(clientKey));
    }

    // GET /api/sales/total-revenue
    @GetMapping("/total-revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        return ResponseEntity.ok(salesService.getTotalRevenue());
    }

}
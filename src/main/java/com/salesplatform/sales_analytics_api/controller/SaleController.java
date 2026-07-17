//Shemen
package com.salesplatform.sales_analytics_api.controller;

import com.salesplatform.sales_analytics_api.dto.SalesByTerritoryResponse;
import com.salesplatform.sales_analytics_api.dto.SalesResponse;
import com.salesplatform.sales_analytics_api.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SalesService salesService;


    // returns all sales records 
    @GetMapping
    public ResponseEntity<List<SalesResponse>> getAllSales() {

        return ResponseEntity.ok(salesService.getAllSales());
    }

    
    // returns a sales record by order number
    @GetMapping("/{orderNumber}")
    public ResponseEntity<SalesResponse> getSaleByOrderNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(salesService.getSaleByOrderNumber(orderNumber));
    }

    // returns all sales records for a client by client key
    @GetMapping("/client/{clientKey}")
    public ResponseEntity<List<SalesResponse>> getSaleByClientKey(@PathVariable Long clientKey) {
        return ResponseEntity.ok(salesService.getSalesByClient(clientKey));
    }

    // returns total revenue from all sales records
    @GetMapping("/total-revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        return ResponseEntity.ok(salesService.getTotalRevenue());
    }

    // returns all sales records for a product by product key
    @GetMapping("/product/{productKey}")
    public ResponseEntity<List<SalesResponse>> getSalesByProduct(@PathVariable Long productKey) {
        return ResponseEntity.ok(salesService.getSalesByProduct(productKey));
    }

    // returns all sales records for a date range
    @GetMapping("/date")
    public ResponseEntity<List<SalesResponse>> getSalesByDateRange(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {
        return ResponseEntity.ok(salesService.getSalesByDateRange(start, end));
    }

    
    // returns aggregated sales data grouped by country and segment
    @GetMapping("/territory")
    public ResponseEntity<List<SalesByTerritoryResponse>> getSalesByTerritory() {
        return ResponseEntity.ok(salesService.getSalesByTerritory());
    }

}
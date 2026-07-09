package com.salesplatform.sales_analytics_api.controller;

import com.salesplatform.sales_analytics_api.entity.Sales;
import com.salesplatform.sales_analytics_api.service.SaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
public class SaleController {

    private final SaleService service;

    public SaleController(SaleService service) {
        this.service = service;
    }


    @GetMapping
    public List<Sales> getAllSales() {
        return service.getAllSales();
    }


    @GetMapping("/{orderNumber}")
    public Sales getSaleById(@PathVariable String orderNumber) {
        return service.getSaleById(orderNumber);
    }


    @PostMapping
    public Sales createSale(@RequestBody Sales sale) {
        return service.saveSale(sale);
    }
}
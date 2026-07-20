package com.salesplatform.sales_analytics_api.controller;

import com.salesplatform.sales_analytics_api.dto.ProductResponse;
import com.salesplatform.sales_analytics_api.dto.ProductSummaryResponse;
import com.salesplatform.sales_analytics_api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/*
       Product Controller

       Entry point for HTTP requests (Product data)

       Endpoints:
       GET /api/products                returns all products from gold.dim_products
       GET /api/products/{productKey}   returns a single product by their product_key

*/

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // GET /api/products
    // Returns all products as a list of ProductResponse DTOs
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // GET /api/products/{productKey}
    // Returns a single product matching the given product_key
    // Returns 404 via ResourceNotFoundException
    @GetMapping("/{productKey}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long productKey) {
        return ResponseEntity.ok(productService.getProductById(productKey));
    }

    // GET /api/products/summary
    // Returns all products with aggregated sales data
    @GetMapping("/summary")
    public ResponseEntity<List<ProductSummaryResponse>> getProductSummary() {
        return ResponseEntity.ok(productService.getProductSummary());
    }
}
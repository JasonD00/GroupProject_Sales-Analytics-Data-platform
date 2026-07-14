//Shemen
package com.salesplatform.sales_analytics_api.controller;

import com.salesplatform.sales_analytics_api.dto.ProductResponse;
import com.salesplatform.sales_analytics_api.dto.ProductSummaryResponse;
import com.salesplatform.sales_analytics_api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;



@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // returns all products
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // returns a single product matching the given product_key
    // returns 404 via ResourceNotFoundException
    @GetMapping("/{productKey}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long productKey) {
        return ResponseEntity.ok(productService.getProductById(productKey));
    }

    // returns aggregated product summary
    @GetMapping("/summary")
    public ResponseEntity<List<ProductSummaryResponse>> getProductSummary() {
        return ResponseEntity.ok(productService.getProductSummary());
    }
}
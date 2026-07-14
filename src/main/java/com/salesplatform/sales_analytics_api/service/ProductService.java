//Shemen
package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.dto.ProductResponse;
import com.salesplatform.sales_analytics_api.dto.ProductSummaryResponse;
import com.salesplatform.sales_analytics_api.entity.Product;
import com.salesplatform.sales_analytics_api.repository.ProductRepository;
import com.salesplatform.sales_analytics_api.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // gets all products
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // gets a single product by product_key
    public ProductResponse getProductById(Long productKey) {
        Product product = productRepository.findById(productKey)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with key: " + productKey));
        return mapToResponse(product);
    }

    // gets aggregated product summary
    // joins dim_products with fact_sales for sold amount and total revenue
    public List<ProductSummaryResponse> getProductSummary() {
        return productRepository.findProductSummary()
                .stream()
                .map(row -> ProductSummaryResponse.builder()
                        .productId(((Number) row[0]).intValue())
                        .productName((String) row[1])
                        .category((String) row[2])
                        .subcategory((String) row[3])
                        .cost(((Number) row[4]).intValue())
                        .productType((String) row[5])
                        .soldAmount(((Number) row[6]).longValue())
                        .totalRevenue(((Number) row[7]).doubleValue())
                        .build())
                .collect(Collectors.toList());
    }

    // Maps a Product entity ProductResponse DTO
    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .productKey(product.getProductKey())
                .productId(product.getProductId())
                .productNumber(product.getProductNumber())
                .productName(product.getProductName())
                .cost(product.getCost())
                .productType(product.getProductType())
                .category(product.getCategory())
                .subcategory(product.getSubcategory())
                .maintenance(product.getMaintenance())
                .productLevel(product.getProductLevel())
                .startDate(product.getStartDate())
                .build();
    }
}
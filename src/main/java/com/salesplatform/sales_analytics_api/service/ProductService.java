package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.dto.ProductResponse;
import com.salesplatform.sales_analytics_api.entity.Product;
import com.salesplatform.sales_analytics_api.repository.ProductRepository;
import com.salesplatform.sales_analytics_api.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/*
       Product Service

       Business logic for Client data.
       Exists as:
       ProductController --> ProductService --> ProductRepository --> gold.dim_products

       Methods:
       getAllProducts()         fetches every product from gold.dim_products
       getProductById(id)       fetches a single product by their product_key
       mapToResponse(product)   converts a Product entity into a ProductResponse DTO
*/

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // Fetch all products from gold.dim_products
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Fetch a single product by product_key
    public ProductResponse getProductById(Long productKey) {
        Product product = productRepository.findById(productKey)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with key: " + productKey));
        return mapToResponse(product);
    }

    // Maps a Product entity --> ProductResponse DTO
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
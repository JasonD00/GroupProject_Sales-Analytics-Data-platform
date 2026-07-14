package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.dto.ProductResponse;
import com.salesplatform.sales_analytics_api.entity.Product;
import com.salesplatform.sales_analytics_api.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    // Functional Test 2
    // Get all Products

    @Test
    void getAllProducts() {
        Product product1 = Product.builder().productKey(1L).productName("Mountain Bike").productType("Cycling").build();
        Product product2 = Product.builder().productKey(2L).productName("Helmet").productType("Safety").build();
        when(productRepository.findAll()).thenReturn(List.of(product1, product2));

        List<ProductResponse> result = productService.getAllProducts();

        assertEquals(2, result.size());
        verify(productRepository, times(1)).findAll();
    }
}

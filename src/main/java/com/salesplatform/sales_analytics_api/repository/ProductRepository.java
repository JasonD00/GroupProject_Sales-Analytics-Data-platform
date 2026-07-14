//Shemen
package com.salesplatform.sales_analytics_api.repository;

import com.salesplatform.sales_analytics_api.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = """
        SELECT 
            p.product_id,
            p.product_name,
            p.category,
            p.subcategory,
            p.cost,
            p.product_type,
            COALESCE(SUM(s.quantity), 0) AS sold_amount,
            COALESCE(SUM(s.sales_amount), 0) AS total_revenue
         FROM gold.dim_products p 
         LEFT JOIN gold.fact_sales s ON p.product_key = s.product_key
         GROUP BY
             p.product_id,
             p.product_name,
             p.category,
             p.subcategory,
             p.cost,
             p.product_type
         ORDER BY total_revenue DESC
         """, nativeQuery = true)
    List<Object[]> findProductSummary();
}
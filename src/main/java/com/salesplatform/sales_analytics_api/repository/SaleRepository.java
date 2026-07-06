package com.salesplatform.sales_analytics_api.repository;

import com.salesplatform.sales_analytics_api.entity.Sales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/*
       Sale Repository

       Handles all database access for the Sales entity.
       Extends JpaRepository which gives us standard CRUD methods

       Mapped to: gold.fact_sales (read-only view)
       JpaRepository<Sales, String> - Sales is the entity, order number being a String

       Inherited methods used:
       findAll()
       findById(id)

       Custom query: join dim_clients, dim_territory from fact_sales
       return total revenue, and order details by customer segment
*/

@Repository
public interface SaleRepository extends JpaRepository<Sales, String> {

    List<Sales> findByClientKey(Long clientKey);

    List<Sales> findByProductKey(Long productKey);

    List<Sales> findByOrderDateBetween(LocalDate start, LocalDate end);

    @Query(value = """
        SELECT
             t.country,
             t.client_segment,
             COALESCE(SUM(s.sales_amount), 0) AS total_revenue,
             COUNT(s.order_number)            AS total_orders,
             COALESCE(AVG(s.sales_amount), 0) AS avg_order_value
        FROM gold.fact_sales s 
        LEFT JOIN gold.dim_clients c ON s.client_key = c.client_key
        LEFT JOIN gold.dim_territory t ON c.country = t.country
             AND c.client_segment = t.client_segment
        GROUP BY 
             t.country,
             t.client_segment
        ORDER BY total_revenue DESC 
         """, nativeQuery = true)
    List<Object[]> findSalesByTerritory();

}
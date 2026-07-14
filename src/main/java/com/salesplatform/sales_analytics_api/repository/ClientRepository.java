/*
Sarah Molloy
*/
package com.salesplatform.sales_analytics_api.repository;

import com.salesplatform.sales_analytics_api.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
       Client Repository

       Handles all database access for the Product entity.

       Mapped to: gold.dim_clients (read-only view)
       JpaRepository<Client, Long> Client is the entity, client_key is Long

       Inherited methods used:
       findAll()
       findById(id)

       Custom query: join dim_clients with fact_sales
       Return spend, orders, avg and last order

*/
@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    @Query(value = """

        SELECT
            c.client_id,
            c.first_name,
            c.last_name,
            c.country,
            c.client_segment,
            c.account_status,
            COALESCE(SUM(s.sales_amount),0) AS total_spend,
            COUNT(s.order_number)           AS order_count,
            COALESCE(AVG(s.sales_amount), 0) AS avg_order,
            MAX(s.order_date)
        FROM gold.dim_clients c
        LEFT JOIN gold.fact_sales s ON c.client_key = s.client_key
        GROUP BY
             c.client_id,
             c.first_name,
             c.last_name,
             c.country,
             c.client_segment,
             c.account_status
        ORDER BY total_spend DESC
        """, nativeQuery = true)
    List<Object[]> findCustomerSummary();
        
    //used by ExportController for CSV export
    @Query(value = """
        SELECT c.*
        FROM gold.dim_clients c
        """, nativeQuery = true)
    List<Client> findClientsWithSales();

}
package com.salesplatform.sales_analytics_api.repository;

import com.salesplatform.sales_analytics_api.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Integer> {

    @Query(value = """
        SELECT 
            c.client_id,
            c.client_key,
            c.client_number,
            c.first_name,
            c.last_name,
            c.marital_status,
            c.gender,
            c.country,
            c.birth_date,
            c.account_status,
            c.client_segment,
            c.create_date,
            COALESCE(SUM(f.sales_amount), 0) AS total_spend,
            COUNT(f.order_number) AS orders,
            MAX(f.order_date) AS last_order
        FROM gold.dim_clients c
        LEFT JOIN gold.fact_sales f
            ON c.client_key = f.client_key
        GROUP BY
            c.client_id,
            c.client_key,
            c.client_number,
            c.first_name,
            c.last_name,
            c.marital_status,
            c.gender,
            c.country,
            c.birth_date,
            c.account_status,
            c.client_segment,
            c.create_date
        """, nativeQuery = true)
    List<Client> findClientsWithSales();
}
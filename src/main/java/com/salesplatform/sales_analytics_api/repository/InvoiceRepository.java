package com.salesplatform.sales_analytics_api.repository;

import com.salesplatform.sales_analytics_api.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

 /*
        InvoiceRepository

        Handles all database access for the Invoice entity.

       Mapped to: gold.dim_invoice_status (read-only view)

       Inherited methods used:
       findAll()
       findById(id)

       Custom query: join dim_invoice_status with fact_sales
       Return every order for customers
  */

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice,Long> {

    @Query(value = """
        SELECT
            s.order_number,
            CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
            s.sales_amount,
            s.order_date,
            s.due_date,
            COALESCE(i.invoice_status, 'n/a')      AS invoice_status
        FROM gold.fact_sales s
        LEFT JOIN gold.dim_clients c
            ON s.client_key = c.client_key
        LEFT JOIN gold.dim_invoice_status i
            ON s.invoice_status_key = i.invoice_status_key
        ORDER BY s.order_date DESC
        """, nativeQuery = true)
    List<Object[]> findInvoiceSummary();

}
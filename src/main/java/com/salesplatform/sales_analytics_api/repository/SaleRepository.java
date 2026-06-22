package com.salesplatform.sales_analytics_api.repository;

import com.salesplatform.sales_analytics_api.entity.Sales;
import org.springframework.data.jpa.repository.JpaRepository;
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

*/

@Repository
public interface SaleRepository extends JpaRepository<Sales, String> {

    List<Sales> findByClientKey(Long clientKey);

    List<Sales> findByProductKey(Long productKey);

    List<Sales> findByOrderDateBetween(LocalDate start, LocalDate end);
}
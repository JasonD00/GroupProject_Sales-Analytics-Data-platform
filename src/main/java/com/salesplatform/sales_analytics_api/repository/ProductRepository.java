package com.salesplatform.sales_analytics_api.repository;

import com.salesplatform.sales_analytics_api.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
       Product Repository

       Handles all database access for the Product entity.

       Mapped to: gold.dim_products (read-only view)
       JpaRepository<Product, Long> Product is the entity, product_key is Long

       Inherited methods used:
       findAll()
       findById(id)

*/

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

}
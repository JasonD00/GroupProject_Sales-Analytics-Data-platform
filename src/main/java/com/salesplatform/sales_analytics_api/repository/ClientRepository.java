package com.salesplatform.sales_analytics_api.repository;

import com.salesplatform.sales_analytics_api.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
       Client Repository

       Handles all database access for the Product entity.

       Mapped to: gold.dim_clients (read-only view)
       JpaRepository<Client, Long> Client is the entity, client_key is Long

       Inherited methods used:
       findAll()
       findById(id)

*/

public interface ClientRepository extends JpaRepository<Client, Long> {

}

package com.salesplatform.sales_analytics_api.entity;

/*  SQL Client Template

    prod_id INT,
    prod_key NVARCHAR(50),
    prod_nm NVARCHAR(50),
    prod_cost INT,
    prod_type NVARCHAR(50),
    prod_start_dt DATETIME,
    prod_end_dt DATETIME

 */

import jakarta.persistence.*;
import java.time.LocalDateTime;

// Marks this class as a JPA entity
@Entity

// Maps this entity to the crm_product_info table in the bronze schema
@Table(name = "crm_product_info", schema = "bronze")
public class Product {

    // Primary key column
    @Id
    @Column(name = "prod_id")
    private Integer prodId;

    // Product key column
    @Column(name = "prod_key")
    private String productKey;

    // Product name column
    @Column(name = "prod_nm")
    private String name;

    // Product cost column
    @Column(name = "prod_cost")
    private Integer cost;

    // Product type column
    @Column(name = "prod_type")
    private String type;

    // Product start date column
    @Column(name = "prod_start_dt")
    private LocalDateTime startDate;

    // Product end date column
    @Column(name = "prod_end_dt")
    private LocalDateTime endDate;

    // Default constructor
    public Product() {
    }

    // Returns the product ID
    public Integer getProdId() {
        return prodId;
    }

    // Sets the product ID
    public void setProdId(Integer prodId) {
        this.prodId = prodId;
    }

    // Returns the product key
    public String getProductKey() {
        return productKey;
    }

    // Sets the product key
    public void setProductKey(String productKey) {
        this.productKey = productKey;
    }

    // Returns the product name
    public String getName() {
        return name;
    }

    // Sets the product name
    public void setName(String name) {
        this.name = name;
    }

    // Returns the product cost
    public Integer getCost() {
        return cost;
    }

    // Sets the product cost
    public void setCost(Integer cost) {
        this.cost = cost;
    }

    // Returns the product type
    public String getType() {
        return type;
    }

    // Sets the product type
    public void setType(String type) {
        this.type = type;
    }

    // Returns the product start date
    public LocalDateTime getStartDate() {
        return startDate;
    }

    // Sets the product start date
    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    // Returns the product end date
    public LocalDateTime getEndDate() {
        return endDate;
    }

    // Sets the product end date
    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
}


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

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String productKey;
    private String name;
    private int cost;
    private String type;

    public Product() {}

    public int getId() {
        return id;
    }

    public String getProductKey() {
        return productKey;
    }

    public void setProductKey(String productKey) {
        this.productKey = productKey;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCost() {
        return cost;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
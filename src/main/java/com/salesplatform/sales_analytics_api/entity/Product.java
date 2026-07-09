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
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "crm_product_info", schema = "bronze")
public class Product {

    @Id
    @Column(name = "prod_id")
    private Integer prodId;

    @Column(name = "prod_key", unique = true)
    private String productKey;

    @Column(name = "prod_nm")
    private String name;

    @Column(name = "prod_cost")
    private Integer cost;

    @Column(name = "prod_type")
    private String type;

    @Column(name = "prod_start_dt")
    private LocalDateTime startDate;

    @Column(name = "prod_end_dt")
    private LocalDateTime endDate;


    // One product can have many sales records
    @OneToMany(mappedBy = "product")
    @JsonManagedReference
    private List<Sales> sales;


    // Default constructor
    public Product() {
    }


    public Integer getProdId() {
        return prodId;
    }

    public void setProdId(Integer prodId) {
        this.prodId = prodId;
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


    public Integer getCost() {
        return cost;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }


    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }


    public List<Sales> getSales() {
        return sales;
    }

    public void setSales(List<Sales> sales) {
        this.sales = sales;
    }
}
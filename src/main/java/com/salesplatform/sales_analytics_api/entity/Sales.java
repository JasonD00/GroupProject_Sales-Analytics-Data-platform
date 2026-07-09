package com.salesplatform.sales_analytics_api.entity;

/*  SQL Client Template

    sales_ord_num NVARCHAR(50),
    sales_prd_key NVARCHAR(50),
    sales_client_id INT,
    sales_order_dt INT,
    sales_ship_dt INT,
    sales_due_dt INT,
    sales_sales INT,
    sales_quantity INT,
    sales_price INT

 */

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "crm_sales_info", schema = "bronze")
public class Sales {

    @Id
    @Column(name = "sales_ord_num")
    private String orderNumber;


    @ManyToOne
    @JoinColumn(
        name = "sales_prd_key",
        referencedColumnName = "prod_key"
    )
    @JsonBackReference
    private Product product;


    @Column(name = "sales_client_id")
    private Integer clientId;

    @Column(name = "sales_order_dt")
    private Integer orderDate;

    @Column(name = "sales_ship_dt")
    private Integer shipDate;

    @Column(name = "sales_due_dt")
    private Integer dueDate;

    @Column(name = "sales_sales")
    private Integer salesAmount;

    @Column(name = "sales_quantity")
    private Integer quantity;

    @Column(name = "sales_price")
    private Integer price;


    // Default constructor
    public Sales() {
    }


    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }


    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }


    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }


    public Integer getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Integer orderDate) {
        this.orderDate = orderDate;
    }


    public Integer getShipDate() {
        return shipDate;
    }

    public void setShipDate(Integer shipDate) {
        this.shipDate = shipDate;
    }


    public Integer getDueDate() {
        return dueDate;
    }

    public void setDueDate(Integer dueDate) {
        this.dueDate = dueDate;
    }


    public Integer getSalesAmount() {
        return salesAmount;
    }

    public void setSalesAmount(Integer salesAmount) {
        this.salesAmount = salesAmount;
    }


    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }


    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }
}
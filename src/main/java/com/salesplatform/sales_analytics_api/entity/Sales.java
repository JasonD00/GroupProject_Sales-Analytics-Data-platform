package com.salesplatform.sales_analytics_api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import java.time.LocalDate;

/*  SQL Product (Changed)

    Source ---> Target Mapping = gold layer
    This entity represents the view = fact.sales in the gold layer of the db

    Previous mock data has been changed to represent the complete DB
 */

@Entity
@Table(name = "fact_sales", schema = "gold")
@Immutable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sales {

    @Id
    @Column(name = "order_number", length = 50)
    private String orderNumber;

    @Column(name = "client_key")
    private Long clientKey;

    @Column(name = "product_key")
    private Long productKey;

    @Column(name = "territory_key")
    private Long territoryKey;

    @Column(name = "invoice_status_key")
    private Long invoiceStatusKey;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "ship_date")
    private LocalDate shipDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "sales_amount")
    private Double salesAmount;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private Double price;
}

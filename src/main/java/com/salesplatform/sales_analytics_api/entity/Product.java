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
    This entity represents the view = dim.products in the gold layer of the db

    Previous mock data has been changed to represent the complete DB
 */

@Entity
@Table(name = "dim_products", schema = "gold")
@Immutable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @Column(name = "product_key")
    private Long productKey;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "product_number", length = 50)
    private String productNumber;

    @Column(name = "product_name", length = 50)
    private String productName;

    @Column(name = "cost")
    private Integer cost;

    @Column(name = "product_type", length = 50)
    private String productType;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "subcategory", length = 50)
    private String subcategory;

    @Column(name = "maintenance", length = 50)
    private String maintenance;

    @Column(name = "product_level")
    private Integer productLevel;

    @Column(name = "start_date")
    private LocalDate startDate;
}

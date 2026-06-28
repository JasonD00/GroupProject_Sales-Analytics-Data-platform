package com.salesplatform.sales_analytics_api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

/*
    Invoice entity

    @Entity Male the class a JPA entity
    @Table Map entity to a db table or view
    @Id define the primary key
    @Column map field to column
 */

@Entity
@Table(name = "dim_invoice_status", schema = "gold")
@Immutable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @Column(name = "invoice_status_key")
    private Long invoiceStatusKey;

    @Column(name = "invoice_status")
    private String invoiceStatus;


}

package com.salesplatform.sales_analytics_api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "dim_clients", schema = "gold")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @Column(name = "client_id")
    private Integer clientId;

    @Column(name = "client_key")
    private Integer clientKey;

    @Column(name = "client_number")
    private String clientNumber;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "marital_status")
    private String maritalStatus;

    @Column(name = "gender")
    private String gender;

    @Column(name = "country")
    private String country;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "account_status")
    private String accountStatus;

    @Column(name = "client_segment")
    private String clientSegment;

    @Column(name = "create_date")
    private LocalDate clientCreateDate;

    @Column(name = "total_spend")
    private Double totalSpend;

    @Column(name = "orders")
    private Integer orders;

    @Column(name = "last_order")
    private LocalDate lastOrder;
}
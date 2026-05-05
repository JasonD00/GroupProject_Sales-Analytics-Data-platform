package com.salesplatform.sales_analytics_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "crm_client_info", schema = "bronze")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @Column(name = "client_id")
    private Integer clientId;

    @Column(name = "client_key")
    private String clientKey;

    @Column(name = "client_firstname")
    private String firstName;

    @Column(name = "client_lastname")
    private String lastName;

    @Column(name = "client_marital_status")
    private String maritalStatus;

    @Column(name = "client_gender")
    private String gender;

    @Column(name = "client_create_dt") // ← correct column name
    private LocalDate clientCreateDate;
}
package com.salesplatform.sales_analytics_api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/*  SQL Client Template

    Source ---> Target Mapping = bronze layer
    This entity represents a near 1:1 copy of the source table from bronze.crm_client_info
    bronze.crm_client_info is a table for clients/customers in the bronze layer

    I kept this as a basic example for further classes, this may change but the general structure will
    repeat on entities for now

    Each variable exists as a column within the Db, so this is mapped via:
    @Column annotation

    client_id INT,                          =  private Integer clientId;
    client_key NVARCHAR(50),                =  private String clientKey;
    client_firstname NVARCHAR(50),          =  private String firstName;
    client_lastname NVARCHAR(50),           =  private String lastName;
    client_marital_status NVARCHAR(50),     =  private String client_marital_status;
    client_gender NVARCHAR(50),             =  private String client_gender;
    client_create_date DATE                 = private LocalDate clientCreateDate;
 */


@Entity
//@Table not used yet will be later (jason)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_id", nullable = false, unique = true)
    private Integer clientId;

    @Column(name = "client_key", nullable = false, length = 50)
    private String clientKey;

    @Column(name = "client_firstname", length = 50)
    private String firstName;

    @Column(name = "client_lastname", length = 50)
    private String lastName;

    @Column(name = "client_marital_status", length = 50)
    private String maritalStatus;

    @Column(name = "client_gender", length = 50)
    private String gender;


    @Column(name = "client_create_date")
    private LocalDate clientCreateDate;



}

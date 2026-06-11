package com.salesplatform.sales_analytics_api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import java.time.LocalDate;

/*  SQL Client (Changed)

    Source ---> Target Mapping = gold layer
    This entity represents the view = dim.client in the gold layer of the db

    Previous mock data has been changed to represent the complete DB
 */


@Entity
@Table(name = "dim_clients", schema = "gold")
@Immutable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @Column(name = "client_key")
    private Long clientKey;

    @Column(name = "client_id")
    private Integer clientId;

    @Column(name = "client_number", length = 50)
    private String clientNumber;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column(name = "marital_status", length = 50)
    private String maritalStatus;

    @Column(name = "gender", length = 50)
    private String gender;

    @Column(name = "country", length = 50)
    private String country;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "account_status", length = 50)
    private String accountStatus;

    @Column(name = "client_segment", length = 50)
    private String clientSegment;

    @Column(name = "create_date")
    private LocalDate createDate;
}





package com.salesplatform.sales_analytics_api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

    /*
            User Entity

            Matches the dbo.users table in the DB using Flyway Migration

            @Entity Male the class a JPA entity
            @Table Map entity to a db table or view
            @Id define the primary key
            @Column map field to column
     */

@Entity
@Table(name = "users", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "tier", nullable = false, length = 20)
    private String tier;

    @Column(name = "created_at")
    private LocalDate createdAt;



}
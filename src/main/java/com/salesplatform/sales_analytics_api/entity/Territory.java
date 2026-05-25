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

@Entity
@Table(name = "dim_territory", schema = "gold")
@Immutable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Territory {

    @Id
    @Column(name = "territory_key")
    private Long territoryKey;

    @Column(name = "country")
    private String country;

    @Column(name = "client_segment", length = 50)
    private String clientSegment;
}

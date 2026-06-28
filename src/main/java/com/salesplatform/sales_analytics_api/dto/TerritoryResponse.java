package com.salesplatform.sales_analytics_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TerritoryResponse {

    private Long territoryKey;
    private String country;
    private String clientSegment;

}
package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.dto.TerritoryResponse;
import com.salesplatform.sales_analytics_api.entity.Territory;
import com.salesplatform.sales_analytics_api.exception.ResourceNotFoundException;
import com.salesplatform.sales_analytics_api.repository.TerritoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TerritoryService {

    private final TerritoryRepository territoryRepository;

    // Fetch all territories
    public List<TerritoryResponse> getAllTerritories() {
        return territoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Fetch territories by id
    public TerritoryResponse getTerritoryById(Long territoryKey) {
        Territory territory = territoryRepository.findById(territoryKey)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Territory not found with key" + territoryKey));
        return mapToResponse(territory);
    }

    // Map entity to DTO (Territory)
    private TerritoryResponse mapToResponse(Territory territory) {
           return TerritoryResponse.builder()
                .territoryKey(territory.getTerritoryKey())
                .country(territory.getCountry())
                .clientSegment(territory.getClientSegment())
                .build();
    }


}

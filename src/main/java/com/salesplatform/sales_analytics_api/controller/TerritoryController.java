package com.salesplatform.sales_analytics_api.controller;

import com.salesplatform.sales_analytics_api.dto.TerritoryResponse;
import com.salesplatform.sales_analytics_api.service.TerritoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/territory")
@RequiredArgsConstructor
public class TerritoryController {

    private final TerritoryService territoryService;

    @GetMapping
    public ResponseEntity<List<TerritoryResponse>> getAllTerritories() {
        return ResponseEntity.ok(territoryService.getAllTerritories());
    }

    @GetMapping("/{territoryKey}")
    public ResponseEntity<TerritoryResponse> getTerritoryById(@PathVariable Long territoryKey) {
        return ResponseEntity.ok(territoryService.getTerritoryById(territoryKey));
    }


}

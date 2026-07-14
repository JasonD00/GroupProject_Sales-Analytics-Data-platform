/*
Sarah Molloy
*/
package com.salesplatform.sales_analytics_api.controller;

import com.salesplatform.sales_analytics_api.dto.ClientResponse;
import com.salesplatform.sales_analytics_api.dto.CustomerSummaryResponse;
import com.salesplatform.sales_analytics_api.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/*
       Client Controller

       Entry point for HTTP requests (Client data)

       Endpoints:
       GET /api/clients               returns all clients from gold.dim_clients
       GET /api/clients/{clientKey}   returns a single client by their client_key
       GET /api/clients/summary       return summary (ClientRepo custom query)
*/

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    // GET /api/clients
    // Returns all clients as a list - ClientResponse DTOs
    @GetMapping
    public ResponseEntity<List<ClientResponse>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    // GET /api/clients/{clientKey}
    // Returns a single client matching the given client_key
    // Returns 404 via ResourceNotFoundException
    @GetMapping("/{clientKey}")
    public ResponseEntity<ClientResponse> getClientById(@PathVariable Long clientKey) {
        return ResponseEntity.ok(clientService.getClientById(clientKey));
    }

    // GET /api/clients/summary
    // Returns all clients with aggregated sales data
    @GetMapping("/summary")
    public ResponseEntity<List<CustomerSummaryResponse>> getCustomerSummary() {
        return ResponseEntity.ok(clientService.getCustomerSummary());
    }
}
package com.salesplatform.sales_analytics_api.controller;

import com.salesplatform.sales_analytics_api.entity.Client;
import com.salesplatform.sales_analytics_api.service.ClientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService service;

    public ClientController(ClientService service) {
        this.service = service;
    }

    @GetMapping
    public List<Client> getAllClients() {
        return service.getAllClients();
    }

    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return service.saveClient(client);
    }
}
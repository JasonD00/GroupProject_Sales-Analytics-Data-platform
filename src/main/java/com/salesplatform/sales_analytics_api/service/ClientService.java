package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.entity.Client;
import com.salesplatform.sales_analytics_api.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository repository;

    public ClientService(ClientRepository repository) {
        this.repository = repository;
    }

    public List<Client> getAllClients() {
        return repository.findAll();
    }

    public Client saveClient(Client client) {
        return repository.save(client);
    }
}
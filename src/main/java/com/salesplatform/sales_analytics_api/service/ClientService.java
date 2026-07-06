package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.dto.ClientResponse;
import com.salesplatform.sales_analytics_api.dto.CustomerSummaryResponse;
import com.salesplatform.sales_analytics_api.entity.Client;
import com.salesplatform.sales_analytics_api.repository.ClientRepository;
import com.salesplatform.sales_analytics_api.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/*
       Client Service

       Business logic for Client data.
       Exists as:
       ClientController(incoming requests) - ClientService - ClientRepository(db access) = grabs related dim

       Methods:
       getAllClients()         fetches every client from gold.dim_clients
       getClientById(id)       fetches a single client by their client_key
       mapToResponse(client)   converts a Client entity into a ClientResponse DTO
       getCustomerSummary()    return every customer via a summary
*/

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    // Fetch all clients from gold.dim_clients
    // Maps each Client entity to a ClientResponse before returning
    public List<ClientResponse> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Fetch a single client by their client_key
    public ClientResponse getClientById(Long clientKey) {
        Client client = clientRepository.findById(clientKey)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Client not found with key: " + clientKey));
        return mapToResponse(client);
    }

    // Fetch aggregated customer summary
    // Joins dim_clients with fact_sales for spend, order count, avg and last order
    public List<CustomerSummaryResponse> getCustomerSummary() {
        return clientRepository.findCustomerSummary()
                .stream()
                .map(row -> CustomerSummaryResponse.builder()
                        .clientId(((Number) row[0]).intValue())
                        .firstName((String) row[1])
                        .lastName((String) row[2])
                        .country((String) row[3])
                        .clientSegment((String) row[4])
                        .accountStatus((String) row[5])
                        .totalSpend(((Number) row[6]).doubleValue())
                        .orderCount(((Number) row[7]).longValue())
                        .avgOrder(((Number) row[8]).doubleValue())
                        .lastOrderDate(row[9] != null ?
                                java.time.LocalDate.parse(row[9].toString()) : null)
                        .build())
                .collect(Collectors.toList());
    }


    // Maps a Client entity --> ClientResponse DTO
    private ClientResponse mapToResponse(Client client) {
        return ClientResponse.builder()
                .clientKey(client.getClientKey())
                .clientId(client.getClientId())
                .clientNumber(client.getClientNumber())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .maritalStatus(client.getMaritalStatus())
                .gender(client.getGender())
                .country(client.getCountry())
                .birthDate(client.getBirthDate())
                .accountStatus(client.getAccountStatus())
                .clientSegment(client.getClientSegment())
                .createDate(client.getCreateDate())
                .build();
    }
}
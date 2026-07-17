package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.dto.ClientResponse;
import com.salesplatform.sales_analytics_api.entity.Client;
import com.salesplatform.sales_analytics_api.repository.ClientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private ClientService clientService;

    // Functional Test 1
    // Get all Clients

    @Test
    void getAllClients() {
        Client client1 = Client.builder().clientKey(1L).firstName("John").lastName("Doe").build();
        Client client2 = Client.builder().clientKey(2L).firstName("Jane").lastName("Doe").build();
        when(clientRepository.findAll()).thenReturn(List.of(client1, client2));

        List<ClientResponse> result = clientService.getAllClients();

        assertEquals(2, result.size());
        verify(clientRepository, times(1)).findAll();
    }
}

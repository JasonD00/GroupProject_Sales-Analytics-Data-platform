/*
Sarah Molloy
*/
package com.salesplatform.sales_analytics_api.controller;

import com.salesplatform.sales_analytics_api.entity.Client;
import com.salesplatform.sales_analytics_api.repository.ClientRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class ExportController {

    private final ClientRepository clientRepository;

    public ExportController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @GetMapping
    public ResponseEntity<byte[]> exportCustomers(
            @RequestParam String dataType,
            @RequestParam String format,
            @RequestParam String dateRange
    ) {
        List<Client> clients = clientRepository.findClientsWithSales();

        String content = createCsv(clients);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"customers-export.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(content.getBytes(StandardCharsets.UTF_8));
    }

    private String createCsv(List<Client> clients) {
        if (clients == null || clients.isEmpty()) {
            return "No customer data found";
        }

        StringBuilder csv = new StringBuilder();

        Field[] fields = clients.get(0).getClass().getDeclaredFields();

        for (Field field : fields) {
            csv.append(field.getName()).append(",");
        }

        csv.deleteCharAt(csv.length() - 1);
        csv.append("\n");

        for (Client client : clients) {
            for (Field field : fields) {
                field.setAccessible(true);

                try {
                    Object value = field.get(client);
                    csv.append(value == null ? "" : cleanCsvValue(value.toString())).append(",");
                } catch (IllegalAccessException e) {
                    csv.append(",");
                }
            }

            csv.deleteCharAt(csv.length() - 1);
            csv.append("\n");
        }

        return csv.toString();
    }

    private String cleanCsvValue(String value) {
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            value = value.replace("\"", "\"\"");
            return "\"" + value + "\"";
        }

        return value;
    }
}
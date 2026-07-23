package com.salesplatform.sales_analytics_api.controller;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.salesplatform.sales_analytics_api.entity.Client;
import com.salesplatform.sales_analytics_api.repository.ClientRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/*
    ExportController

    Exports customer data in the format requested by the frontend:
      - CSV  -> plain comma-separated text
      - PDF  -> a real PDF table generated with OpenPDF
      - JSON -> raw JSON array of the customer records

    Authentication is used by SecurityConfig - this endpoint
    requires a valid JWT token in the Authorization header.
*/

@RestController
@RequestMapping("/api/export")
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

        return switch (format.toLowerCase()) {
            case "pdf"  -> buildPdfResponse(clients);
            case "json" -> buildJsonResponse(clients);
            default     -> buildCsvResponse(clients); 
        };
    }

    // ===== CSV =====
    private ResponseEntity<byte[]> buildCsvResponse(List<Client> clients) {
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

    // ===== JSON =====
    private ResponseEntity<byte[]> buildJsonResponse(List<Client> clients) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            mapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
            byte[] json = mapper.writeValueAsBytes(clients);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"customers-export.json\"")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(json);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ===== PDF =====
    private ResponseEntity<byte[]> buildPdfResponse(List<Client> clients) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate(), 30, 30, 40, 40);
            PdfWriter.getInstance(document, out);
            document.open();

            //title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, new Color(26, 42, 108));
            Paragraph title = new Paragraph("Customer Export Report", titleFont);
            title.setSpacingAfter(4);
            document.add(title);

            Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY);
            String generatedOn = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
            Paragraph subtitle = new Paragraph("Generated on " + generatedOn + " - " + clients.size() + " records", subFont);
            subtitle.setSpacingAfter(16);
            document.add(subtitle);

            if (clients == null || clients.isEmpty()) {
                document.add(new Paragraph("No customer data found.", subFont));
                document.close();
                return buildPdfEntity(out);
            }

            // table
            Field[] fields = clients.get(0).getClass().getDeclaredFields();
            PdfPTable table = new PdfPTable(fields.length);
            table.setWidthPercentage(100);

            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
            Color headerBg = new Color(26, 42, 108);

            for (Field field : fields) {
                PdfPCell headerCell = new PdfPCell(new Phrase(field.getName(), headerFont));
                headerCell.setBackgroundColor(headerBg);
                headerCell.setPadding(6);
                table.addCell(headerCell);
            }

            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 8, Color.DARK_GRAY);
            boolean alternate = false;

            for (Client client : clients) {
                Color rowColor = alternate ? new Color(240, 242, 247) : Color.WHITE;
                for (Field field : fields) {
                    field.setAccessible(true);
                    String value;
                    try {
                        Object raw = field.get(client);
                        value = raw == null ? "" : raw.toString();
                    } catch (IllegalAccessException e) {
                        value = "";
                    }
                    PdfPCell cell = new PdfPCell(new Phrase(value, bodyFont));
                    cell.setBackgroundColor(rowColor);
                    cell.setPadding(5);
                    table.addCell(cell);
                }
                alternate = !alternate;
            }

            document.add(table);
            document.close();

            return buildPdfEntity(out);

        } catch (DocumentException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private ResponseEntity<byte[]> buildPdfEntity(ByteArrayOutputStream out) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"customers-export.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(out.toByteArray());
    }
}
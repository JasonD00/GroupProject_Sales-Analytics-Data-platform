package com.salesplatform.sales_analytics_api.service;

import com.salesplatform.sales_analytics_api.entity.Sales;
import com.salesplatform.sales_analytics_api.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleService {

    private final SaleRepository repository;

    public SaleService(SaleRepository repository) {
        this.repository = repository;
    }

    public List<Sales> getAllSales() {
        return repository.findAll();
    }

    public Sales saveSale(Sales sale) {
        return repository.save(sale);
    }
}
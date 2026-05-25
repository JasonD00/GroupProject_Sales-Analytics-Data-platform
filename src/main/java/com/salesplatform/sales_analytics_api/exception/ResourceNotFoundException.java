package com.salesplatform.sales_analytics_api.exception;

/*
       Resource Not Found Exception

       Custom runtime exception, thrown when resources cannot be found in the db.
       Used within the service layer:

       Client: when client does not match client_key
       Product: when product does not match product_key
       Sales: then the sales does not match order_number


*/

public class ResourceNotFoundException extends RuntimeException {

    // Message returned in the 404 response
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
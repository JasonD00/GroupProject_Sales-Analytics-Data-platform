/*
Sarah Molloy
*/
package com.salesplatform.sales_analytics_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/*
       Client Response DTO

       Source - Target Mapping = gold layer
       Response DTO, what is sent to the frontend when a client is requested.

       It mirrors gold.dim_clients but exists to carry data.
       Client entity is mapped to this DTO inside the service layer.



*/

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientResponse {

    private Long clientKey;
    private Integer clientId;
    private String clientNumber;
    private String firstName;
    private String lastName;
    private String maritalStatus;
    private String gender;
    private String country;
    private LocalDate birthDate;
    private String accountStatus;
    private String clientSegment;
    private LocalDate createDate;
}

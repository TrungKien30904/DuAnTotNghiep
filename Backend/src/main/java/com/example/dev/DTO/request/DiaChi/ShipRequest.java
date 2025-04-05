package com.example.dev.DTO.request.DiaChi;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ShipRequest {
    @JsonProperty("service_type_id")
    private Integer serviceTypeId;
    @JsonProperty("from_district_id")
    private Integer fromDistrictId;
    @JsonProperty("from_ward_code")
    private String fromWardCode;
    @JsonProperty("to_district_id")
    private Integer toDistrictId;
    @JsonProperty("to_ward_code")
    private String toWardCode;

    private int length;
    private int width;
    private int height;
    private int weight;
    @JsonProperty("insurance_value")
    private Integer insuranceValue;

    private String coupon;

    private List<Item> items;
}

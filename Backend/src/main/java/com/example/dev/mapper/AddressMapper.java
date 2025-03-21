package com.example.dev.mapper;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class AddressMapper {
    private int id;
    private int customerId;
    private String nameReceive;
    private String phoneNumber;
    private int provinceId;
    private int districtId;
    private String wardId;
    private String addressDetail;
    private String note;
    private boolean status;
    private String provinceName;
    private String districtName;
    private String wardName;
    private int stage;
    private boolean visiable;
    public AddressMapper() {
    }

    public String getFullInfo(){
        if(!this.addressDetail.isEmpty() && this.addressDetail.split("-").length > 1){
            return this.addressDetail;
        }
        return ((this.addressDetail == null || this.addressDetail.isEmpty()) ? "" : (this.addressDetail + " - "))
               + ((this.wardName == null || this.wardName.isEmpty()) ? "" : (this.wardName + " - "))
               + ((this.districtName == null || this.districtName.isEmpty()) ? "" : (this.districtName + " - "))
               + ((this.provinceName == null || this.provinceName.isEmpty()) ? "" : (this.provinceName));
    }
}

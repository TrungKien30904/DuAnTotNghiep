package com.example.dev.entity.custom_entity;
import lombok.*;
import org.springframework.util.StringUtils;


@Data
public class AddressModelCustom {
    private int id;
    private String fullName;
    private int provinceId;
    private String provinceName;
    private int districtId;
    private String districtName;
    private int wardId;
    private String wardName;
    private String addressDetail;
    public String getFullInfo(){
        return (this.addressDetail == null || this.addressDetail.isEmpty()) ? "" : (this.addressDetail + " - ")
                + ((this.wardName == null || this.wardName.isEmpty()) ? "" : (this.wardName + " - "))
                + ((this.districtName == null || this.districtName.isEmpty()) ? "" : (this.districtName + " - "))
                + ((this.provinceName == null || this.provinceName.isEmpty()) ? "" : (this.provinceName));
    }

    public AddressModelCustom() {
    }

    public AddressModelCustom(int id, String fullName, int provinceId, String provinceName, int districtId, String districtName, int wardId, String wardName, String addressDetail) {
        this.id = id;
        this.fullName = fullName;
        this.provinceId = provinceId;
        this.provinceName = provinceName;
        this.districtId = districtId;
        this.districtName = districtName;
        this.wardId = wardId;
        this.wardName = wardName;
        this.addressDetail = addressDetail;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public int getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(int provinceId) {
        this.provinceId = provinceId;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public int getDistrictId() {
        return districtId;
    }

    public void setDistrictId(int districtId) {
        this.districtId = districtId;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public int getWardId() {
        return wardId;
    }

    public void setWardId(int wardId) {
        this.wardId = wardId;
    }

    public String getWardName() {
        return wardName;
    }

    public void setWardName(String wardName) {
        this.wardName = wardName;
    }

    public String getAddressDetail() {
        return addressDetail;
    }

    public void setAddressDetail(String addressDetail) {
        this.addressDetail = addressDetail;
    }
}

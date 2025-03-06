package com.example.dev.mapper;

public class AddressMapper {
    private int id;
    private int customerId;
    private String nameReceive;
    private String phoneNumber;
    private String provinceId;
    private String districtId;
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

    public boolean isVisiable() {
        return visiable;
    }

    public void setVisiable(boolean visiable) {
        this.visiable = visiable;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public String getNameReceive() {
        return nameReceive;
    }

    public void setNameReceive(String nameReceive) {
        this.nameReceive = nameReceive;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(String provinceId) {
        this.provinceId = provinceId;
    }

    public String getDistrictId() {
        return districtId;
    }

    public void setDistrictId(String districtId) {
        this.districtId = districtId;
    }

    public String getWardId() {
        return wardId;
    }

    public void setWardId(String wardId) {
        this.wardId = wardId;
    }

    public String getAddressDetail() {
        return addressDetail;
    }

    public void setAddressDetail(String addressDetail) {
        this.addressDetail = addressDetail;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public String getWardName() {
        return wardName;
    }

    public void setWardName(String wardName) {
        this.wardName = wardName;
    }

    public int getStage() {
        return stage;
    }

    public void setStage(int stage) {
        this.stage = stage;
    }

    public AddressMapper(String districtId, int id, int customerId, String nameReceive, String phoneNumber, String provinceId, String wardId, String addressDetail, String note, boolean status, String provinceName, String districtName, String wardName, int stage) {

        this.districtId = districtId;
        this.id = id;
        this.customerId = customerId;
        this.nameReceive = nameReceive;
        this.phoneNumber = phoneNumber;
        this.provinceId = provinceId;
        this.wardId = wardId;
        this.addressDetail = addressDetail;
        this.note = note;
        this.status = status;
        this.provinceName = provinceName;
        this.districtName = districtName;
        this.wardName = wardName;
        this.stage = stage;
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

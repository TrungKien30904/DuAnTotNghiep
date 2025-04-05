package com.example.dev.mapper;

import lombok.*;


@Data
public class WardMapper {

    private int id;
    private int districtId;
    private String code;
    private String name;

    public WardMapper() {
    }

    public WardMapper(int id, int districtId, String code, String name) {
        this.id = id;
        this.districtId = districtId;
        this.code = code;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getDistrictId() {
        return districtId;
    }

    public void setDistrictId(int districtId) {
        this.districtId = districtId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

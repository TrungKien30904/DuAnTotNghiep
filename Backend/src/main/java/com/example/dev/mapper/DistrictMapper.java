package com.example.dev.mapper;

import lombok.*;


@Data
public class DistrictMapper {

    private int id;
    private int provinceId;
    private String code;
    private String name;

    public DistrictMapper() {
    }

    public DistrictMapper(int id, int provinceId, String code, String name) {
        this.id = id;
        this.provinceId = provinceId;
        this.code = code;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(int provinceId) {
        this.provinceId = provinceId;
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

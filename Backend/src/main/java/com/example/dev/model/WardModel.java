package com.example.dev.model;

import com.example.dev.mapper.WardMapper;
import lombok.*;


@Data
public class WardModel {
    private String name;
    private Integer code;
    private String division_type;
    private String codename;
    private String district_code;
    public WardMapper toWardMapper(){
        WardMapper mapper = new WardMapper();
        mapper.setId(code);
        mapper.setName(name);
        mapper.setDistrictId(Integer.parseInt(district_code));
        mapper.setCode(codename);
        return mapper;
    }

    public WardModel() {
    }

    public WardModel(String name, Integer code, String division_type, String codename, String district_code) {
        this.name = name;
        this.code = code;
        this.division_type = division_type;
        this.codename = codename;
        this.district_code = district_code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getDivision_type() {
        return division_type;
    }

    public void setDivision_type(String division_type) {
        this.division_type = division_type;
    }

    public String getCodename() {
        return codename;
    }

    public void setCodename(String codename) {
        this.codename = codename;
    }

    public String getDistrict_code() {
        return district_code;
    }

    public void setDistrict_code(String district_code) {
        this.district_code = district_code;
    }
}

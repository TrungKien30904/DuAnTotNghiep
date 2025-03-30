package com.example.dev.model;

import com.example.dev.mapper.DistrictMapper;
import lombok.*;

import java.util.List;


@Data
public class DistrictModel {
    private String name;
    private Integer code;
    private String division_type;
    private String codename;
    private String province_code;
    private List<WardModel> wards;
    public DistrictMapper toDistrictMapper(){
        DistrictMapper mapper = new DistrictMapper();
        mapper.setCode(codename);
        mapper.setId(code);
        mapper.setName(name);
        mapper.setProvinceId(Integer.parseInt(province_code));
        return mapper;
    }

    public DistrictModel() {
    }

    public DistrictModel(String name, Integer code, String division_type, String codename, String province_code, List<WardModel> wards) {
        this.name = name;
        this.code = code;
        this.division_type = division_type;
        this.codename = codename;
        this.province_code = province_code;
        this.wards = wards;
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

    public String getProvince_code() {
        return province_code;
    }

    public void setProvince_code(String province_code) {
        this.province_code = province_code;
    }

    public List<WardModel> getWards() {
        return wards;
    }

    public void setWards(List<WardModel> wards) {
        this.wards = wards;
    }
}

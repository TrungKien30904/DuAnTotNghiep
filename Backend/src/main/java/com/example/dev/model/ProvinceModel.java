package com.example.dev.model;

import com.example.dev.mapper.ProvinceMapper;
import lombok.*;

import java.util.List;


@Data
public class ProvinceModel {
    private String name;
    private Integer code;
    private String division_type;
    private String codename;
    private String phone_code;
    private List<DistrictModel> districts;

    public ProvinceMapper toProvinceMapper(){
        ProvinceMapper mapper = new ProvinceMapper();
        mapper.setId(code);
        mapper.setName(name);
        mapper.setCode(codename);
        return mapper;
    }

    public ProvinceModel() {
    }

    public ProvinceModel(String name, Integer code, String division_type, String codename, String phone_code, List<DistrictModel> districts) {
        this.name = name;
        this.code = code;
        this.division_type = division_type;
        this.codename = codename;
        this.phone_code = phone_code;
        this.districts = districts;
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

    public String getPhone_code() {
        return phone_code;
    }

    public void setPhone_code(String phone_code) {
        this.phone_code = phone_code;
    }

    public List<DistrictModel> getDistricts() {
        return districts;
    }

    public void setDistricts(List<DistrictModel> districts) {
        this.districts = districts;
    }
}

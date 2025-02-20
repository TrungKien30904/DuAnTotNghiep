package com.example.dev.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Ward")
public class Ward {
    @Id
    @Column(name = "Id")
    private int id;
//    @Column(name = "district_id")
    private int districtId;
    @Column(name = "Code")
    private String code;
    @Column(name ="Name")
    private String name;

    public Ward() {

    }

    public Ward(int id, int districtId, String code, String name) {
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

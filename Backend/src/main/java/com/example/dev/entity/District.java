package com.example.dev.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "District")
public class District {
    @Id
    @Column(name = "Id")
    private int id;
//    @Column(name = "province_id")
    private int provinceId;
    @Column(name = "Code")
    private String code;
    @Column(name ="Name")
    private String name;

    public District() {
    }

    public District(int id, int provinceId, String code, String name) {
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

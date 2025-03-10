package com.example.dev.entity.customer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Province")
public class Province {
    @Id
    @Column(name = "Id")
    private int Id;
    @Column(name = "Code")
    private String code;
    @Column(name = "Name")
    private String name;

    public Province() {
    }

    public Province(int id, String code, String name) {
        Id = id;
        this.code = code;
        this.name = name;
    }

    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
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

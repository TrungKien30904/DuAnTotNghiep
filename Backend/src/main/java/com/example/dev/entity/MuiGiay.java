package com.example.dev.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "mui_giay")
public class MuiGiay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idMuiGiay;
    @NotEmpty
    private String ten;
    private Boolean trangThai = true;

    public Integer getIdMuiGiay() {
        return idMuiGiay;
    }

    public void setIdMuiGiay(Integer idMuiGiay) {
        this.idMuiGiay = idMuiGiay;
    }

    public String getTen() {
        return ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public Boolean getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(Boolean trangThai) {
        this.trangThai = trangThai;
    }
}

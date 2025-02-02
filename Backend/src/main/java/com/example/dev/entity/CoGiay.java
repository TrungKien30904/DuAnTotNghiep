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
@Table(name = "co_giay")
public class CoGiay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCoGiay;
    @NotEmpty
    private String ten;
    private Boolean trangThai = true;

    public Integer getIdCoGiay() {
        return idCoGiay;
    }

    public void setIdCoGiay(Integer idCoGiay) {
        this.idCoGiay = idCoGiay;
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

package com.example.dev.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "nhan_vien")
public class NhanVien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idNhanVien;

    private String ten;
    private String gioiTinh;
    private LocalDateTime ngaySinh;
    private String soDienThoai;
    @Email
    private String email;
    private String vaiTro;
    private String matKhau;
    private Boolean trangThai;
}
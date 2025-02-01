package com.example.dev.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "khach_hang")
public class KhachHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idKhachHang;

    private String hoTen;
    private String gioiTinh;
    private String soDienThoai;
    @Email
    private String email;
    private String matKhau;
    private Boolean trangThai;
}

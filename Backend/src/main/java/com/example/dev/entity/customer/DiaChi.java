package com.example.dev.entity.customer;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "dia_chi")
public class DiaChi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dia_chi")
    private Integer id;

    @Column(name = "id_khach_hang", nullable = false)
    private Integer idKhachHang;

    @Column(name = "ten_nguoi_nhan", nullable = false, length = 255)
    private String tenNguoiNhan;

    @Column(name = "so_dien_thoai", nullable = false, length = 20)
    private String soDienThoai;

    private Integer thanhPho;

    private Integer quanHuyen;

    @Column(name = "xa_phuong", nullable = false, length = 255)
    private String xaPhuong;

    @Column(name = "dia_chi_chi_tiet", nullable = false, length = 255)
    private String diaChiChiTiet;

    @Column(name = "ghi_chu", columnDefinition = "NVARCHAR(MAX)")
    private String ghiChu;

    @Column(name = "mac_dinh", nullable = false)
    private boolean macDinh;
    @Column(name = "stage", nullable = true)
    private int stage;
}

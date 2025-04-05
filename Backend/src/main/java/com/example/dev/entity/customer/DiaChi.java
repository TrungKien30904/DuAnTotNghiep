package com.example.dev.entity.customer;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dia_chi")
@Builder
public class DiaChi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dia_chi")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;

    @Column(name = "ten_nguoi_nhan", nullable = false, length = 255)
    private String tenNguoiNhan;

    @Column(name = "so_dien_thoai", nullable = false, length = 20)
    private String soDienThoai;

    @Column(name = "thanh_pho", nullable = false, length = 255)
    private Integer thanhPho;

    @Column(name = "quan_huyen", nullable = false, length = 255)
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

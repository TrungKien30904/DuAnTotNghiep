package com.example.dev.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "danh_gia")
public class DanhGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDanhGia;

    @ManyToOne
    @JoinColumn(name = "id_chi_tiet_san_pham")
    private ChiTietSanPham chiTietSanPham;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;

    private String thongTinDanhGia;

    private Float sao;
}

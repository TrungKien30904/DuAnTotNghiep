package com.example.dev.entity;
import com.example.dev.entity.customer.KhachHang;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
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
@Table(name = "khach_hang_phieu_giam_gia")
public class PhieuGiamGiaChiTiet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "id_khuyen_mai")
    @JsonBackReference
    private PhieuGiamGia phieuGiamGia;


    @ManyToOne(cascade = CascadeType.PERSIST)  // Cascade persist operation to KhachHang
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;
    @Column(name = "trang_thai")
    private Integer trangThai=2;
    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
    @Column(name = "ngay_sua")
    private LocalDateTime ngaySua;
    @Column(name = "nguoi_tao")
    private String nguoiTao;
    @Column(name = "nguoi_sua")
    private String nguoiSua;
}

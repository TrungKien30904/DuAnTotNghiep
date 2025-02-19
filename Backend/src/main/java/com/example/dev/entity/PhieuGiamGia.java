package com.example.dev.entity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "phieu_giam_gia")
public class PhieuGiamGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_khuyen_mai")
    private Integer id;

    @Column(name = "ma_khuyen_mai", unique = true)
    private String maKhuyenMai;

    @Column(name = "loai")
    private String loai;

    @Column(name = "dieu_kien")
    private BigDecimal dieuKien;

    @Column(name = "ten_khuyen_mai")
    private String tenKhuyenMai;
    @Column(name = "gia_tri")
    private BigDecimal giaTri;
    @Column(name = "gia_tri_toi_da")
    private BigDecimal giaTriToiDa;

    @OneToMany(mappedBy = "phieuGiamGia", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PhieuGiamGiaChiTiet> danhSachKhachHang = new ArrayList<>();
    @Column(name = "so_luong")
    private Integer soLuong;
    @Column(name = "hinh_thuc")
    private String hinhThuc;

    @Column(name = "ngay_bat_dau")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime ngayBatDau;
    @Column(name = "ngay_ket_thuc")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime ngayKetThuc;

    @Column(name = "trang_thai")
    private Integer trangThai = 2;

    @Column(name = "ngay_tao",nullable = false, updatable = false)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_sua")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime ngaySua;

    @Column(name = "nguoi_tao")
    private String nguoiTao;
    @Column(name = "nguoi_sua")
    private String nguoiSua;

    @PrePersist
    protected void onCreate() {
        this.ngayTao = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.ngaySua = LocalDateTime.now();
    }

}

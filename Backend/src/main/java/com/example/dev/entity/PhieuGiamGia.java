package com.example.dev.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "phieu_giam_gia")
public class PhieuGiamGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String tenKhuyenMai;
    private BigDecimal giaTri;
    private BigDecimal giaTriToiDa;
    private Integer soLuong;
    private String hinhThuc;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private Boolean trangThai;
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
    private String nguoiTao;
    private String nguoiSua;
}

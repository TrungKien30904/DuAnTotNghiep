package com.example.dev.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
@Table(name = "thanh_toan_hoa_don")
public class ThanhToanHoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotEmpty
    private String hinhThucThanhToan;

    @ManyToOne
    @JoinColumn(name = "id_hoa_don")
    private HoaDon hoaDon;

    @NotNull
    @Min(value = 1)
    private BigDecimal soTienThanhToan;

    private String ghiChu;

    private Boolean trangThai;
    @NotNull
    private LocalDateTime ngayTao;

    private LocalDateTime ngaySua;
    @NotNull
    private String nguoiTao;

    private String nguoiSua;
}

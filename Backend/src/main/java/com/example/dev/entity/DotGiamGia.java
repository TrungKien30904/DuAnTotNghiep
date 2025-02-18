package com.example.dev.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
@Table(name = "dot_giam_gia")
public class DotGiamGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDotGiamGia;
    @NotEmpty
    private String tenKhuyenMai;
    @NotNull
    private BigDecimal giaTri;
    @NotEmpty
    private String hinhThuc;

    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private Boolean trangThai;
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
    private String nguoiTao;
    private String nguoiSua;
}

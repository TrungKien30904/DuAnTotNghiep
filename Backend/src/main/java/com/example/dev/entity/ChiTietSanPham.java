package com.example.dev.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
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
@Table(name = "chi_tiet_san_pham")
public class ChiTietSanPham {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idChiTietSanPham;

    @ManyToOne
    @JoinColumn(name = "id_mui_giay")
    private MuiGiay muiGiay;

    @ManyToOne
    @JoinColumn(name = "id_san_pham")
    private SanPham sanPham;

    @ManyToOne
    @JoinColumn(name = "id_mau_sac")
    private MauSac mauSac;

    @ManyToOne
    @JoinColumn(name = "id_nha_cung_cap")
    private NhaCungCap nhaCungCap;

    @ManyToOne
    @JoinColumn(name = "id_kich_co")
    private KichCo kichCo;

    @ManyToOne
    @JoinColumn(name = "id_chat_lieu")
    private ChatLieu chatLieu;

    @ManyToOne
    @JoinColumn(name = "id_de_giay")
    private DeGiay deGiay;

    @ManyToOne
    @JoinColumn(name = "id_thuong_hieu")
    private ThuongHieu thuongHieu;

    @ManyToOne
    @JoinColumn(name = "id_danh_muc")
    private DanhMucSanPham danhMucSanPham;

    @ManyToOne
    @JoinColumn(name = "id_co_giay")
    private CoGiay coGiay;

    @NotNull
    @Size(min = 0)
    private Integer soLuong;

    @NotNull
    @DecimalMin(value = "1")
    private BigDecimal gia;

    private String moTa;
    private Boolean trangThai = true;

    @Column(updatable = false)
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;

    @Column(updatable = false)
    private String nguoiTao;
    private String nguoiSua;
}

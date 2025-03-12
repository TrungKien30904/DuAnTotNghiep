package com.example.dev.entity;
import com.example.dev.entity.attribute.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@ToString
//@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name = "chi_tiet_san_pham")
public class ChiTietSanPham {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idChiTietSanPham;

    @TrackChange
    private String ma;
    @ManyToOne
    @JoinColumn(name = "id_mui_giay")
    @NotNull
//    @EqualsAndHashCode.Include
    @TrackChange(columnName = "mui_giay")
    private MuiGiay muiGiay;

    @ManyToOne
    @JoinColumn(name = "id_san_pham")
    @TrackChange(columnName = "san_pham")
    @NotNull
//    @EqualsAndHashCode.Include
    private SanPham sanPham;

    @ManyToOne
    @JoinColumn(name = "id_mau_sac")
    @NotNull
//    @EqualsAndHashCode.Include
    @TrackChange(columnName = "mau_sac")
    private MauSac mauSac;

    @ManyToOne
    @JoinColumn(name = "id_nha_cung_cap")
    @NotNull
//    @EqualsAndHashCode.Include
    @TrackChange(columnName = "nha_cung_cap")
    private NhaCungCap nhaCungCap;

    @ManyToOne
    @JoinColumn(name = "id_kich_co")
    @NotNull
//    @EqualsAndHashCode.Include
    @TrackChange(columnName = "kich_co")
    private KichCo kichCo;

    @ManyToOne
    @JoinColumn(name = "id_chat_lieu")
    @NotNull
//    @EqualsAndHashCode.Include
    @TrackChange(columnName = "chat_lieu")
    private ChatLieu chatLieu;

    @ManyToOne
    @JoinColumn(name = "id_de_giay")
    @NotNull
//    @EqualsAndHashCode.Include
    @TrackChange(columnName = "de_giay")
    private DeGiay deGiay;

    @ManyToOne
    @JoinColumn(name = "id_thuong_hieu")
    @NotNull
//    @EqualsAndHashCode.Include
    @TrackChange(columnName = "thuong_hieu")
    private ThuongHieu thuongHieu;

    @ManyToOne
    @JoinColumn(name = "id_danh_muc")
    @NotNull
//    @EqualsAndHashCode.Include
    @TrackChange(columnName = "danh_muc")
    private DanhMucSanPham danhMucSanPham;

    @ManyToOne
    @JoinColumn(name = "id_co_giay")
    @NotNull
//    @EqualsAndHashCode.Include
    @TrackChange(columnName = "co_giay")
    private CoGiay coGiay;

    @NotNull
    @Min(value = 0)
    @TrackChange(columnName = "so_luong")
    private Integer soLuong;

    @NotNull
    @DecimalMin(value = "1")
//    @EqualsAndHashCode.Include
    @TrackChange(columnName = "gia")
    private BigDecimal gia;
    private BigDecimal giaDuocTinh;
    private Integer taoBoi;
    private String moTa;
    private Boolean trangThai = true;

    @Column(updatable = false)
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;

    @Column(updatable = false)
    private String nguoiTao;
    private String nguoiSua;


}

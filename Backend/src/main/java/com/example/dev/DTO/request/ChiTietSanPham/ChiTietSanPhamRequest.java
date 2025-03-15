package com.example.dev.DTO.request.ChiTietSanPham;

import com.example.dev.entity.attribute.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietSanPhamRequest {
    private Integer idChiTietSanPham;
    private String ma;
    private MuiGiay muiGiay;
    private SanPham sanPham;
    private MauSac mauSac;
    private NhaCungCap nhaCungCap;
    private KichCo kichCo;
    private ChatLieu chatLieu;
    private DeGiay deGiay;
    private ThuongHieu thuongHieu;
    private DanhMucSanPham danhMucSanPham;
    private CoGiay coGiay;
    private Integer soLuong;
    private BigDecimal gia;
    private BigDecimal giaDuocTinh;
    private String moTa;
    private Boolean trangThai;
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
    private String nguoiTao;
    private String nguoiSua;
    private List<String> listAnh;
}

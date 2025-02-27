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
    private Integer idMuiGiay;
    private MuiGiay muiGiay;
    private Integer idSanPham;
    private SanPham sanPham;
    private Integer idMauSac;
    private MauSac mauSac;
    private Integer idNhaCungCap;
    private NhaCungCap nhaCungCap;
    private Integer idKichCo;
    private KichCo kichCo;
    private Integer idChatLieu;
    private ChatLieu chatLieu;
    private Integer idDeGiay;
    private DeGiay deGiay;
    private Integer idThuongHieu;
    private ThuongHieu thuongHieu;
    private Integer idDanhMucSanPham;
    private DanhMucSanPham danhMucSanPham;
    private Integer idCoGiay;
    private CoGiay coGiay;
    private Integer soLuong;
    private BigDecimal gia;
    private String moTa;
    private Boolean trangThai;
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
    private String nguoiTao;
    private String nguoiSua;
    private List<String> listAnh;
}

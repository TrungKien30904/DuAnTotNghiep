package com.example.dev.DTO.response.HoaDon;

import com.example.dev.DTO.response.HoaDonChiTiet.SanPhamCartResponse;
import com.example.dev.entity.PhieuGiamGia;
import com.example.dev.entity.customer.KhachHang;
import com.example.dev.entity.invoice.ThanhToanHoaDon;
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
public class HoaDonResponse {
    private Integer idHoaDon;
    private String maHoaDon;
    private Integer khachHang;
    private BigDecimal tongTien;
    private String tenNguoiNhan;
    private String soDienThoai;
    private String email;
    private LocalDateTime ngayGiaoHang;
    private BigDecimal phiVanChuyen;
    private String trangThai;
    private LocalDateTime ngaySua;
    private String nguoiSua;
    private String loaiDon;
    private String phuongThucNhanHang;
    private Integer tinhThanhPho;
    private Integer quanHuyen;
    private String xaPhuong;
    private String ghiChu;
    private Integer idPhieuGiamGia;
    private BigDecimal giaDuocGiam;
    private List<ThanhToanHoaDonResponse> thanhToanHoaDon;
    private List<SanPhamCartResponse> danhSachSanPham;

    private String diaChiChiTiet;
    private BigDecimal phuPhi;
    private BigDecimal hoanPhi;
}

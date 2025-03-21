package com.example.dev.DTO.request.HoaDonChiTiet;

import java.math.BigDecimal;

public interface HoaDonChiTietRequest {
    public String getLienKet();
    public Integer getIdHoaDonChiTiet();
    public Integer getIdChiTietSanPham();
    public String getTenSanPham();
    public String getTenMau();
    public String getTenKichCo();
    public int getSoLuongMua();
    public int getKho();
    public BigDecimal getDonGia();
    public BigDecimal getGiaDuocTinh();
    public Integer getTaoBoi();
    public BigDecimal getThanhTien();
    public boolean getTrangThai();
}

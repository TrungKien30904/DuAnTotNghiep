package com.example.dev.DTO.request.HoaDonChiTiet;

import java.math.BigDecimal;

public interface HoaDonChiTietRequest {
    public String getLienKet();
    public Integer getIdHoaDonChiTiet();
    public Integer getIdChiTietSanPham();
    public String getTenSanPham();
    public int getSoLuongMua();
    public int getKho();
    public BigDecimal getDonGia();
    public BigDecimal getThanhTien();
    public boolean getTrangThai();
}

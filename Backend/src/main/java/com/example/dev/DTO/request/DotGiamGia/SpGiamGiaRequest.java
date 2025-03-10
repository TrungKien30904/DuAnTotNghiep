package com.example.dev.DTO.request.DotGiamGia;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface SpGiamGiaRequest {
    public String getLienKet();
    public Integer getIdHoaDon();
    public Integer getIdChiTietSanPham();
    public String getMa();
    public String getMuiGiay();
    public String getSanPham();
    public String getMauSac();
    public String getNhaCungCap();
    public String getKichCo();
    public String getChatLieu();
    public String getDeGiay();
    public String getThuongHieu();
    public String getDanhMucSanPham();
    public String getCoGiay();
    public Integer getSoLuong();
    public BigDecimal getGia();
    public String getMoTa();
    public Boolean getTrangThai();
    public LocalDateTime getNgayTao();
    public LocalDateTime getNgaySua();
    public String getNguoiTao();
    public String getNguoiSua();
    public BigDecimal getGiaSauGiam();
}

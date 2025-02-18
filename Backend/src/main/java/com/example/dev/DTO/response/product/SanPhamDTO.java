package com.example.dev.DTO.response.product;

import java.time.LocalDateTime;

public interface SanPhamDTO {
    public Integer getIdSanPham();
    public String getMaSanPham();
    public String getTen();
    public Long getSoLuong();
    public Boolean getTrangThai();
    public LocalDateTime getNgayTao();
    public LocalDateTime getNgaySua();
    public String getNguoiTao();
    public String getNguoiSua();
}

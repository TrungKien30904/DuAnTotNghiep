package com.example.dev.DTO.response.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface SanPhamOnlResponse {
    public String getLienKet();
    public Integer getIdSanPham();
    public String getMaSanPham();
    public String getTenSanPham();
    public LocalDateTime getNgayTao();
    public LocalDateTime getNgaySua();
    public BigDecimal getMin();
    public BigDecimal getMax();
}

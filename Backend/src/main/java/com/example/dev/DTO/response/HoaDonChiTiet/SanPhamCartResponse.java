package com.example.dev.DTO.response.HoaDonChiTiet;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SanPhamCartResponse {
    private Integer idHoaDon;
    private Integer idChiTietSanPham;
    private int soLuongMua;
    private BigDecimal giaSauGiam;
    private Integer idHoaDonChiTiet;
    private BigDecimal giaDuocTinh;
}

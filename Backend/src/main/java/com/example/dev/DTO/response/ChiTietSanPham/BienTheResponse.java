package com.example.dev.DTO.response.ChiTietSanPham;

import com.example.dev.entity.attribute.KichCo;
import com.example.dev.entity.attribute.MauSac;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BienTheResponse {
    private MauSac mauSac;
    private KichCo kichCo;
    private Integer soLuong;
    private BigDecimal gia;
}

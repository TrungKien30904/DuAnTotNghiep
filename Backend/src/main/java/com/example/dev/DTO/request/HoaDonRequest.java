package com.example.dev.DTO.request;

import com.example.dev.entity.customer.DiaChi;
import com.example.dev.entity.invoice.HoaDon;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonRequest {
    HoaDon hoaDon;
    List<DiaChi> diaChiKhachHang;
    String diaChiHoaDon;
}

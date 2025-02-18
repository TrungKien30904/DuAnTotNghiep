package com.example.dev.DTO.response.ChiTietSanPham;


import com.example.dev.entity.attribute.SanPham;
import com.example.dev.entity.attribute.ThuongHieu;
import com.example.dev.entity.attribute.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietSanPhamResponse {
    private SanPham sanPham;
    private CoGiay coGiay;
    private DeGiay deGiay;
    private MuiGiay muiGiay;
    private ChatLieu chatLieu;
    private ThuongHieu thuongHieu;
    private NhaCungCap nhaCungCap;
    private DanhMucSanPham danhMuc;
    private String moTa;
    private List<BienTheResponse> bienThe;
}

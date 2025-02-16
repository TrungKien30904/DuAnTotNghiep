package com.example.dev.dto;

import com.example.dev.entity.DotGiamGia;
import com.example.dev.entity.DotGiamGiaChiTiet;

import java.util.List;

public class DotGiamGiaRequestDTO {
    private DotGiamGia dotGiamGia;
    private List<Integer> idSanPhamChiTietList;

    public DotGiamGiaRequestDTO() {
    }

    public DotGiamGiaRequestDTO(DotGiamGia dotGiamGia, List<Integer> idSanPhamChiTietList) {
        this.dotGiamGia = dotGiamGia;
        this.idSanPhamChiTietList = idSanPhamChiTietList;
    }

    public DotGiamGia getDotGiamGia() {
        return dotGiamGia;
    }

    public void setDotGiamGia(DotGiamGia dotGiamGia) {
        this.dotGiamGia = dotGiamGia;
    }

    public List<Integer> getIdSanPhamChiTietList() {
        return idSanPhamChiTietList;
    }

    public void setIdSanPhamChiTietList(List<Integer> idSanPhamChiTietList) {
        this.idSanPhamChiTietList = idSanPhamChiTietList;
    }

}

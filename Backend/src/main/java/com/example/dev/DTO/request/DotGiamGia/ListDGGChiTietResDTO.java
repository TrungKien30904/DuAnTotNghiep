package com.example.dev.DTO.request.DotGiamGia;

import com.example.dev.entity.DotGiamGiaChiTiet;

import java.util.List;

public class ListDGGChiTietResDTO {
    private List<DotGiamGiaChiTiet> data;
    private long total;

    public ListDGGChiTietResDTO(List<DotGiamGiaChiTiet> data, long total) {
        this.data = data;
        this.total = total;
    }

    public List<DotGiamGiaChiTiet> getData() {
        return data;
    }

    public void setData(List<DotGiamGiaChiTiet> data) {
        this.data = data;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }
}

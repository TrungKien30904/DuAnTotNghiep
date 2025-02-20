package com.example.dev.DTO.dotgiamgia;
import com.example.dev.entity.ChiTietSanPham;
import java.util.List;

public class GetSanPhamChiTietDTO {
    private List<ChiTietSanPham> data;
    private long total;

    public GetSanPhamChiTietDTO(List<ChiTietSanPham> data, long total) {
        this.data = data;
        this.total = total;
    }

    public List<ChiTietSanPham> getData() {
        return data;
    }

    public void setData(List<ChiTietSanPham> data) {
        this.data = data;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }
}

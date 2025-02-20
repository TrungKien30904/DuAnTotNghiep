package com.example.dev.DTO.dotgiamgia;
import com.example.dev.entity.attribute.SanPham;
import java.util.List;

public class GetSanPhamDTO {
    private List<SanPham> data;
    private long total;

    public GetSanPhamDTO(List<SanPham> data, long total) {
        this.data = data;
        this.total = total;
    }

    public List<SanPham> getData() {
        return data;
    }

    public void setData(List<SanPham> data) {
        this.data = data;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }
}

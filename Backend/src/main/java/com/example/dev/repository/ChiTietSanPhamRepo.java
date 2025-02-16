package com.example.dev.repository;

import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.entity.DotGiamGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChiTietSanPhamRepo extends JpaRepository<ChiTietSanPham, Integer> {

//    Tìm các sản phẩm có id trong mảng và phân trang
    Page<ChiTietSanPham> findBySanPhamIdSanPhamIn(List<Integer> idSanPham, Pageable pageable);

    DotGiamGia save(DotGiamGia dotGiamGia);
}

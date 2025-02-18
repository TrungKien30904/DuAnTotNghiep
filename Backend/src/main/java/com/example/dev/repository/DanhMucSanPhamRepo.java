package com.example.dev.repository;

import com.example.dev.entity.attribute.DanhMucSanPham;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DanhMucSanPhamRepo extends JpaRepository<DanhMucSanPham,Integer> {
    List<DanhMucSanPham> findAllByTrangThaiIsTrue();

}

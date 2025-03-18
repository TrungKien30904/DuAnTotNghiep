package com.example.dev.repository.atriibute;

import com.example.dev.entity.attribute.MauSac;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MauSacRepo extends JpaRepository<MauSac,Integer> {
    List<MauSac> findAllByTrangThaiIsTrue(); // Lấy tất cả màu sắc đang hoạt động
    boolean existsByTen(String ten); // Kiểm tra xem tên màu sắc có tồn tại không
    List<MauSac> findByTen(String ten); // Tìm màu sắc theo tên
    List<MauSac> findByTrangThai(Boolean trangThai); // Tìm màu sắc theo trạng thái
    List<MauSac> findByTenAndTrangThai(String ten, Boolean trangThai); // Tìm màu sắc theo tên và trạng thái
    MauSac findMauSacByTenEqualsIgnoreCase(String ten);
}

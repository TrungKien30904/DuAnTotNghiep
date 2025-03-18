package com.example.dev.repository.atriibute;

import com.example.dev.entity.attribute.ThuongHieu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ThuongHieuRepo extends JpaRepository<ThuongHieu,Integer> {
    List<ThuongHieu> findAllByTrangThaiIsTrue(); // Lấy tất cả thương hiệu đang hoạt động
    boolean existsByTen(String ten); // Kiểm tra xem tên thương hiệu có tồn tại không
    List<ThuongHieu> findByTen(String ten); // Tìm thương hiệu theo tên
    List<ThuongHieu> findByTrangThai(Boolean trangThai); // Tìm thương hiệu theo trạng thái
    List<ThuongHieu> findByTenAndTrangThai(String ten, Boolean trangThai); // Tìm thương hiệu theo tên và trạng thái
}

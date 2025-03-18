package com.example.dev.repository.atriibute;

import com.example.dev.entity.attribute.NhaCungCap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NhaCungCapRepo extends JpaRepository<NhaCungCap, Integer> {
    List<NhaCungCap> findAllByTrangThaiIsTrue(); // Lấy tất cả nhà cung cấp đang hoạt động
    boolean existsByTen(String ten); // Kiểm tra xem tên nhà cung cấp có tồn tại không
    List<NhaCungCap> findByTen(String ten); // Tìm nhà cung cấp theo tên
    List<NhaCungCap> findByTrangThai(Boolean trangThai); // Tìm nhà cung cấp theo trạng thái
    List<NhaCungCap> findByTenAndTrangThai(String ten, Boolean trangThai); // Tìm nhà cung cấp theo tên và trạng thái
}

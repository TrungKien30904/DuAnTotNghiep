package com.example.dev.repository.atriibute;

import com.example.dev.entity.attribute.DanhMucSanPham;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DanhMucSanPhamRepo extends JpaRepository<DanhMucSanPham,Integer> {
    List<DanhMucSanPham> findAllByTrangThaiIsTrue(); // Lấy tất cả danh mục đang hoạt động
    boolean existsByTen(String ten); // Kiểm tra xem tên danh mục có tồn tại không
    List<DanhMucSanPham> findByTen(String ten); // Tìm danh mục theo tên
    List<DanhMucSanPham> findByTrangThai(Boolean trangThai); // Tìm danh mục theo trạng thái
    List<DanhMucSanPham> findByTenAndTrangThai(String ten, Boolean trangThai); // Tìm danh mục theo tên và trạng thái
}

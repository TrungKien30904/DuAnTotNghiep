package com.example.dev.repository.atriibute;

import com.example.dev.entity.attribute.KichCo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KichCoRepo extends JpaRepository<KichCo,Integer> {
    List<KichCo> findAllByTrangThaiIsTrue(); // Lấy tất cả kích cỡ đang hoạt động
    boolean existsByTen(String ten); // Kiểm tra xem tên kích cỡ có tồn tại không
    List<KichCo> findByTen(String ten); // Tìm kích cỡ theo tên
    List<KichCo> findByTrangThai(Boolean trangThai); // Tìm kích cỡ theo trạng thái
    List<KichCo> findByTenAndTrangThai(String ten, Boolean trangThai); // Tìm kích cỡ theo tên và trạng thái
    KichCo findKichCoByTenEqualsIgnoreCase(String ten); // Tìm kích cỡ theo tên không phân biệt chữ hoa chữ thường
}

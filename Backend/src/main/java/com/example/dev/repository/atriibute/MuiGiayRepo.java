package com.example.dev.repository.atriibute;

import com.example.dev.entity.attribute.MuiGiay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MuiGiayRepo extends JpaRepository<MuiGiay,Integer> {
    List<MuiGiay> findAllByTrangThaiIsTrue(); // Lấy tất cả mũi giày đang bán
    boolean existsByTen(String ten); // Kiểm tra xem tên mũi giày có tồn tại không
    List<MuiGiay> findByTen(String ten); // Tìm mũi giày theo tên
    List<MuiGiay> findByTrangThai(Boolean trangThai); // Tìm mũi giày theo trạng thái
    List<MuiGiay> findByTenAndTrangThai(String ten, Boolean trangThai); // Tìm mũi giày theo tên và trạng thái
}

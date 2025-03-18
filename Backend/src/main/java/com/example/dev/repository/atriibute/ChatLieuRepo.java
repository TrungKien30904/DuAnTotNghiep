package com.example.dev.repository.atriibute;

import com.example.dev.entity.attribute.ChatLieu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatLieuRepo extends JpaRepository<ChatLieu,Integer> {
    List<ChatLieu> findAllByTrangThaiIsTrue(); // Lấy tất cả chất liệu đang hoạt động
    boolean existsByTen(String ten); // Kiểm tra xem tên chất liệu có tồn tại không
    List<ChatLieu> findByTen(String ten); // Tìm chất liệu theo tên
    List<ChatLieu> findByTrangThai(Boolean trangThai); // Tìm chất liệu theo trạng thái
    List<ChatLieu> findByTenAndTrangThai(String ten, Boolean trangThai); // Tìm chất liệu theo tên và trạng thái
}

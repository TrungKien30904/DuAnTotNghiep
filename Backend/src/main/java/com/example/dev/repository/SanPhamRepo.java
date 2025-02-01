package com.example.dev.repository;

import com.example.dev.entity.SanPham;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface SanPhamRepo extends JpaRepository<SanPham, Integer> {
    @Modifying
    @Transactional
    @Query("UPDATE SanPham sp SET sp.tenSanPham = :tenSanPham, sp.trangThai = :trangThai, sp.ngaySua = :ngaySua WHERE sp.idSanPham = :idSanPham")
    void updateSanPham(@Param("tenSanPham") String tenSanPham,
                       @Param("trangThai") Boolean trangThai,
                       @Param("ngaySua") LocalDateTime ngaySua,
                       @Param("idSanPham") Integer id
    );
}

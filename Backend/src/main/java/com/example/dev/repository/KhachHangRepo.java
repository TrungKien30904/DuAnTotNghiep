package com.example.dev.repository;

import com.example.dev.entity.KhachHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KhachHangRepo extends JpaRepository<KhachHang, Integer> {

    @Query("SELECT k FROM KhachHang k WHERE " +
            "(:keyword IS NULL OR LOWER(k.maKhachHang) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(k.hoTen) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:trangThai IS NULL OR k.trangThai = COALESCE(:trangThai, k.trangThai)) AND " +
            "(:gioiTinh IS NULL OR k.gioiTinh = COALESCE(:gioiTinh, k.gioiTinh)) AND " +
            "(:soDienThoai IS NULL OR k.soDienThoai LIKE CONCAT('%', :soDienThoai, '%')) order by k.idKhachHang desc")
    Page<KhachHang> timKiem(@Param("keyword") String keyword,
                            @Param("trangThai") Boolean trangThai,
                            @Param("gioiTinh") Boolean gioiTinh,
                            @Param("soDienThoai") String soDienThoai,
                            Pageable pageable);

    Optional<KhachHang> findBySoDienThoai(String soDienThoai);
    Optional<KhachHang> findByMaKhachHang(String maKhachHang);
    Optional<KhachHang> findByEmail(String email);

}

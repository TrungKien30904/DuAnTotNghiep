package com.example.dev.repository;

import com.example.dev.entity.PhieuGiamGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface PhieuGiamGiaRepository extends JpaRepository<PhieuGiamGia,Integer> {
    @Query("SELECT p FROM PhieuGiamGia p WHERE " +
            "(:keyword IS NULL OR LOWER(REPLACE(p.maKhuyenMai, ' ', '')) LIKE LOWER(REPLACE(CONCAT('%', :keyword, '%'), ' ', '')) OR LOWER(REPLACE(p.tenKhuyenMai, ' ', '')) LIKE LOWER(REPLACE(CONCAT('%', :keyword, '%'), ' ', ''))) AND " +
            "(:trangThai IS NULL OR p.trangThai = :trangThai) AND " +
            "(:startDate IS NULL OR :endDate IS NULL OR (p.ngayBatDau >= :startDate AND p.ngayKetThuc <= :endDate))")
    Page<PhieuGiamGia> searchByMultipleCriteria(
            @Param("keyword") String keyword,
            @Param("trangThai") Integer trangThai,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    boolean existsByMaKhuyenMai(String maKhuyenMai);

    @Query("SELECT p FROM PhieuGiamGia p LEFT JOIN FETCH p.danhSachKhachHang")
    List<PhieuGiamGia> findAllWithDetails();

    Page<PhieuGiamGia> findAll(Pageable pageable);


}

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

    // khách hành cụ thể
    @Query("SELECT DISTINCT p FROM PhieuGiamGia p " +
            "LEFT JOIN p.danhSachKhachHang khpg " +
            "WHERE p.trangThai = 1 " +
            "AND (" +
            "    (p.loai = 'Công Khai') OR " +
            "    (:khachHangId IS NOT NULL AND p.loai = 'Cá Nhân' AND khpg.khachHang.idKhachHang = :khachHangId)" +
            ")")
    List<PhieuGiamGia> findApplicableVouchers(@Param("khachHangId") Integer khachHangId);

    // khách lẻ
    @Query("SELECT p FROM PhieuGiamGia p WHERE p.trangThai = 1 AND p.loai = 'Công Khai'")
    List<PhieuGiamGia> findPublicVouchers();

    // tìm theo mã
    @Query("""
    SELECT DISTINCT p FROM PhieuGiamGia p
    LEFT JOIN p.danhSachKhachHang khpg
    WHERE p.trangThai = 1 
    AND (
        (p.loai = 'Công Khai' AND p.maKhuyenMai LIKE %:keyword2%) 
        OR 
        (p.loai = 'Cá Nhân' AND khpg.khachHang.idKhachHang = :idKhachHang AND p.maKhuyenMai LIKE %:keyword2%)
    )
""")
    List<PhieuGiamGia> timKiemPhieuTheoMa(
            @Param("idKhachHang") Integer idKhachHang,
            @Param("keyword2") String keyword2
    );

    @Query("""
    SELECT p FROM PhieuGiamGia p 
    WHERE p.trangThai = 1 
    AND p.loai = 'Công Khai' 
    AND p.maKhuyenMai LIKE %:keyword2%
""")
    List<PhieuGiamGia> findByMaKhuyenMaiKhachLe(@Param("keyword2") String keyword2);

}

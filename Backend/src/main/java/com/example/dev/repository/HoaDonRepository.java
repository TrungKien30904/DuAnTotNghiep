package com.example.dev.repository;

import com.example.dev.entity.HoaDon;
import com.example.dev.entity.HoaDonChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {

    HoaDon findByMaHoaDon(String maHoaDon);

    @Query("SELECT h FROM HoaDon h " +
            "WHERE (:loaiDon IS NULL OR h.loaiDon = :loaiDon) " +
            "AND (:startDate IS NULL OR h.ngayTao >= :startDate) " +
            "AND (:endDate IS NULL OR h.ngayTao <= :endDate) " +
            "AND (:searchQuery IS NULL OR " +
            "LOWER(h.tenNguoiNhan) = LOWER(:searchQuery)" +
            "OR LOWER(h.maHoaDon) LIKE LOWER(CONCAT('%', :searchQuery, '%')) " +
            "OR LOWER(h.soDienThoai) LIKE LOWER(CONCAT('%', :searchQuery, '%')) " +
            "OR LOWER(h.email) LIKE LOWER(CONCAT('%', :searchQuery, '%'))) ")
    List<HoaDon> findBySearchCriteria(String loaiDon, LocalDateTime startDate, LocalDateTime endDate, String searchQuery);

//    @Query("SELECT hd FROM HoaDon  hd where  hd.")fsdfds

    List<HoaDon> findAllByTrangThaiEqualsIgnoreCase(String status);
}

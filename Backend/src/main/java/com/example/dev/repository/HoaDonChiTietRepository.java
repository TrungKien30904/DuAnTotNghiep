package com.example.dev.repository;

import com.example.dev.entity.HoaDonChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, Integer>{


    //123
    @Query("SELECT hdct FROM HoaDonChiTiet hdct WHERE hdct.hoaDon.maHoaDon = :maHoaDon")
    List<HoaDonChiTiet> findByIdHoaDon(@Param("maHoaDon") String maHoaDon);
}

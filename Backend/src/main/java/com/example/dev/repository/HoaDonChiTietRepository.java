package com.example.dev.repository;

import com.example.dev.entity.HoaDonChiTiet;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, Integer>{


    //123
    @Query("SELECT hdct FROM HoaDonChiTiet hdct WHERE hdct.hoaDon.maHoaDon = :maHoaDon and hdct.deletedAt=false ")
    List<HoaDonChiTiet> findByIdHoaDon(@Param("maHoaDon") String maHoaDon);

    @Modifying
    @Transactional
    @Query("update HoaDonChiTiet  hdct set hdct.deletedAt=true where hdct.idHoaDonChiTiet=:id")
    void softDelete(Integer id);
}

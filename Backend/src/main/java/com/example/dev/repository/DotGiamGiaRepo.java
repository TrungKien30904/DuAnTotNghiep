package com.example.dev.repository;

import com.example.dev.entity.DotGiamGia;
import com.example.dev.entity.attribute.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DotGiamGiaRepo extends JpaRepository<DotGiamGia, String>, JpaSpecificationExecutor<DotGiamGia> {

    @Query("SELECT COUNT(dgg) FROM DotGiamGia dgg")
    Long LayMaDGG();

    DotGiamGia save(DotGiamGia dotGiamGia);

    @Query("SELECT sp FROM SanPham sp WHERE sp.trangThai = true")
    List<SanPham> getSpAll();

    Optional<DotGiamGia> findById(String idDotGiamGia);

    //làm bên quét qr
    @Query(value = "SELECT * FROM dot_giam_gia " +
            "where ngay_ket_thuc >= CAST(GETDATE() AS DATE) " +
            "AND trang_thai = 1",
            nativeQuery = true)
    Optional<DotGiamGia> findActiveDotGiamGia();


}

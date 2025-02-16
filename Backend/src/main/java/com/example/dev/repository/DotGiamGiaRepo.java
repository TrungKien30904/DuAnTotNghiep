package com.example.dev.repository;

import com.example.dev.entity.DotGiamGia;
import com.example.dev.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DotGiamGiaRepo extends JpaRepository<DotGiamGia, String>, JpaSpecificationExecutor<DotGiamGia> {
//    @Modifying
//    @Transactional
//    @Query("")
//    void updateSanPham(@Param("tenSanPham") String tenSanPham,
//                       @Param("trangThai") Boolean trangThai,
//                       @Param("ngaySua") LocalDateTime ngaySua,
//                       @Param("idDotGiamGia") Integer id
//    );
    @Query("SELECT COUNT(dgg) FROM DotGiamGia dgg")
    Long LayMaDGG();

    DotGiamGia save(DotGiamGia dotGiamGia);

    @Query("SELECT sp FROM SanPham sp WHERE sp.trangThai = true")
    List<SanPham> getSpAll();

    Optional<DotGiamGia> findById(String idDotGiamGia);


}

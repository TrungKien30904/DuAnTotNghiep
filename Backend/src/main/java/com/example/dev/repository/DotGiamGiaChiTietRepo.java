package com.example.dev.repository;

import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.entity.DotGiamGia;
import com.example.dev.entity.DotGiamGiaChiTiet;
import com.example.dev.entity.attribute.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface DotGiamGiaChiTietRepo extends JpaRepository<DotGiamGiaChiTiet, Integer> {
    DotGiamGiaChiTiet save(DotGiamGiaChiTiet dotGiamGiaChiTiet);

    @Query("SELECT d.chiTietSanPham.id FROM DotGiamGiaChiTiet d WHERE d.dotGiamGia.id = :idDotGiamGia")
    List<Integer> findIdSanPhamChiTietByIdDotGiamGia(@Param("idDotGiamGia") String idDotGiamGia);

    @Query("SELECT DISTINCT d.chiTietSanPham.sanPham.id FROM DotGiamGiaChiTiet d WHERE d.chiTietSanPham.id IN :idSanPhamChiTiet")
    List<Integer> findIdSanPhamChiTietByList(@Param("idSanPhamChiTiet") List<Integer> idSanPhamChiTiet);

    @Query("SELECT d FROM SanPham d WHERE d.idSanPham IN :idSanPham")
    List<SanPham> findSanPhamByListId(@Param("idSanPham") List<Integer> idSanPham);

    @Query("SELECT d FROM ChiTietSanPham d WHERE d.idChiTietSanPham IN :idSanPhamChiTiet")
    List<ChiTietSanPham> findChiTietSanPhamByListId(@Param("idSanPhamChiTiet") List<Integer> idSanPhamChiTiet);

    //    @Query("SELECT d FROM ChiTietSanPham d WHERE d.idChiTietSanPham IN :idSanPhamChiTiet")
//    List<ChiTietSanPham> findChiTietSanPhamById(@Param("idSanPhamChiTiet") Integer idSanPhamChiTiet);
    @Query("SELECT d FROM DotGiamGiaChiTiet d " +
            "WHERE d.chiTietSanPham.idChiTietSanPham = :idChiTiet " +
            "AND d.dotGiamGia.id = :idDotGiamGia")
    Optional<DotGiamGiaChiTiet> findByChiTietAndDot(@Param("idChiTiet") Integer idChiTiet,
                                                    @Param("idDotGiamGia") Integer idDotGiamGia);


    @Transactional
    @Modifying
    @Query("DELETE FROM DotGiamGiaChiTiet d WHERE d.dotGiamGia = :dotGiamGia")
    void deleteByDotGiamGia(@Param("dotGiamGia") DotGiamGia dotGiamGia);
}

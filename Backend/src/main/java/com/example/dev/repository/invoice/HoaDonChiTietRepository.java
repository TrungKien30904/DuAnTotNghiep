package com.example.dev.repository.invoice;

import com.example.dev.DTO.request.HoaDonChiTiet.HoaDonChiTietRequest;
import com.example.dev.entity.invoice.HoaDonChiTiet;
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
    @Query(value = "SELECT hdct FROM HoaDonChiTiet hdct WHERE hdct.hoaDon.maHoaDon = :maHoaDon and hdct.deletedAt=false ",nativeQuery = true)
    List<HoaDonChiTiet> findByIdHoaDon(@Param("maHoaDon") String maHoaDon);

    @Modifying
    @Transactional
    @Query(value = "update HoaDonChiTiet  hdct set hdct.deletedAt=true where hdct.idHoaDonChiTiet=:id",nativeQuery = true)
    void softDelete(Integer id);

    // Của kiên
    List<HoaDonChiTiet> findByHoaDon_MaHoaDon(String maHoaDon);

    List<HoaDonChiTiet> findAllByHoaDon_IdHoaDon(Integer idHoaDon);

    @Query(value = """
    EXEC sp_LayHoaDonChiTiet @idHoaDon = :idHoaDon
""",nativeQuery = true)
    List<HoaDonChiTietRequest> listCart(@Param("idHoaDon") Integer idHoaDon);

    List<HoaDonChiTiet> findAllByChiTietSanPham_IdChiTietSanPhamAndHoaDon_TrangThaiNot(Integer chiTietSanPhamIdChiTietSanPham, String hoaDonTrangThai);
    // Của kiên đến đây
}

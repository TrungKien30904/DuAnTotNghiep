package com.example.dev.repository;

import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.entity.DotGiamGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChiTietSanPhamRepo extends JpaRepository<ChiTietSanPham, Integer> {
    List<ChiTietSanPham> findBySanPham_IdSanPham(Integer id, Pageable pageable);

    @Query(value = """
                select * from chi_tiet_san_pham 
                WHERE
                    [ma] LIKE %:search%
                OR [id_mui_giay] LIKE %:search%
                OR [id_san_pham] LIKE %:search%
                OR [id_mau_sac] LIKE %:search%
                OR [id_nha_cung_cap] LIKE %:search%
                OR [id_kich_co] LIKE %:search%
                OR [id_chat_lieu] LIKE %:search%
                OR [id_de_giay] LIKE %:search%
                OR [id_thuong_hieu] LIKE %:search%
                OR [id_danh_muc] LIKE %:search%
                OR [id_co_giay] LIKE %:search%
                OR [so_luong] LIKE %:search%
                OR [gia] LIKE %:search%
                OR [mo_ta] LIKE %:search%
                OR [trang_thai] LIKE %:search%
                OR [ngay_tao] LIKE %:search%
                OR [ngay_sua] LIKE %:search%
                OR [nguoi_tao] LIKE %:search%
                OR [nguoi_sua] LIKE %:search%;
            """, nativeQuery = true)
    Page<ChiTietSanPham> searchs(@Param("search") String search, Pageable pageable);

    //    Tìm các sản phẩm có id trong mảng và phân trang
    Page<ChiTietSanPham> findBySanPhamIdSanPhamIn(List<Integer> idSanPham, Pageable pageable);

    DotGiamGia save(DotGiamGia dotGiamGia);

//    @Query("SELECT c FROM ChiTietSanPham c WHERE (:tenMuiGiay IS NULL OR c.muiGiay.ten = :tenMuiGiay) " +
//            "AND (:tenSanPham IS NULL OR c.sanPham.ten = :tenSanPham) " +
//            "AND (:idMauSac IS NULL OR c.mauSac.ten = :idMauSac) " +
//            "AND (:idNhaCungCap IS NULL OR c.nhaCungCap.ten = :idNhaCungCap) " +
//            "AND (:idKichCo IS NULL OR c.kichCo.ten = :idKichCo) " +
//            "AND (:idChatLieu IS NULL OR c.chatLieu.ten = :idChatLieu) " +
//            "AND (:idDeGiay IS NULL OR c.deGiay.ten = :idDeGiay) " +
//            "AND (:idThuongHieu IS NULL OR c.thuongHieu.ten = :idThuongHieu) " +
//            "AND (:idDanhMucSanPham IS NULL OR c.danhMucSanPham.ten = :idDanhMucSanPham) " +
//            "AND (:idCoGiay IS NULL OR c.coGiay.ten = :idCoGiay) "
//            + "AND (:trangThai IS NULL OR c.trangThai = :trangThai)")
//    List<ChiTietSanPham> searchChiTietSanPham(
//            @Param("tenMuiGiay") String tenMuiGiay,
//            @Param("tenSanPham") String tenSanPham,
//            @Param("ten") String tenMauSac,
//            @Param("ten") String tenNhaCungCap,
//            @Param("ten") String tenKichCo,
//            @Param("ten") String tenChatLieu,
//            @Param("ten") String tenDeGiay,
//            @Param("ten") String tenThuongHieu,
//            @Param("ten") String tenDanhMucSanPham,
//            @Param("ten") String tenCoGiay,
//            @Param("trangThai") Boolean trangThai);
@Query("SELECT c FROM ChiTietSanPham c WHERE (:tenMuiGiay IS NULL OR c.muiGiay.ten = :tenMuiGiay) " +
        "AND (:tenSanPham IS NULL OR c.sanPham.ten = :tenSanPham) " +
        "AND (:tenMauSac IS NULL OR c.mauSac.ten = :tenMauSac) " +
        "AND (:tenNhaCungCap IS NULL OR c.nhaCungCap.ten = :tenNhaCungCap) " +
        "AND (:tenKichCo IS NULL OR c.kichCo.ten = :tenKichCo) " +
        "AND (:tenChatLieu IS NULL OR c.chatLieu.ten = :tenChatLieu) " +
        "AND (:tenDeGiay IS NULL OR c.deGiay.ten = :tenDeGiay) " +
        "AND (:tenThuongHieu IS NULL OR c.thuongHieu.ten = :tenThuongHieu) " +
        "AND (:tenDanhMucSanPham IS NULL OR c.danhMucSanPham.ten = :tenDanhMucSanPham) " +
        "AND (:tenCoGiay IS NULL OR c.coGiay.ten = :tenCoGiay) " +
        "AND (:trangThai IS NULL OR c.trangThai = :trangThai)")
Page<ChiTietSanPham> searchChiTietSanPham(
        @Param("tenMuiGiay") String tenMuiGiay,
        @Param("tenSanPham") String tenSanPham,
        @Param("tenMauSac") String tenMauSac,
        @Param("tenNhaCungCap") String tenNhaCungCap,
        @Param("tenKichCo") String tenKichCo,
        @Param("tenChatLieu") String tenChatLieu,
        @Param("tenDeGiay") String tenDeGiay,
        @Param("tenThuongHieu") String tenThuongHieu,
        @Param("tenDanhMucSanPham") String tenDanhMucSanPham,
        @Param("tenCoGiay") String tenCoGiay,
        @Param("trangThai") Boolean trangThai,
        Pageable pageable);

}

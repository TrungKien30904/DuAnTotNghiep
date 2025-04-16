package com.example.dev.repository;

import com.example.dev.DTO.request.DotGiamGia.SpGiamGiaRequest;
import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.entity.DotGiamGia;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChiTietSanPhamRepo extends JpaRepository<ChiTietSanPham, Integer> {
    List<ChiTietSanPham> findBySanPham_IdSanPhamAndGiaDuocTinhIsNull(Integer id, Pageable pageable);
    @Query(value = """
    select * from chi_tiet_san_pham\s
    where id_san_pham = :idSanPham and gia_duoc_tinh is null and trang_thai = 1 and id_mau_sac = :idMauSac
""",nativeQuery = true)
    List<ChiTietSanPham> getAllProductByColor(@Param("idSanPham") Integer idSanPham,@Param("idMauSac") Integer idMauSac);

    List<ChiTietSanPham> findChiTietSanPhamBySanPham_IdSanPhamAndGiaDuocTinhIsNull(Integer id);
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


    @Modifying
    @Transactional
    @Query(value = """
    update chi_tiet_san_pham set so_luong = :soLuong where id_chi_tiet_san_pham = :idChiTietSanPham or tao_boi = :idChiTietSanPham
""", nativeQuery = true)
    void updateQuantity(@Param("idChiTietSanPham") Integer idChiTietSanPham,
                        @Param("soLuong") Integer soLuong);


    @Query(value = "EXEC sp_TinhGiaSauGiam :idChiTietSanPham",nativeQuery = true)
    List<SpGiamGiaRequest> getSanPhamGiamGia(@Param("idChiTietSanPham") Integer idChiTietSanPham);

    List<ChiTietSanPham> findAllByTaoBoi(Integer taoBoi);

}

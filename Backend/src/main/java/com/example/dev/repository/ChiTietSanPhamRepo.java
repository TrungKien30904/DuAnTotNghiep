package com.example.dev.repository;

import com.example.dev.entity.ChiTietSanPham;
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
}

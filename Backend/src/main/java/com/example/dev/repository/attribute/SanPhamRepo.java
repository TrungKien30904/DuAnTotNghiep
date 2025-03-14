package com.example.dev.repository.attribute;

import com.example.dev.DTO.response.product.SanPhamDTO;
import com.example.dev.entity.attribute.SanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SanPhamRepo extends JpaRepository<SanPham, Integer> {
    @Modifying
    @Transactional
    @Query("UPDATE SanPham sp SET sp.ten = :tenSanPham, sp.trangThai = :trangThai, sp.ngaySua = :ngaySua WHERE sp.idSanPham = :idSanPham")
    void updateSanPham(@Param("tenSanPham") String tenSanPham,
                       @Param("trangThai") Boolean trangThai,
                       @Param("ngaySua") LocalDateTime ngaySua,
                       @Param("idSanPham") Integer id
    );

    @Query(value = """
                  select sp.id_san_pham, sp.ma_san_pham, sp.ten_san_pham as 'ten', sum(ctsp.so_luong) as 'so_luong',sp.trang_thai, sp.ngay_tao,sp.ngay_sua,sp.nguoi_tao,sp.nguoi_sua   from san_pham sp\s
                  left join chi_tiet_san_pham ctsp\s
                  on sp.id_san_pham = ctsp.id_san_pham
                  group by sp.id_san_pham, sp.ma_san_pham, sp.ten_san_pham, sp.trang_thai, sp.ngay_tao,sp.ngay_sua,sp.nguoi_sua,sp.nguoi_tao
                  """
            ,nativeQuery = true
    )
    List<SanPhamDTO> getAll();

    List<SanPham> findAllByTrangThaiIsTrue();

    Page<SanPham> findByTenContaining(String tenSanPham, Pageable pageable);

}

package com.example.dev.repository.attribute;

import com.example.dev.entity.attribute.ThuongHieu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ThuongHieuRepo extends JpaRepository<ThuongHieu,Integer> {
    List<ThuongHieu> findAllByTrangThaiIsTrue();

    @Query("""
    SELECT th FROM ThuongHieu th
    WHERE
        (:search IS NULL OR
         LOWER(CAST(th.idThuongHieu AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR
         LOWER(th.ten) LIKE LOWER(CONCAT('%', :search, '%')) OR
         LOWER(CAST(th.trangThai AS string)) LIKE LOWER(CONCAT('%', :search, '%')))
""")
    Page<ThuongHieu> searchByBrand(@Param("search") String search, Pageable pageable);

}

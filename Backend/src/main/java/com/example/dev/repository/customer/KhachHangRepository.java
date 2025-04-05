package com.example.dev.repository.customer;

import com.example.dev.entity.customer.KhachHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang,Integer> {

    @Query("""
        SELECT k FROM KhachHang k 
        WHERE 
        LOWER(REPLACE(k.hoTen, ' ', '')) LIKE LOWER(REPLACE(CONCAT('%', :keyword, '%'), ' ', '')) 
        OR LOWER(REPLACE(k.soDienThoai, ' ', '')) LIKE LOWER(REPLACE(CONCAT('%', :keyword, '%'), ' ', '')) 
        OR LOWER(REPLACE(k.email, ' ', '')) LIKE LOWER(REPLACE(CONCAT('%', :keyword, '%'), ' ', ''))
    """)
    Page<KhachHang> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    Page<KhachHang> findAll(Pageable pageable);
}

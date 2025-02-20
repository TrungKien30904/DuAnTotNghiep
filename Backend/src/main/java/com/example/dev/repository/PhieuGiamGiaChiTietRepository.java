package com.example.dev.repository;

import com.example.dev.entity.PhieuGiamGiaChiTiet;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PhieuGiamGiaChiTietRepository extends JpaRepository<PhieuGiamGiaChiTiet, Integer> {

}

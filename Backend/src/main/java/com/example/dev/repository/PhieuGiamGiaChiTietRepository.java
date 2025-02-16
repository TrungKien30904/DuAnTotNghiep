package com.example.dev.repository;

import com.example.dev.entity.PhieuGiamGiaChiTiet;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuGiamGiaChiTietRepository extends JpaRepository<PhieuGiamGiaChiTiet, Integer> {
    @Transactional
    void deleteByPhieuGiamGiaId(Integer phieuGiamGiaId);

}


package com.example.dev.repository;

import com.example.dev.entity.LichSuHoaDon;
import com.example.dev.entity.ThanhToanHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThanhToanHoaDonRepository extends JpaRepository<ThanhToanHoaDon, Long> {
}

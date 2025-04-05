package com.example.dev.repository.invoice;

import com.example.dev.entity.invoice.ThanhToanHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThanhToanHoaDonRepository extends JpaRepository<ThanhToanHoaDon, Integer> {
    ThanhToanHoaDon findByHoaDon_IdHoaDon(Integer id);

    List<ThanhToanHoaDon> findAllByHoaDon_IdHoaDon(Integer id);
}

package com.example.dev.repository.invoice;

import com.example.dev.entity.invoice.LichSuHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichSuHoaDonRepository extends JpaRepository<LichSuHoaDon, Integer> {
    List<LichSuHoaDon> findByHoaDon_IdHoaDon(Integer idHoaDon);
}

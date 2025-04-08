package com.example.dev.repository.invoice;

import com.example.dev.entity.invoice.ThanhToanHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThanhToanHoaDonRepository extends JpaRepository<ThanhToanHoaDon, Integer> {
    ThanhToanHoaDon findByHoaDon_IdHoaDon(Integer id);

    List<ThanhToanHoaDon> findAllByHoaDon_IdHoaDon(Integer id);
    @Query("SELECT t FROM ThanhToanHoaDon t WHERE t.hoaDon.idHoaDon = :idHoaDon")
    ThanhToanHoaDon findByHoaDonId1(@Param("idHoaDon") Integer idHoaDon);
    @Query("SELECT t FROM ThanhToanHoaDon t WHERE t.hoaDon.idHoaDon = :idHoaDon")
    Optional<ThanhToanHoaDon> findByHoaDonId2(@Param("idHoaDon") Integer idHoaDon);
}

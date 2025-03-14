package com.example.dev.repository.atriibute;

import com.example.dev.entity.attribute.CoGiay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CoGiayRepo extends JpaRepository<CoGiay,Integer> {
    List<CoGiay> findAllByTrangThaiIsTrue();
    List<CoGiay> findAllByTen(String ten);
    Optional<CoGiay> findByTen(String ten);
    List<CoGiay> findByTrangThai(Boolean trangThai);
    List<CoGiay> findByTenAndTrangThai(String ten, Boolean trangThai);
}

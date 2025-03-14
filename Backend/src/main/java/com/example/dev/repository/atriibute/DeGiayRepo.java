package com.example.dev.repository.atriibute;

import com.example.dev.entity.attribute.DeGiay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeGiayRepo extends JpaRepository<DeGiay, Integer> {
    List<DeGiay> findAllByTrangThaiIsTrue();
    boolean existsByTen(String ten);
    List<DeGiay> findByTen(String ten);
    List<DeGiay> findByTrangThai(Boolean trangThai);
    List<DeGiay> findByTenAndTrangThai(String ten, Boolean trangThai);
}

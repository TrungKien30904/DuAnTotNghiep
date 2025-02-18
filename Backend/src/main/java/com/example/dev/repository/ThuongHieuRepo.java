package com.example.dev.repository;

import com.example.dev.entity.attribute.ThuongHieu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ThuongHieuRepo extends JpaRepository<ThuongHieu,Integer> {
    List<ThuongHieu> findAllByTrangThaiIsTrue();
}

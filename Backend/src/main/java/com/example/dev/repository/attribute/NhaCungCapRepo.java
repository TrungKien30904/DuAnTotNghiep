package com.example.dev.repository.attribute;

import com.example.dev.entity.attribute.NhaCungCap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NhaCungCapRepo extends JpaRepository<NhaCungCap, Integer> {
    List<NhaCungCap> findAllByTrangThaiIsTrue();
}

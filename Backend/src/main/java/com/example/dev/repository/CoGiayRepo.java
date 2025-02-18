package com.example.dev.repository;

import com.example.dev.entity.attribute.CoGiay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoGiayRepo extends JpaRepository<CoGiay,Integer> {
    List<CoGiay> findAllByTrangThaiIsTrue();
}

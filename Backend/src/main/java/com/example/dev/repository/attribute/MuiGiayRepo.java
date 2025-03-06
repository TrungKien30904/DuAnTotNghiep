package com.example.dev.repository.attribute;

import com.example.dev.entity.attribute.MuiGiay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MuiGiayRepo extends JpaRepository<MuiGiay,Integer> {
    List<MuiGiay> findAllByTrangThaiIsTrue();
}

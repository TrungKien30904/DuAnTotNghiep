package com.example.dev.repository.attribute;

import com.example.dev.entity.attribute.DeGiay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeGiayRepo extends JpaRepository<DeGiay,Integer> {
    List<DeGiay> findAllByTrangThaiIsTrue();
}

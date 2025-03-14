package com.example.dev.repository.attribute;

import com.example.dev.entity.attribute.KichCo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface KichCoRepo extends JpaRepository<KichCo, Integer> {
    List<KichCo> findAllByTrangThaiIsTrue();
}

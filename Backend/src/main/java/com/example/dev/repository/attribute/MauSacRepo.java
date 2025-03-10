package com.example.dev.repository.attribute;

import com.example.dev.entity.attribute.MauSac;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MauSacRepo extends JpaRepository<MauSac,Integer> {
    List<MauSac> findAllByTrangThaiIsTrue();

    MauSac findMauSacByTenEqualsIgnoreCase(String ten);
}

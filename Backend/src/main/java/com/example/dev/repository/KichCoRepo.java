package com.example.dev.repository;

import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.entity.KichCo;
import org.springframework.data.jpa.repository.JpaRepository;


public interface KichCoRepo extends JpaRepository<KichCo, Integer> {

}

package com.example.dev.service;

import com.example.dev.entity.SanPham;
import com.example.dev.repository.SanPhamRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SanPhamService {
    @Autowired
    SanPhamRepo sanPhamRepo;

    public List<SanPham> getSp(){
        return sanPhamRepo.findAll();
    }

    public List<SanPham> themSanPham(SanPham sanPham){
        sanPham.setNgayTao(LocalDateTime.now());
        sanPhamRepo.save(sanPham);
        return getSp();
    }

    public List<SanPham> suaSanPham(SanPham sanPham,Integer id){
        sanPhamRepo.updateSanPham(sanPham.getTenSanPham(), sanPham.getTrangThai(),LocalDateTime.now(),id);
        return getSp();
    }

}

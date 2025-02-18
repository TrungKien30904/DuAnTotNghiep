package com.example.dev.service;

import com.example.dev.DTO.response.product.SanPhamDTO;
import com.example.dev.entity.attribute.SanPham;
import com.example.dev.repository.SanPhamRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SanPhamService {
    @Autowired
    SanPhamRepo sanPhamRepo;

    public List<SanPhamDTO> getSpDTO(){
        return sanPhamRepo.getAll();
    }
    public List<SanPham> getSanPhamBan(){
        return sanPhamRepo.findAllByTrangThaiIsTrue();
    }

    @Transactional
    public SanPham themSanPham(SanPham sanPham) {
        sanPham.setNgayTao(LocalDateTime.now());
        sanPham.setNguoiTao("Admin");
        SanPham savedProduct = sanPhamRepo.save(sanPham);
        savedProduct.setMaSanPham(String.format("P-%07d", savedProduct.getIdSanPham()));
        sanPhamRepo.save(savedProduct);
        return savedProduct;
    }

    public List<SanPhamDTO> suaSanPham(SanPham sanPham,Integer id){
        sanPhamRepo.updateSanPham(sanPham.getTen(), sanPham.getTrangThai(),LocalDateTime.now(),id);
        return getSpDTO();
    }


}

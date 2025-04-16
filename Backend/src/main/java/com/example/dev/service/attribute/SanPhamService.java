package com.example.dev.service.attribute;

import com.example.dev.DTO.UserLogin.UserLogin;
import com.example.dev.DTO.response.product.SanPhamDTO;
import com.example.dev.DTO.response.product.SanPhamOnlResponse;
import com.example.dev.entity.attribute.SanPham;
import com.example.dev.repository.attribute.SanPhamRepo;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
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

    public List<SanPhamOnlResponse> getProductOnl(){
        return sanPhamRepo.getListProductOnl();
    }
    @Transactional
    public SanPham themSanPham(SanPham sanPham,Authentication authentication) {
        sanPham.setNgayTao(LocalDateTime.now());
        UserLogin userLogin = (UserLogin) authentication.getPrincipal();
        sanPham.setNguoiTao(userLogin.getUsername());
        SanPham savedProduct = sanPhamRepo.save(sanPham);
        savedProduct.setMaSanPham(String.format("P-%07d", savedProduct.getIdSanPham()));
        sanPhamRepo.save(savedProduct);
        return savedProduct;
    }

    public List<SanPhamDTO> suaSanPham(SanPham sanPham, Integer id, Authentication authentication) {
        UserLogin userLogin = (UserLogin) authentication.getPrincipal();
        sanPham.setNguoiSua(userLogin.getUsername());
        sanPhamRepo.updateSanPham(sanPham.getTen(), sanPham.getTrangThai(),LocalDateTime.now(),id);
        return getSpDTO();
    }


}

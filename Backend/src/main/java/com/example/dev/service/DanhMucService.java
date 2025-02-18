package com.example.dev.service;

import com.example.dev.entity.attribute.DanhMucSanPham;
import com.example.dev.repository.DanhMucSanPhamRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class DanhMucService {
    @Autowired
    DanhMucSanPhamRepo danhMucSanPhamRepo;

    public List<DanhMucSanPham> getDanhMucSanPham(){
        return danhMucSanPhamRepo.findAll();
    }

    public List<DanhMucSanPham> getDanhMucSanPhamBan(){
        return danhMucSanPhamRepo.findAllByTrangThaiIsTrue();
    }

    public DanhMucSanPham themDanhMucSanPham(DanhMucSanPham dmsp){
        danhMucSanPhamRepo.save(dmsp);
        return dmsp;
    }

    public List<DanhMucSanPham> suaDanhMucSanPham(DanhMucSanPham dmsp,Integer id){
        dmsp.setIdDanhMuc(id);
        danhMucSanPhamRepo.save(dmsp);
        return getDanhMucSanPham();
    }
}

package com.example.dev.service;

import com.example.dev.entity.HoaDonChiTiet;
import com.example.dev.repository.HoaDonChiTietRepository;
import com.example.dev.repository.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HoaDonChiTietService {

    @Autowired
    public HoaDonChiTietRepository hoaDonChiTiehoRepository;

    //123
    public List<HoaDonChiTiet> findByIdHoaDon(String maHoaDon) {
        return hoaDonChiTiehoRepository.findByIdHoaDon(maHoaDon);
    }

    public void softDelete(Integer id){
        hoaDonChiTiehoRepository.softDelete(id);
    }


}

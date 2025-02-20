package com.example.dev.service;

import com.example.dev.entity.LichSuHoaDon;
import com.example.dev.entity.ThanhToanHoaDon;
import com.example.dev.repository.ThanhToanHoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ThanhToanHoaDonService {

    @Autowired
    private ThanhToanHoaDonRepository thanhToanHoaDonRepository;

//    public ThanhToanHoaDon findByMaHoaDon(String maHoaDon) {
//        return thanhToanHoaDonRepository.findAll().stream().
//                filter(lichSuHoaDon -> lichSuHoaDon.getHoaDon().getMaHoaDon().equals(maHoaDon))
//                .findFirst().orElse(null);
//    }
}

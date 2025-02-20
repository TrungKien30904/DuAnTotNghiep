package com.example.dev.service;

import com.example.dev.entity.LichSuHoaDon;
import com.example.dev.repository.LichSuHoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LichSuHoaDonService {
    @Autowired
    private LichSuHoaDonRepository lichSuHoaDonRepository;

    public List<LichSuHoaDon> findAllByHoaDonId(String hoaDonId) {
        return lichSuHoaDonRepository.findAll().stream().filter(lichSuHoaDon -> lichSuHoaDon.getHoaDon().getMaHoaDon().equals(hoaDonId)).toList();
    }
}

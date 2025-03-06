package com.example.dev.service.invoice;

import com.example.dev.entity.invoice.ThanhToanHoaDon;
import com.example.dev.repository.invoice.ThanhToanHoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ThanhToanHoaDonService {

    @Autowired
    private ThanhToanHoaDonRepository thanhToanHoaDonRepository;

    public ThanhToanHoaDon findByMaHoaDon(String maHoaDon) {
        return thanhToanHoaDonRepository.findAll().stream().
                filter(lichSuHoaDon -> lichSuHoaDon.getHoaDon().getMaHoaDon().equals(maHoaDon))
                .findFirst().orElse(null);
    }
}

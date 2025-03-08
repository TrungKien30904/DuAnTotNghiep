package com.example.dev.service.invoice;

import com.example.dev.entity.invoice.ThanhToanHoaDon;
import com.example.dev.repository.invoice.ThanhToanHoaDonRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ThanhToanHoaDonService {

    @Autowired
    private ThanhToanHoaDonRepository thanhToanHoaDonRepository;

    public ThanhToanHoaDon findByMaHoaDon(String maHoaDon) {
        return thanhToanHoaDonRepository.findAll().stream().
                filter(lichSuHoaDon -> lichSuHoaDon.getHoaDon().getMaHoaDon().equals(maHoaDon))
                .findFirst().orElse(null);
    }

    public void thanhToanHoaDon(List<ThanhToanHoaDon> list) {
        if (list == null || list.isEmpty()) {
            log.error("thanhToanHoaDon >> list is null or empty");
            return;
        }
        thanhToanHoaDonRepository.saveAll(list);
        log.info("thanhToanHoaDon >> save success");
    }
}

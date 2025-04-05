package com.example.dev.service.invoice;

import com.example.dev.entity.invoice.LichSuHoaDon;
import com.example.dev.repository.invoice.LichSuHoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LichSuHoaDonService {
    @Autowired
    private LichSuHoaDonRepository lichSuHoaDonRepository;

    public List<LichSuHoaDon> findAllByHoaDonId(Integer hoaDonId) {
        return lichSuHoaDonRepository.findByHoaDon_IdHoaDon(hoaDonId);
    }

    public void themLichSu(LichSuHoaDon lichSuHoaDon) {
        lichSuHoaDonRepository.save(lichSuHoaDon);
    }
}

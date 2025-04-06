package com.example.dev.service.invoice;

import com.example.dev.entity.invoice.HoaDon;
import com.example.dev.entity.invoice.ThanhToanHoaDon;
import com.example.dev.repository.invoice.HoaDonRepository;
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
    @Autowired
    private HoaDonRepository hoaDonRepository;

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
    public void capNhatTrangThaiThanhToan(Integer idHoaDon, boolean daThanhToan) {
        System.out.println("HoaDon ID: " + idHoaDon);
        ThanhToanHoaDon thanhToanHoaDonhoaDon = thanhToanHoaDonRepository.findByHoaDonId1(idHoaDon);
       HoaDon hoaDon = hoaDonRepository.findById(idHoaDon).orElseThrow();

        if (daThanhToan) {
            thanhToanHoaDonhoaDon.setTrangThai(true);
            log.info("thanhToanHoaDon >> save success");
        } else {
            thanhToanHoaDonhoaDon.setTrangThai(false);
            hoaDon.setTrangThai("Hủy");
        }

       thanhToanHoaDonRepository.save(thanhToanHoaDonhoaDon);
    }
}

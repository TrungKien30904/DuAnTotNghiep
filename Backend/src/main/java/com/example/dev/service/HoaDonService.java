package com.example.dev.service;

import com.example.dev.entity.HoaDon;
import com.example.dev.entity.LichSuHoaDon;
import com.example.dev.repository.HoaDonRepository;
import com.example.dev.repository.LichSuHoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;


    @Autowired
    private LichSuHoaDonRepository lichSuHoaDonRepository;

    public List<HoaDon> findInvoices(String loaiDon, Optional<LocalDate> startDate, Optional<LocalDate> endDate, String searchQuery) {
        LocalDateTime startDateTime = startDate.map(date -> date.atStartOfDay()).orElse(null);
        LocalDateTime endDateTime = endDate.map(date -> date.atTime(23, 59, 59)).orElse(null);
        List<HoaDon> invoices = hoaDonRepository.findBySearchCriteria(loaiDon, startDateTime, endDateTime, searchQuery);
        return invoices;
    }
    public Map<String, Long> getInvoiceStatistics() {
        List<HoaDon> invoices = hoaDonRepository.findAll();
        return invoices.stream()
                .collect(Collectors.groupingBy(HoaDon::getTrangThai, Collectors.counting()));
    }

    public HoaDon findInvoice(String maHoaDon) {
        return hoaDonRepository.findByMaHoaDon(maHoaDon);
    }

    public HoaDon huy(String maHoaDon) {
        HoaDon hoaDon = findInvoice(maHoaDon);
        hoaDon.setTrangThai("Hủy");
        taoHoaDon(hoaDon, "Hủy", "admin");
        return hoaDonRepository.save(hoaDon);
    }

    public HoaDon xacnhan(String maHoaDon) {
        HoaDon hoaDon = findInvoice(maHoaDon);
        String trangThai = hoaDon.getTrangThai();
        if("Chờ xác nhận".equals(trangThai )){
            hoaDon.setTrangThai("Đã xác nhận");
        }
        if("Đã xác nhận".equals(trangThai )){
            hoaDon.setTrangThai("Chờ vận chuyển");
        }
        if("Chờ vận chuyển".equals(trangThai )){
            hoaDon.setTrangThai("Đã thanh toán");
        }
        if("Đã thanh toán".equals(trangThai )){
            hoaDon.setTrangThai("Giao thành công");
        }
        taoHoaDon(hoaDon, hoaDon.getTrangThai(), "admin");
        return hoaDonRepository.save(hoaDon);
    }

    public HoaDon quaylai(String maHoaDon) {
        HoaDon hoaDon = findInvoice(maHoaDon);
        hoaDon.setTrangThai("Chờ xác nhận");
        taoHoaDon(hoaDon, hoaDon.getTrangThai(), "admin");
        return hoaDonRepository.save(hoaDon);
    }

    public void taoHoaDon(HoaDon hoaDon, String hanhDong, String user){
        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        lichSuHoaDon.setHoaDon(hoaDon);
        lichSuHoaDon.setHanhDong(hanhDong);
        lichSuHoaDon.setNgayTao(LocalDateTime.now());
        lichSuHoaDon.setNguoiTao(user);
        lichSuHoaDonRepository.save(lichSuHoaDon);
    }
}

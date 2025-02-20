package com.example.dev.controller;

import com.example.dev.entity.HoaDon;
import com.example.dev.entity.LichSuHoaDon;
import com.example.dev.entity.ThanhToanHoaDon;
import com.example.dev.repository.LichSuHoaDonRepository;
import com.example.dev.service.HoaDonService;
import com.example.dev.service.LichSuHoaDonService;
import com.example.dev.service.ThanhToanHoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/hoa-don")
@CrossOrigin(origins = "*")
public class HoaDonController {

    @Autowired
    private HoaDonService hoaDonService;

    @Autowired
    private ThanhToanHoaDonService thanhToanHoaDonService;

    @Autowired
    private LichSuHoaDonService lichSuHoaDonService;

    @GetMapping
    public ResponseEntity<List<HoaDon>> getInvoices(
            @RequestParam(required = false) String loaiDon,
            @RequestParam(required = false) Optional<LocalDate> startDate,
            @RequestParam(required = false) Optional<LocalDate> endDate,
            @RequestParam(required = false) String searchQuery) {

        if(loaiDon.trim().length() == 0) {
            loaiDon = null;
        }

        if(searchQuery.trim().length() == 0) {
            searchQuery = null;
        }
        List<HoaDon> invoices = hoaDonService.findInvoices(loaiDon, startDate, endDate, searchQuery);
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/{maHoaDon}")
    public ResponseEntity<HoaDon> getInvoice(@PathVariable String maHoaDon) {
        HoaDon hoaDon = hoaDonService.findInvoice(maHoaDon);
        return ResponseEntity.ok(hoaDon);
    }

    @GetMapping("/{maHoaDon}/lich-su-thanh-toan")
    public ResponseEntity<ThanhToanHoaDon> getPayment(@PathVariable String maHoaDon) {
        ThanhToanHoaDon thanhToanHoaDon = thanhToanHoaDonService.findByMaHoaDon(maHoaDon);
        return ResponseEntity.ok(thanhToanHoaDon);
    }

    @GetMapping("/thong-ke")
    public ResponseEntity<Object> getInvoiceStatistics() {
        var stats = hoaDonService.getInvoiceStatistics();
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{maHoaDon}/xac-nhan")
    public ResponseEntity<Object> xacNhan(@PathVariable String maHoaDon) {
        HoaDon hoaDon = hoaDonService.xacnhan(maHoaDon);
        return ResponseEntity.ok(hoaDon);
    }

    @PutMapping("/{maHoaDon}/huy")
    public ResponseEntity<Object> huy(@PathVariable String maHoaDon) {
        HoaDon hoaDon = hoaDonService.huy(maHoaDon);
        return ResponseEntity.ok(hoaDon);
    }

    @PutMapping("/{maHoaDon}/quay-lai")
    public ResponseEntity<Object> quayLai(@PathVariable String maHoaDon) {
        HoaDon hoaDon = hoaDonService.quaylai(maHoaDon);
        return ResponseEntity.ok(hoaDon);
    }

    @GetMapping("/{maHoaDon}/lich-su-hoa-don")
    public ResponseEntity<Object> lichSuHoaDon(@PathVariable String maHoaDon) {
        List<LichSuHoaDon> lichSuHoaDons = lichSuHoaDonService.findAllByHoaDonId(maHoaDon);
        return ResponseEntity.ok(lichSuHoaDons);
    }
}

package com.example.dev.controller;

import com.example.dev.entity.HoaDon;
import com.example.dev.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/hoa-don")
@CrossOrigin(origins = "*")
public class HoaDonController {

    @Autowired
    private HoaDonService hoaDonService;

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


    @GetMapping("/thong-ke")
    public ResponseEntity<Object> getInvoiceStatistics() {
        var stats = hoaDonService.getInvoiceStatistics();
        return ResponseEntity.ok(stats);
    }
}

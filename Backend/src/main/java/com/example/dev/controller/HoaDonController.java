package com.example.dev.controller;

import com.example.dev.entity.HoaDon;
import com.example.dev.entity.LichSuHoaDon;
import com.example.dev.entity.ThanhToanHoaDon;
import com.example.dev.service.HoaDonService;
import com.example.dev.service.LichSuHoaDonService;
import com.example.dev.service.ThanhToanHoaDonService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.Resource;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
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

    @PutMapping("/update-voucher/{idHoaDon}")
    public ResponseEntity<?> updateVoucherForOrder(
            @PathVariable("idHoaDon") Integer idHoaDon,
            @RequestBody Map<String, Integer> body) {
        try {
            Integer voucherId = body.get("voucherId"); // Lấy voucherId từ body gửi lên
            hoaDonService.updateVoucher(idHoaDon, voucherId);
            return ResponseEntity.ok("Cập nhật voucher thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Có lỗi khi cập nhật voucher: " + e.getMessage());
        }
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
    @GetMapping("/export-excel")
    public ResponseEntity<Resource> exportExcel(HttpServletResponse response) {
        Resource file = hoaDonService.xuatExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=FileExcel.xlsx")
                .header(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .body(file);
    }

    //l123

    @PostMapping("/create")
    public ResponseEntity<?> createHoaDon(@RequestBody HoaDon hoaDon) {
        HoaDon savedHoaDon = hoaDonService.createHoaDon(hoaDon);
        return ResponseEntity.ok(savedHoaDon);
    }

    @GetMapping("/listHoaDon")
    public ResponseEntity<List<HoaDon>> findAllHoaDon() {
        List<HoaDon> hoaDons = hoaDonService.findAll();
        return ResponseEntity.ok(hoaDons);
    }

    @GetMapping("/hd-ban-hang")
    public ResponseEntity<?> findAllHoaDonByStatus() {
        return ResponseEntity.ok(hoaDonService.findAllByStatus());
    }

    @GetMapping("/delete/{idHoaDon}")
    public ResponseEntity<String> deleteHoaDon(@PathVariable Integer idHoaDon) {
        try {
            hoaDonService.deleteById(idHoaDon);
            return ResponseEntity.ok("Xóa hóa đơn thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/thanh-toan")
    public ResponseEntity<?> thanhToan(@RequestBody HoaDon hoaDon) {
        try {
            hoaDonService.pay(hoaDon);
            return ResponseEntity.ok("Xóa hóa đơn thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

package com.example.dev.controller.invoice;

import com.example.dev.DTO.response.HoaDon.HoaDonResponse;
import com.example.dev.entity.PhieuGiamGia;
import com.example.dev.entity.invoice.HoaDon;
import com.example.dev.entity.invoice.LichSuHoaDon;
import com.example.dev.entity.invoice.ThanhToanHoaDon;
import com.example.dev.service.invoice.HoaDonService;
import com.example.dev.service.invoice.LichSuHoaDonService;
import com.example.dev.service.invoice.ThanhToanHoaDonService;
import jakarta.annotation.security.PermitAll;
import javax.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static com.example.dev.security.JWTFilter.IP_ADDRESS;

@RestController
@RequestMapping("/admin/hoa-don")
//@PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
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

        if (loaiDon.trim().length() == 0) {
            loaiDon = null;
        }

        if (searchQuery.trim().length() == 0) {
            searchQuery = null;
        }
        List<HoaDon> invoices = hoaDonService.findInvoices(loaiDon, startDate, endDate, searchQuery);
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/hien-thi/{idHoaDon}")
    public ResponseEntity<?> getInvoiceById(@PathVariable Integer idHoaDon) {
        return ResponseEntity.ok(hoaDonService.findInvoiceByID(idHoaDon));
    }

    @PutMapping("/update-voucher/{idHoaDon}")
    public ResponseEntity<?> updateVoucherForOrder(
            @PathVariable("idHoaDon") Integer idHoaDon,
            @RequestBody Map<String, Integer> body,
            Authentication auth
    ) {
        try {
            Integer voucherId = body.get("voucherId"); // Lấy voucherId từ body gửi lên
            hoaDonService.updateVoucher(idHoaDon, voucherId, auth);
            return ResponseEntity.ok("Cập nhật voucher thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Có lỗi khi cập nhật voucher: " + e.getMessage());
        }
    }


    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
    @GetMapping("/{maHoaDon}")
    public ResponseEntity<HoaDon> getInvoice(@PathVariable String maHoaDon) {
        HoaDon hoaDon = hoaDonService.findInvoice(maHoaDon);
        return ResponseEntity.ok(hoaDon);
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
    @GetMapping("/{maHoaDon}/lich-su-thanh-toan")
    public ResponseEntity<ThanhToanHoaDon> getPayment(@PathVariable String maHoaDon) {
        ThanhToanHoaDon thanhToanHoaDon = thanhToanHoaDonService.findByMaHoaDon(maHoaDon);
        return ResponseEntity.ok(thanhToanHoaDon);
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
    @GetMapping("/thong-ke")
    public ResponseEntity<Object> getInvoiceStatistics() {
        var stats = hoaDonService.getInvoiceStatistics();
        return ResponseEntity.ok(stats);
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
    @PutMapping("/{maHoaDon}/xac-nhan")
    public ResponseEntity<Object> xacNhan(@PathVariable String maHoaDon, Authentication auth) {
        HoaDon hoaDon = hoaDonService.xacnhan(maHoaDon, auth);
        return ResponseEntity.ok(hoaDon);
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
    @PutMapping("/{maHoaDon}/huy")
    public ResponseEntity<Object> huy(@PathVariable String maHoaDon, Authentication auth) {
        HoaDon hoaDon = hoaDonService.huy(maHoaDon, auth);
        return ResponseEntity.ok(hoaDon);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
    @PutMapping("/{maHoaDon}/quay-lai")
    public ResponseEntity<Object> quayLai(@PathVariable String maHoaDon, Authentication auth) {
        HoaDon hoaDon = hoaDonService.quaylai(maHoaDon, auth);
        return ResponseEntity.ok(hoaDon);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
    @GetMapping("/{maHoaDon}/lich-su-hoa-don")
    public ResponseEntity<Object> lichSuHoaDon(@PathVariable Integer maHoaDon) {
        return ResponseEntity.ok(lichSuHoaDonService.findAllByHoaDonId(maHoaDon));
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

    @GetMapping("/create")
    public ResponseEntity<?> createHoaDon(Authentication auth) {
        return ResponseEntity.ok(hoaDonService.createHoaDon(auth));
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
    public ResponseEntity<String> deleteHoaDon(@PathVariable Integer idHoaDon, Authentication auth) {
        try {
            hoaDonService.deleteById(idHoaDon, auth);
            return ResponseEntity.ok("Xóa hóa đơn thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/thanh-toan")
    public ResponseEntity<?> thanhToan(@RequestBody HoaDonResponse hoaDon, Authentication auth) {
        try {
            hoaDonService.pay(hoaDon, auth);
            return ResponseEntity.ok("thanh toán hóa đơn thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // online
    @PostMapping("/thanh-toan-cod")
    @PermitAll
    public ResponseEntity<?> thanhToanCOD(@RequestBody HoaDonResponse hoaDon, Authentication auth) {
        try {
            hoaDonService.payCOD(hoaDon, auth);
            return ResponseEntity.ok(Map.of("message", "Đặt hàng COD thành công!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PostMapping("/thanh-toan-vnpay")
    @PermitAll
    public ResponseEntity<?> taoHoaDonVaThanhToan(@RequestBody HoaDonResponse hoaDonResponse, Authentication auth, HttpServletRequest req) {
        String vnp_IpAddr = IP_ADDRESS;
        try {
            String paymentUrl = hoaDonService.taoHoaDonVaThanhToan(hoaDonResponse, auth, vnp_IpAddr, req);
            return ResponseEntity.ok(Collections.singletonMap("paymentUrl", paymentUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tạo hóa đơn: " + e.getMessage());
        }
    }


    @GetMapping("/hien-thi-hoa-don")
    public ResponseEntity<?> hienThiHoaDonKhachHang(@RequestParam(value = "idKhachHang", required = false) Integer idKhachHang) {
        try {
            List<HoaDon> hoaDons = hoaDonService.hienThiHoaDonKhachHang(idKhachHang);
            // Sắp xếp danh sách hóa đơn từ mới nhất đến cũ nhất
            hoaDons.sort((a, b) -> b.getNgayTao().compareTo(a.getNgayTao()));
            return ResponseEntity.ok(hoaDons);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}

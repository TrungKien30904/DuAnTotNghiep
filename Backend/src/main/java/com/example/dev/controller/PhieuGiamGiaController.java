
package com.example.dev.controller;

import com.example.dev.entity.KhachHang;
import com.example.dev.entity.PhieuGiamGia;
import com.example.dev.service.PhieuGiamGiaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/phieu-giam-gia")
public class PhieuGiamGiaController {
    @Autowired
    PhieuGiamGiaService phieuGiamGiaService;
    // hiển thị pgg
    @GetMapping("/hien-thi")
    public ResponseEntity<Page<PhieuGiamGia>> hienThi(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(phieuGiamGiaService.hienThi(page,size));
    }
    // hiển thị khách hàng

    @GetMapping("/hien-thi-khach-hang")
    public ResponseEntity<Page<KhachHang>> hienThiKhachHang(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(phieuGiamGiaService.hienThiKhachHang(page, size));
    }


    // thêm pgg
    @PostMapping("/them")
    public ResponseEntity<?> themPhieuGiamGia(@Valid @RequestBody PhieuGiamGia phieuGiamGia) {
//        System.out.println("Dữ liệu nhận: " + phieuGiamGia);
//        System.out.println("Danh sách khách hàng: " + phieuGiamGia.getDanhSachKhachHang());
        return ResponseEntity.ok(phieuGiamGiaService.themPhieuGiamGia(phieuGiamGia));
    }

    // xuat excel
    @GetMapping("/xuat-excel")
    public ResponseEntity<InputStreamResource> exportPhieuGiamGiaToExcel() {
        ByteArrayInputStream in = phieuGiamGiaService.exportPhieuGiamGiaToExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=phieu_giam_gia.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(new InputStreamResource(in));
    }

    // chuyển đổi trạng thái
    @PatchMapping("/chuyen-doi-trang-thai/{id}")
    public ResponseEntity<?> chuyenDoiTrangThai(@PathVariable int id) {
        try {
            PhieuGiamGia updatedPhieu = phieuGiamGiaService.chuyenDoiTrangThai(id);
            return ResponseEntity.ok(updatedPhieu);
        } catch (ResponseStatusException e) {
            System.err.println("Lỗi chuyển đổi trạng thái phiếu giảm giá: " + e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            System.err.println("Lỗi hệ thống khi chuyển đổi trạng thái phiếu giảm giá: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    // sửa
    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaPhieuGiamGia(@PathVariable int id, @Valid @RequestBody PhieuGiamGia phieuGiamGia) {
        try {
            PhieuGiamGia updatedPhieu = phieuGiamGiaService.updatePhieuGiamGia(id, phieuGiamGia);
            return ResponseEntity.ok(updatedPhieu);
        } catch (ResponseStatusException e) {
            System.err.println("Lỗi cập nhật phiếu giảm giá: " + e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            System.err.println("Lỗi hệ thống khi cập nhật phiếu giảm giá: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    // tìm kiếm
    @GetMapping("/tim-kiem")
    public ResponseEntity<Page<PhieuGiamGia>> timKiem(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS") LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS") LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(phieuGiamGiaService.timKiem(keyword, trangThai, startDate, endDate, page, size));
    }

    // tìm kiếm khách hàng
    @GetMapping("/tim-kiem-khach-hang")
    public ResponseEntity<Page<KhachHang>> timKiemKhachHang(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(phieuGiamGiaService.timKiemKhachHang(keyword, page, size));
    }

    // Chi tiết phiếu
    @GetMapping("/{id}")
    public ResponseEntity<PhieuGiamGia> layChiTietPhieuGiamGia(@PathVariable int id) {
        try {
            PhieuGiamGia phieuGiamGia = phieuGiamGiaService.timPhieuGiamTheoID(id);
            return ResponseEntity.ok(phieuGiamGia);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        fieldError -> fieldError.getField(),
                        fieldError -> fieldError.getDefaultMessage(),
                        (existing, replacement) -> existing // Giữ lại lỗi đầu tiên nếu có trùng field
                ));
        return ResponseEntity.badRequest().body(errors);
    }
}

package com.example.dev.controller;

import com.example.dev.entity.nhanvien.NhanVien;
import com.example.dev.service.nhanvien.EmailNhanVienService;
import com.example.dev.service.nhanvien.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/nhan-vien")
@PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
public class NhanVienController {
    @Autowired
    NhanVienService nhanVienService;

    @Autowired
    private EmailNhanVienService emailService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> getAllEmployees(){
        return ResponseEntity.ok(nhanVienService.getNv());
    }

    @PostMapping("/them")
    public ResponseEntity<?> themSp(@RequestBody NhanVien nhanVien){
        Map<String, String> errors = new HashMap<>();

        if (nhanVienService.existsBySoDienThoai(nhanVien.getSoDienThoai())) {
            errors.put("soDienThoai", "Số điện thoại đã tồn tại!");
        }
        if (nhanVienService.existsByEmail(nhanVien.getEmail())) {
            errors.put("email", "Email đã tồn tại!");
        }
        if (nhanVienService.existsByCccd(nhanVien.getCccd())) {
            errors.put("cccd", "CCCD đã tồn tại!");
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        emailService.sendAccount(nhanVien);
        return ResponseEntity.ok(nhanVienService.themNv(nhanVien));
    }


    @PutMapping("/sua/{id}")
    public ResponseEntity<?> suaSp(@RequestBody NhanVien nhanVien, @PathVariable Integer id) {
        Map<String, String> errors = new HashMap<>();

        // Lấy thông tin nhân viên hiện tại
        NhanVien existingNhanVien = nhanVienService.findById(id);
        if (existingNhanVien == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nhân viên không tồn tại!");
        }

        // Kiểm tra trùng lặp chỉ khi giá trị thay đổi
        if (!nhanVien.getSoDienThoai().equals(existingNhanVien.getSoDienThoai()) &&
                nhanVienService.existsBySoDienThoai(nhanVien.getSoDienThoai())) {
            errors.put("soDienThoai", "Số điện thoại đã tồn tại!");
        }

        if (!nhanVien.getEmail().equals(existingNhanVien.getEmail()) &&
                nhanVienService.existsByEmail(nhanVien.getEmail())) {
            errors.put("email", "Email đã tồn tại!");
        }

        if (!nhanVien.getCccd().equals(existingNhanVien.getCccd()) &&
                nhanVienService.existsByCccd(nhanVien.getCccd())) {
            errors.put("cccd", "CCCD đã tồn tại!");
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        // Cập nhật nhân viên
        emailService.sendAccount(nhanVien);
        return ResponseEntity.ok(nhanVienService.suaNhanVien(nhanVien, id));
    }



    @GetMapping("/detail/{id}")
    public ResponseEntity<?> hienThi(@PathVariable Integer id){
        return ResponseEntity.ok(nhanVienService.detail(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<NhanVien>> searchEmployees(
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) String soDienThoai,
            @RequestParam(required = false) Boolean trangThai,
            @RequestParam(required = false) LocalDate ngaySinh,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<NhanVien> employees = nhanVienService.searchEmployees(ten, soDienThoai, trangThai, ngaySinh, pageable);
        return ResponseEntity.ok(employees);
    }


}

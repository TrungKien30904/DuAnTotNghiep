package com.example.dev.controller.attribute;

import com.example.dev.entity.attribute.SanPham;
import com.example.dev.service.attribute.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/san-pham")
public class SanPhamController {
    @Autowired
    SanPhamService sanPhamService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi() {
        return ResponseEntity.ok(sanPhamService.getSpDTO());
    }

    @GetMapping("/hien-thi/true")
    public ResponseEntity<?> hienThiDangBan() {
        return ResponseEntity.ok(sanPhamService.getSanPhamBan());
    }

    @PostMapping("/them")
    public ResponseEntity<?> themSp(@RequestBody SanPham sanPham) {
        return ResponseEntity.ok(sanPhamService.themSanPham(sanPham));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaSp(@RequestBody SanPham sanPham, @PathVariable Integer id) {
        return ResponseEntity.ok(sanPhamService.suaSanPham(sanPham, id));
    }
}

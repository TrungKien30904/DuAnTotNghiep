package com.example.dev.controller.attribute;

import com.example.dev.entity.attribute.ThuongHieu;
import com.example.dev.service.attribute.ThuongHieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/thuong-hieu")
public class ThuongHieuController {
    @Autowired
    ThuongHieuService thuongHieuService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi() {
        return ResponseEntity.ok(thuongHieuService.getTh());
    }

    @GetMapping("/hien-thi/true")
    public ResponseEntity<?> hienThiDangBan() {
        return ResponseEntity.ok(thuongHieuService.getThuongHieuBan());
    }

    @PostMapping("/them")
    public ResponseEntity<?> themThuongHieu(@RequestBody ThuongHieu thuongHieu) {
        return ResponseEntity.ok(thuongHieuService.themThuongHieu(thuongHieu));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaThuongHieu(@RequestBody ThuongHieu thuongHieu, @PathVariable Integer id) {
        return ResponseEntity.ok(thuongHieuService.suaThuongHieu(thuongHieu, id));
    }
}

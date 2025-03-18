package com.example.dev.controller.attribute;

import com.example.dev.entity.attribute.NhaCungCap;
import com.example.dev.service.attribute.NhaCungCapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/nha-cung-cap")
@PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
public class NhaCungCapController {
    @Autowired
    NhaCungCapService nhaCungCapService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi() {
        return ResponseEntity.ok(nhaCungCapService.getNcc());
    }

    @GetMapping("/hien-thi/true")
    public ResponseEntity<?> hienThiDangBan() {
        return ResponseEntity.ok(nhaCungCapService.getNhaCungCapBan());
    }

    @PostMapping("/them")
    public ResponseEntity<?> themNhaCungCap(@RequestBody NhaCungCap ncc) {
        return ResponseEntity.ok(nhaCungCapService.themNhaCungCap(ncc));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaNhaCungCap(@RequestBody NhaCungCap ncc, @PathVariable Integer id) {
        return ResponseEntity.ok(nhaCungCapService.suaNhaCungCap(ncc, id));
    }
}

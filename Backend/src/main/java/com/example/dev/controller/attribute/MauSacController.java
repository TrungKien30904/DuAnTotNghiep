package com.example.dev.controller.attribute;

import com.example.dev.entity.attribute.MauSac;
import com.example.dev.service.attribute.MauSacService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/mau-sac")
public class MauSacController {
    @Autowired
    MauSacService mauSacService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi() {
        return ResponseEntity.ok(mauSacService.getMs());
    }

    @GetMapping("/hien-thi/true")
    public ResponseEntity<?> hienThiDangBan() {
        return ResponseEntity.ok(mauSacService.getMauSacBan());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/them")
    public ResponseEntity<?> themMauSac(@RequestBody MauSac ms) {
        return ResponseEntity.ok(mauSacService.themMauSac(ms));
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaMauSac(@RequestBody MauSac ms, @PathVariable Integer id) {
        return ResponseEntity.ok(mauSacService.suaMauSac(ms, id));
    }
}

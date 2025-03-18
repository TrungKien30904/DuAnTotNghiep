package com.example.dev.controller.attribute;

import com.example.dev.entity.attribute.KichCo;
import com.example.dev.service.attribute.KichCoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/kich-co")
public class KichCoController {
    @Autowired
    KichCoService kichCoService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi() {
        return ResponseEntity.ok(kichCoService.getKc());
    }

    @GetMapping("/hien-thi/true")
    public ResponseEntity<?> hienThiDangBan() {
        return ResponseEntity.ok(kichCoService.getKichCoBan());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/them")
    public ResponseEntity<?> themKichCo(@RequestBody KichCo kc) {
        return ResponseEntity.ok(kichCoService.themKichCo(kc));
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaKichCo(@RequestBody KichCo kc, @PathVariable Integer id) {
        return ResponseEntity.ok(kichCoService.suaKichCo(kc, id));
    }
}

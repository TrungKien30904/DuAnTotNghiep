package com.example.dev.controller.attribute;

import com.example.dev.entity.attribute.DeGiay;
import com.example.dev.service.attribute.DeGiayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/de-giay")
public class DeGiayController {
    @Autowired
    DeGiayService deGiayService;

//    @GetMapping("/hien-thi")
//    public ResponseEntity<?> hienThi() {
//        return ResponseEntity.ok(deGiayService.getDeGiay());
//    }

//    @GetMapping("/hien-thi/true")
//    public ResponseEntity<?> hienThiDangBan() {
//        return ResponseEntity.ok(deGiayService.getDeGiayBan());
//    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/them")
    public ResponseEntity<?> themDeGiay(@RequestBody DeGiay dg) {
        return ResponseEntity.ok(deGiayService.themDeGiay(dg));
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaDeGiay(@RequestBody DeGiay dg, @PathVariable Integer id) {
        return ResponseEntity.ok(deGiayService.suaDeGiay(dg, id));
    }
}

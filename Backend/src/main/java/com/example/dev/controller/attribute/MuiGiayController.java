package com.example.dev.controller.attribute;

import com.example.dev.entity.attribute.MuiGiay;
import com.example.dev.service.attribute.MuiGiayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/mui-giay")
@PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
public class MuiGiayController {
    @Autowired
    MuiGiayService muiGiayService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi() {
        return ResponseEntity.ok(muiGiayService.getMg());
    }

    @GetMapping("/hien-thi/true")
    public ResponseEntity<?> hienThiDangBan() {
        return ResponseEntity.ok(muiGiayService.getMuiGiayBan());
    }

    @PostMapping("/them")
    public ResponseEntity<?> themMuiGiay(@RequestBody MuiGiay mg) {
        return ResponseEntity.ok(muiGiayService.themMuiGiay(mg));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaMuiGiay(@RequestBody MuiGiay mg, @PathVariable Integer id) {
        return ResponseEntity.ok(muiGiayService.suaMuiGiay(mg, id));
    }
}

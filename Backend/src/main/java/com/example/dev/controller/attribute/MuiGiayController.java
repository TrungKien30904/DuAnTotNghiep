package com.example.dev.controller.attribute;

import com.example.dev.entity.attribute.MuiGiay;
import com.example.dev.service.attribute.MuiGiayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/mui-giay")
public class MuiGiayController {
    @Autowired
    MuiGiayService muiGiayService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi() {
        return ResponseEntity.ok(muiGiayService.getMg());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @GetMapping("/hien-thi/true")
    public ResponseEntity<?> hienThiDangBan() {
        return ResponseEntity.ok(muiGiayService.getMuiGiayBan());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/them")
    public ResponseEntity<?> themMuiGiay(@RequestBody MuiGiay mg) {
        return ResponseEntity.ok(muiGiayService.themMuiGiay(mg));
    }
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/sua")
    public ResponseEntity<?> suaMuiGiay(@RequestBody MuiGiay mg) {
        try {
            muiGiayService.suaMuiGiay(mg);
            return ResponseEntity.ok("ok");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

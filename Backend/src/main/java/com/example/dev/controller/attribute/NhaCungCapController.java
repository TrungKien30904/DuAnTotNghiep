package com.example.dev.controller.attribute;

import com.example.dev.entity.attribute.NhaCungCap;
import com.example.dev.service.attribute.NhaCungCapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/nha-cung-cap")
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

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/them")
    public ResponseEntity<?> themNhaCungCap(@RequestBody NhaCungCap ncc) {
        return ResponseEntity.ok(nhaCungCapService.themNhaCungCap(ncc));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/sua")
    public ResponseEntity<?> suaNhaCungCap(@RequestBody NhaCungCap ncc) {
        try {
            nhaCungCapService.suaNhaCungCap(ncc);
            return ResponseEntity.ok("ok");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

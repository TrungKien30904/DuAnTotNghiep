package com.example.dev.controller.attribute;

import com.example.dev.entity.attribute.CoGiay;
import com.example.dev.service.attribute.CoGiayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/co-giay")
public class CoGiayController{
    @Autowired
    CoGiayService coGiayService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi(){
        return ResponseEntity.ok(coGiayService.getCoGiay());
    }

    @GetMapping("/hien-thi/true")
    public ResponseEntity<?> hienThiDangBan(){
        return ResponseEntity.ok(coGiayService.getCoGiayBan());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/them")
    public ResponseEntity<?> themCoGiay(@RequestBody CoGiay cg){
        return ResponseEntity.ok(coGiayService.themCoGiay(cg));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/sua")
    public ResponseEntity<?> suaCoGiay(@RequestBody CoGiay cg){
        try {
            coGiayService.suaCoGiay(cg);
            return ResponseEntity.ok("ok");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

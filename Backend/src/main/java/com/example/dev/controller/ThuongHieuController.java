package com.example.dev.controller;

import com.example.dev.entity.ThuongHieu;
import com.example.dev.service.ThuongHieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/thuong-hieu")
public class ThuongHieuController {
    @Autowired
    ThuongHieuService thuongHieuService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi(){
        return ResponseEntity.ok(thuongHieuService.getTh());
    }

    @PostMapping("/them")
    public ResponseEntity<?> themThuongHieu(@RequestBody ThuongHieu thuongHieu){
        return ResponseEntity.ok(thuongHieuService.themThuongHieu(thuongHieu));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaThuongHieu(@RequestBody ThuongHieu thuongHieu,@PathVariable Integer id){
        return ResponseEntity.ok(thuongHieuService.suaThuongHieu(thuongHieu,id));
    }
}

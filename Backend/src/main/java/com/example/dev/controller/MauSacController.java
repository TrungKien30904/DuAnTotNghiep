package com.example.dev.controller;

import com.example.dev.entity.MauSac;
import com.example.dev.service.MauSacService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/mau-sac")
public class MauSacController {
    @Autowired
    MauSacService mauSacService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi(){
        return ResponseEntity.ok(mauSacService.getMs());
    }

    @PostMapping("/them")
    public ResponseEntity<?> themMauSac(@RequestBody MauSac ms){
        return ResponseEntity.ok(mauSacService.themMauSac(ms));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaMauSac(@RequestBody MauSac ms,@PathVariable Integer id){
        return ResponseEntity.ok(mauSacService.suaMauSac(ms,id));
    }
}

package com.example.dev.controller;

import com.example.dev.entity.attribute.CoGiay;
import com.example.dev.service.CoGiayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/them")
    public ResponseEntity<?> themCoGiay(@RequestBody CoGiay cg){
        return ResponseEntity.ok(coGiayService.themCoGiay(cg));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaCoGiay(@RequestBody CoGiay cg,@PathVariable Integer id){
        return ResponseEntity.ok(coGiayService.suaCoGiay(cg,id));
    }
}

package com.example.dev.controller;

import com.example.dev.entity.DeGiay;
import com.example.dev.service.DeGiayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/de-giay")
public class DeGiayController {
    @Autowired
    DeGiayService deGiayService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi(){
        return ResponseEntity.ok(deGiayService.getDeGiay());
    }

    @PostMapping("/them")
    public ResponseEntity<?> themDeGiay(@RequestBody DeGiay dg){
        return ResponseEntity.ok(deGiayService.themDeGiay(dg));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaDeGiay(@RequestBody DeGiay dg,@PathVariable Integer id){
        return ResponseEntity.ok(deGiayService.suaDeGiay(dg,id));
    }
}

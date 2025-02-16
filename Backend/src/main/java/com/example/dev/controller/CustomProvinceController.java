package com.example.dev.controller;

import com.example.dev.entity.CoGiay;
import com.example.dev.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/custom-address")
public class CustomProvinceController {
    @Autowired
    ProviceService proviceService;
    @Autowired
    DistrictService districtService;
    @Autowired
    WardService wardService;

    @GetMapping("/get-province")
    public ResponseEntity<?> getProvince() {
        return ResponseEntity.ok(proviceService.findAll());
    }

    @GetMapping("/get-district")
    public ResponseEntity<?> getDistrict(@RequestParam Integer provinceId) {
        return ResponseEntity.ok(districtService.getDistrict(provinceId));
    }

    @GetMapping("/get-ward")
    public ResponseEntity<?> getWard(@RequestParam Integer districtId) {
        return ResponseEntity.ok(wardService.getWards(districtId));
    }

    @GetMapping("/get-district-all")
    public ResponseEntity<?> getDistrict() {
        return ResponseEntity.ok(districtService.getAll());
    }

    @GetMapping("/get-ward-all")
    public ResponseEntity<?> getWard() {
        return ResponseEntity.ok(wardService.getAll());
    }

}

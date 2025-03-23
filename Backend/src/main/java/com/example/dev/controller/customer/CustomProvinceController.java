package com.example.dev.controller.customer;


import com.example.dev.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/custom-address")
public class CustomProvinceController {

    private final IProvinceService provinceService;

    @Autowired
    public CustomProvinceController(IProvinceService provinceService){

        this.provinceService = provinceService;
    }
    @GetMapping("/get-province")
    public ResponseEntity<?> getProvince() {
        return ResponseEntity.ok(this.provinceService.getProvinceModel());
    }
    @GetMapping("/get-district")
    public ResponseEntity<?> getDistrict(@RequestParam Integer provinceId) {
        return ResponseEntity.ok(this.provinceService.getDistrictModel(provinceId));
    }
    @GetMapping("/get-ward")
    public ResponseEntity<?> getWard(@RequestParam Integer districtId) {
        return ResponseEntity.ok(this.provinceService.getWardModel(districtId));
    }
}

package com.example.dev.controller.customer;

import com.example.dev.entity.customer.DiaChi;
import com.example.dev.service.customer.DiaChiService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

@RestController
@RequestMapping("/admin/dia-chi")
@RequiredArgsConstructor
public class DiaChiController {
    private final DiaChiService diaChiService;

    @GetMapping("/get-province")
    public ResponseEntity<?> getProvince(@RequestParam(defaultValue = "-1") Integer provinceID) {
        return ResponseEntity.ok(diaChiService.getProvince(provinceID));
    }

    @GetMapping("/get-districts")
    public ResponseEntity<?> getDistricts(@RequestParam Integer provinceID, @RequestParam(defaultValue = "-1") Integer districtID) {
        return ResponseEntity.ok(diaChiService.getDistricts(provinceID,districtID));
    }

    @GetMapping("/get-wards")
    public ResponseEntity<?> getWards(@RequestParam Integer districtID, @RequestParam(defaultValue = "") String wardCode) {
        return ResponseEntity.ok(diaChiService.getWards(districtID,wardCode));
    }

    @GetMapping("/shipping-fee")
    public ResponseEntity<?> getShippingFee(@RequestParam int districtID,@RequestParam String wardCode,@RequestParam Integer idHoaDon) {
        return ResponseEntity.ok(diaChiService.shippingFee(districtID,wardCode,idHoaDon));
    }

    @GetMapping("/get-address/{idKhachHang}")
    public ResponseEntity<?> getAddress(@PathVariable int idKhachHang) {
        return ResponseEntity.ok(diaChiService.getAddressCustomer(idKhachHang));
    }

    @PostMapping("/update-address/{id}/{idHoaDon}")
    public ResponseEntity<?> updateAddress(@PathVariable Integer id, @RequestBody DiaChi diaChi,@PathVariable Integer idHoaDon) {
        try {
            diaChiService.updateCustomerAddress(diaChi,id,idHoaDon);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/add/{idHoaDon}")
    public ResponseEntity<?> add(@RequestBody DiaChi diaChi, @PathVariable Integer idHoaDon, Authentication auth) {
        try {
            diaChiService.addNewAddress(diaChi,idHoaDon,auth);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

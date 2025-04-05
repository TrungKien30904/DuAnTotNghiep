package com.example.dev.controller.invoice;

import com.example.dev.entity.invoice.HoaDonChiTiet;
import com.example.dev.service.invoice.HoaDonChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/hdct")
@PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
public class HoaDonChiTietController {

    @Autowired
    private HoaDonChiTietService hoaDonChiTietService;

    //123
    @GetMapping("/listHoaDonChiTiet")
    public List<HoaDonChiTiet> findByIdHoaDon(@RequestParam("maHoaDon") String maHoaDon) {
        return hoaDonChiTietService.findByMaHoaDon(maHoaDon);
    }

    @GetMapping("/delete/{id}")
    public ResponseEntity<?> softDelete(@PathVariable Integer id){
        hoaDonChiTietService.softDelete(id);
        return ResponseEntity.ok("delete");
    }

    @GetMapping("/get-cart/{idHoaDon}")
    public ResponseEntity<?> getCart(@PathVariable Integer idHoaDon){
        return ResponseEntity.ok(hoaDonChiTietService.getCartByIdInvoice(idHoaDon));
    }
}

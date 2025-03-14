package com.example.dev.controller.attributes;

import com.example.dev.entity.attribute.CoGiay;
import com.example.dev.entity.attribute.DeGiay;
import com.example.dev.service.attribute.CoGiayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/co-giay")
public class CoGiayController{
    @Autowired
    CoGiayService coGiayService;

    @GetMapping("/hien-thi/true")
    public ResponseEntity<?> hienThiDangBan(){
        return ResponseEntity.ok(coGiayService.getCoGiayBan());
    }

    @GetMapping("/hien-thi")
    public ResponseEntity<?> getCoGiays(
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) Boolean trangThai) {
        return ResponseEntity.ok(coGiayService.getCoGiays(ten, trangThai));
    }

    @PostMapping("/them")
    public ResponseEntity<?> themCoGiay(@RequestBody CoGiay cg) {
        Map<String, String> errors = new HashMap<>();
        if (coGiayService.existsByName(cg.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }
        return ResponseEntity.ok(coGiayService.themCoGiay(cg));

    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaCoGiay(@RequestBody CoGiay cg,@PathVariable Integer id){
        Map<String, String> errors = new HashMap<>();
        CoGiay existingCoGiay = coGiayService.findById(id);
        if ( !existingCoGiay.getTen().equals(cg.getTen()) && coGiayService.existsByName(cg.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }
        return ResponseEntity.ok(coGiayService.suaCoGiay(cg,id));
    }
}

package com.example.dev.controller.attributes;

import com.example.dev.entity.attribute.DeGiay;
import com.example.dev.service.attribute.DeGiayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/de-giay")
public class DeGiayController {
    @Autowired
    DeGiayService deGiayService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> getDeGiays(
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) Boolean trangThai) {
        return ResponseEntity.ok(deGiayService.getDeGiays(ten, trangThai));
    }

    @PostMapping("/them")
    public ResponseEntity<?> themDeGiay(@RequestBody DeGiay deGiay) {
        Map<String, String> errors = new HashMap<>();
        if (deGiayService.existsByName(deGiay.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }
        return ResponseEntity.ok(deGiayService.themDeGiay(deGiay));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaDeGiay(@RequestBody DeGiay deGiay, @PathVariable Integer id) {
        Map<String, String> errors = new HashMap<>();

        // Lấy Đế Giày hiện tại từ cơ sở dữ liệu
        DeGiay existingDeGiay = deGiayService.findById(id);

        // Kiểm tra xem tên mới có trùng với tên hiện tại không
        if (!existingDeGiay.getTen().equals(deGiay.getTen()) && deGiayService.existsByName(deGiay.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }

        // Cập nhật Đế Giày
        return ResponseEntity.ok(deGiayService.suaDeGiay(deGiay, id));
    }
}

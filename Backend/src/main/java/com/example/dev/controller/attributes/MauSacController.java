package com.example.dev.controller.attributes;

import com.example.dev.entity.attribute.MauSac;
import com.example.dev.service.attribute.MauSacService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/mau-sac")
public class MauSacController {
    @Autowired
    private MauSacService mauSacService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> getMauSacs(
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) Boolean trangThai) {
        return ResponseEntity.ok(mauSacService.getMauSacs(ten, trangThai));
    }

    @PostMapping("/them")
    public ResponseEntity<?> themMauSac(@RequestBody MauSac mauSac) {
        Map<String, String> errors = new HashMap<>();
        if (mauSacService.existsByName(mauSac.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }
        return ResponseEntity.ok(mauSacService.themMauSac(mauSac));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaMauSac(@RequestBody MauSac mauSac, @PathVariable Integer id) {
        Map<String, String> errors = new HashMap<>();

        // Lấy Màu Sắc hiện tại từ cơ sở dữ liệu
        MauSac existingMauSac = mauSacService.findById(id);

        // Kiểm tra xem tên mới có trùng với tên hiện tại không
        if (!existingMauSac.getTen().equals(mauSac.getTen()) && mauSacService.existsByName(mauSac.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }

        // Cập nhật Màu Sắc
        return ResponseEntity.ok(mauSacService.suaMauSac(mauSac, id));
    }
}

package com.example.dev.controller.attributes;

import com.example.dev.entity.attribute.KichCo;
import com.example.dev.service.attribute.KichCoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/kich-co")
public class KichCoController {
    @Autowired
    private KichCoService kichCoService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> getKichCos(
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) Boolean trangThai) {
        return ResponseEntity.ok(kichCoService.getKichCos(ten, trangThai));
    }

    @PostMapping("/them")
    public ResponseEntity<?> themKichCo(@RequestBody KichCo kichCo) {
        Map<String, String> errors = new HashMap<>();
        if (kichCoService.existsByName(kichCo.getTen())) {
            errors.put("ten", "Kích cỡ đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }
        return ResponseEntity.ok(kichCoService.themKichCo(kichCo));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaKichCo(@RequestBody KichCo kichCo, @PathVariable Integer id) {
        Map<String, String> errors = new HashMap<>();

        // Lấy Kích Cỡ hiện tại từ cơ sở dữ liệu
        KichCo existingKichCo = kichCoService.findById(id);

        // Kiểm tra xem tên mới có trùng với tên hiện tại không
        if (!existingKichCo.getTen().equals(kichCo.getTen()) && kichCoService.existsByName(kichCo.getTen())) {
            errors.put("ten", "Kích cỡ đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }

        // Cập nhật Kích Cỡ
        return ResponseEntity.ok(kichCoService.suaKichCo(kichCo, id));
    }
}

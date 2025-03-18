package com.example.dev.controller.attributes;

import com.example.dev.entity.attribute.NhaCungCap;
import com.example.dev.service.attribute.NhaCungCapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/nha-cung-cap")
public class NhaCungCapController {
    @Autowired
    private NhaCungCapService nhaCungCapService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> getNhaCungCaps(
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) Boolean trangThai) {
        return ResponseEntity.ok(nhaCungCapService.getNhaCungCaps(ten, trangThai));
    }

    @PostMapping("/them")
    public ResponseEntity<?> themNhaCungCap(@RequestBody NhaCungCap nhaCungCap) {
        Map<String, String> errors = new HashMap<>();
        if (nhaCungCapService.existsByName(nhaCungCap.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }
        return ResponseEntity.ok(nhaCungCapService.themNhaCungCap(nhaCungCap));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaNhaCungCap(@RequestBody NhaCungCap nhaCungCap, @PathVariable Integer id) {
        Map<String, String> errors = new HashMap<>();

        // Lấy Nhà Cung Cấp hiện tại từ cơ sở dữ liệu
        NhaCungCap existingNhaCungCap = nhaCungCapService.findById(id);

        // Kiểm tra xem tên mới có trùng với tên hiện tại không
        if (!existingNhaCungCap.getTen().equals(nhaCungCap.getTen()) && nhaCungCapService.existsByName(nhaCungCap.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }

        // Cập nhật Nhà Cung Cấp
        return ResponseEntity.ok(nhaCungCapService.suaNhaCungCap(nhaCungCap, id));
    }
}

package com.example.dev.controller.attributes;

import com.example.dev.entity.attribute.ThuongHieu;
import com.example.dev.service.attribute.ThuongHieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/thuong-hieu")
public class ThuongHieuController {
    @Autowired
    private ThuongHieuService thuongHieuService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> getThuongHieus(
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) Boolean trangThai) {
        return ResponseEntity.ok(thuongHieuService.getThuongHieus(ten, trangThai));
    }

    @PostMapping("/them")
    public ResponseEntity<?> themThuongHieu(@RequestBody ThuongHieu thuongHieu) {
        Map<String, String> errors = new HashMap<>();
        if (thuongHieuService.existsByName(thuongHieu.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }
        return ResponseEntity.ok(thuongHieuService.themThuongHieu(thuongHieu));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaThuongHieu(@RequestBody ThuongHieu thuongHieu, @PathVariable Integer id) {
        Map<String, String> errors = new HashMap<>();

        // Lấy Thương Hiệu hiện tại từ cơ sở dữ liệu
        ThuongHieu existingThuongHieu = thuongHieuService.findById(id);

        // Kiểm tra xem tên mới có trùng với tên hiện tại không
        if (!existingThuongHieu.getTen().equals(thuongHieu.getTen()) && thuongHieuService.existsByName(thuongHieu.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }

        // Cập nhật Thương Hiệu
        return ResponseEntity.ok(thuongHieuService.suaThuongHieu(thuongHieu, id));
    }
}

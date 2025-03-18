package com.example.dev.controller;


import com.example.dev.entity.attribute.DanhMucSanPham;
import com.example.dev.service.attribute.DanhMucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/danh-muc")
public class DanhMucSanPhamController {
    @Autowired
    private DanhMucService danhMucService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> getDanhMucs(
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) Boolean trangThai) {
        return ResponseEntity.ok(danhMucService.getDanhMucs(ten, trangThai));
    }

    @PostMapping("/them")
    public ResponseEntity<?> themDanhMuc(@RequestBody DanhMucSanPham danhMuc) {
        Map<String, String> errors = new HashMap<>();
        if (danhMucService.existsByName(danhMuc.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }
        return ResponseEntity.ok(danhMucService.themDanhMuc(danhMuc));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaDanhMuc(@RequestBody DanhMucSanPham danhMuc, @PathVariable Integer id) {
        Map<String, String> errors = new HashMap<>();

        // Lấy Danh Mục hiện tại từ cơ sở dữ liệu
        DanhMucSanPham existingDanhMuc = danhMucService.findById(id);

        // Kiểm tra xem tên mới có trùng với tên hiện tại không
        if (!existingDanhMuc.getTen().equals(danhMuc.getTen()) && danhMucService.existsByName(danhMuc.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }

        // Cập nhật Danh Mục
        return ResponseEntity.ok(danhMucService.suaDanhMuc(danhMuc, id));
    }
}

package com.example.dev.controller.attributes;

import com.example.dev.entity.attribute.MuiGiay;
import com.example.dev.service.attribute.MuiGiayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/mui-giay")
public class MuiGiayController {
    @Autowired
    private MuiGiayService muiGiayService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> getMuiGiays(
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) Boolean trangThai) {
        return ResponseEntity.ok(muiGiayService.getMuiGiays(ten, trangThai));
    }

    @PostMapping("/them")
    public ResponseEntity<?> themMuiGiay(@RequestBody MuiGiay muiGiay) {
        Map<String, String> errors = new HashMap<>();
        if (muiGiayService.existsByName(muiGiay.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }
        return ResponseEntity.ok(muiGiayService.themMuiGiay(muiGiay));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaMuiGiay(@RequestBody MuiGiay muiGiay, @PathVariable Integer id) {
        Map<String, String> errors = new HashMap<>();

        // Lấy Mũi Giày hiện tại từ cơ sở dữ liệu
        MuiGiay existingMuiGiay = muiGiayService.findById(id);

        // Kiểm tra xem tên mới có trùng với tên hiện tại không
        if (!existingMuiGiay.getTen().equals(muiGiay.getTen()) && muiGiayService.existsByName(muiGiay.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }

        // Cập nhật Mũi Giày
        return ResponseEntity.ok(muiGiayService.suaMuiGiay(muiGiay, id));
    }
}

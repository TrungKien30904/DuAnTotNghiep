package com.example.dev.controller.attribute;

import com.example.dev.DTO.request.SearchRequest.SearchRequest;
import com.example.dev.constant.BaseConstant;
import com.example.dev.entity.attribute.ThuongHieu;
import com.example.dev.service.attribute.ThuongHieuService;
import com.example.dev.util.baseModel.BaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/thuong-hieu")
public class ThuongHieuController {
    @Autowired
    ThuongHieuService thuongHieuService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi() {
        return ResponseEntity.ok(thuongHieuService.getTh());
    }

    @GetMapping("/hien-thi/true")
    public ResponseEntity<?> hienThiDangBan() {
        return ResponseEntity.ok(thuongHieuService.getThuongHieuBan());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/them")
    public ResponseEntity<?> themThuongHieu(@RequestBody ThuongHieu thuongHieu) {
        return ResponseEntity.ok(thuongHieuService.themThuongHieu(thuongHieu));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/sua")
    public ResponseEntity<?> suaThuongHieu(@RequestBody ThuongHieu thuongHieu) {
        try {
            thuongHieuService.suaThuongHieu(thuongHieu);
            return ResponseEntity.ok("ok");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

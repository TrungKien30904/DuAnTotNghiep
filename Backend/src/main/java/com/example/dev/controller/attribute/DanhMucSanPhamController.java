package com.example.dev.controller.attribute;


import com.example.dev.entity.attribute.DanhMucSanPham;
import com.example.dev.service.attribute.DanhMucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/danh-muc")
public class DanhMucSanPhamController {
    @Autowired
    DanhMucService danhMucService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi(){
        return ResponseEntity.ok(danhMucService.getDanhMucSanPham());
    }

    @GetMapping("/hien-thi/true")
    public ResponseEntity<?> hienThiDangBan(){
        return ResponseEntity.ok(danhMucService.getDanhMucSanPhamBan());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/them")
    public ResponseEntity<?> themDanhMucSanPham(@RequestBody DanhMucSanPham dmsp){
        return ResponseEntity.ok(danhMucService.themDanhMucSanPham(dmsp));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/sua")
    public ResponseEntity<?> suaDanhMucSanPham(@RequestBody DanhMucSanPham dmsp){
        try {
            danhMucService.suaDanhMucSanPham(dmsp);
            return ResponseEntity.ok("ok");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

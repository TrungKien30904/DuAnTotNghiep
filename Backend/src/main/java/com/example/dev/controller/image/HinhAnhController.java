package com.example.dev.controller.image;

import com.example.dev.service.image.HinhAnhService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hinh-anh")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
public class HinhAnhController {
    private final HinhAnhService hinhAnhService;

    @GetMapping("/hien-thi/{idSanPham}")
    public ResponseEntity<?> hienThi(@PathVariable Integer idSanPham) {
        return ResponseEntity.ok(hinhAnhService.getAllImageByProduct(idSanPham));
    }
}

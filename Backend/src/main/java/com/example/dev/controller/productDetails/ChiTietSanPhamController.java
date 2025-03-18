package com.example.dev.controller.productDetails;

import com.example.dev.DTO.response.ChiTietSanPham.ChiTietSanPhamResponse;
import com.example.dev.DTO.response.HoaDonChiTiet.SanPhamCartResponse;
import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.service.ChiTietSanPhamService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/chi-tiet-san-pham")
public class ChiTietSanPhamController {
    @Autowired
    ChiTietSanPhamService chiTietSanPhamService;

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi() {
        return ResponseEntity.ok(chiTietSanPhamService.getAllChiTietSanPham());
    }

    @GetMapping("/hien-thi/online/{idSanPham}")
    public ResponseEntity<?> hienThiOnline(@PathVariable Integer idSanPham) {
        return ResponseEntity.ok(chiTietSanPhamService.showProductOnline(idSanPham));
    }

    @GetMapping("/hien-thi/online/{idSanPham}/{idMauSac}")
    public ResponseEntity<?> hienThiSanPhamMauSac(@PathVariable Integer idSanPham, @PathVariable Integer idMauSac) {
        return ResponseEntity.ok(chiTietSanPhamService.getProductDetailsByColor(idSanPham, idMauSac));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @GetMapping("/hien-thi/{id}")
    public ResponseEntity<?> hienThi(@PathVariable Integer id) {
        return ResponseEntity.ok(chiTietSanPhamService.getListChiTietSanPham(id));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @GetMapping("/chi-tiet/{id}")
    public ResponseEntity<?> chiTiet(@PathVariable Integer id) {
        return ResponseEntity.ok(chiTietSanPhamService.getChiTietSanPham(id));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/them")
    public ResponseEntity<?> themCtsp(@Valid @RequestBody ChiTietSanPhamResponse ctsp) {
        return ResponseEntity.ok(chiTietSanPhamService.themChiTietSanPham(ctsp));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaCtsp(@Valid @RequestBody ChiTietSanPham cl, @PathVariable Integer id) {
        return ResponseEntity.ok(chiTietSanPhamService.suaChiTietSanPham(cl, id));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/phan-trang/{idSanPham}")
    public ResponseEntity<?> phanTrang(@RequestParam(value = "page", defaultValue = "0") int page, @RequestParam(value = "pageSize", defaultValue = "3") int pageSize, @PathVariable Integer idSanPham) {
        return ResponseEntity.ok(chiTietSanPhamService.getPage(idSanPham, page, pageSize));
    }

    //    @PostMapping("/tim-kiem")
//    public ResponseEntity<?> timKiem(@RequestParam(value = "page",defaultValue = "0") int page,@RequestParam(value = "pageSize",defaultValue = "3") int pageSize,@RequestParam(value = "search",defaultValue = "") String search){
//        return ResponseEntity.ok(chiTietSanPhamService.getPage(idSanPham,page,pageSize));
//    }
    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @GetMapping("/total-pages/{id}")
    public ResponseEntity<?> totalPages(@PathVariable Integer id) {
        return ResponseEntity.ok(chiTietSanPhamService.totalPage(id));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/doi-trang-thai/{idChiTietSanPham}/{idSanPham}/{trangThai}")
    public ResponseEntity<?> doiTrangThai(@PathVariable Integer idSanPham, @PathVariable int trangThai, @PathVariable Integer idChiTietSanPham) {
        return ResponseEntity.ok(chiTietSanPhamService.doiTrangThai(idSanPham, idChiTietSanPham, trangThai));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping(value = "/them-anh/{idSanPham}")
    public ResponseEntity<?> themAnh(@RequestPart final List<MultipartFile> file, @RequestParam("tenMau") List<String> tenMau, @PathVariable Integer idSanPham) {
        chiTietSanPhamService.uploadImage(file, tenMau, idSanPham);
        return ResponseEntity.ok("Upload successfully");
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/them-sp")
    public ResponseEntity<?> themSp(@RequestBody SanPhamCartResponse sanPhamCartResponse) {
        return ResponseEntity.ok(chiTietSanPhamService.themSp(sanPhamCartResponse.getIdHoaDon(), sanPhamCartResponse.getIdChiTietSanPham(), sanPhamCartResponse.getSoLuongMua(), sanPhamCartResponse.getGiaSauGiam()));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/sua-sp")
    public ResponseEntity<?> suaSp(@RequestBody SanPhamCartResponse sanPhamCartResponse) {
        chiTietSanPhamService.suaSoLuongHoaDonChiTiet(sanPhamCartResponse.getIdHoaDonChiTiet(), sanPhamCartResponse.getIdChiTietSanPham(), sanPhamCartResponse.getSoLuongMua(),sanPhamCartResponse.getGiaDuocTinh());
        return ResponseEntity.ok("ok");
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/xoa-sp")
    public ResponseEntity<?> xoaSp(@RequestBody SanPhamCartResponse sanPhamCartResponse) {
        return ResponseEntity.ok(chiTietSanPhamService.xoaSp(sanPhamCartResponse.getIdHoaDonChiTiet(), sanPhamCartResponse.getIdChiTietSanPham()));
    }

    @GetMapping("/dot-giam/hien-thi/{idChiTietSanPham}")
    public ResponseEntity<?> spGiam(@PathVariable Integer idChiTietSanPham) {
        return ResponseEntity.ok(chiTietSanPhamService.getSpGiamGia(idChiTietSanPham));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/cap-nhat-sl")
    public ResponseEntity<?> capNhat(@RequestBody SanPhamCartResponse sanPhamCartResponse) {
        chiTietSanPhamService.capNhatSl(sanPhamCartResponse.getIdHoaDonChiTiet(), sanPhamCartResponse.getIdChiTietSanPham(), sanPhamCartResponse.getSoLuongMua(),sanPhamCartResponse.getGiaDuocTinh());
        return ResponseEntity.ok("ok");
    }
}

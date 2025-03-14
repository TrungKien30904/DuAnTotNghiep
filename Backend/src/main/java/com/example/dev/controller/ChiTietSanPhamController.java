package com.example.dev.controller;

import com.example.dev.DTO.response.ChiTietSanPham.ChiTietSanPhamResponse;
import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.service.ChiTietSanPhamService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/chi-tiet-san-pham")
public class ChiTietSanPhamController {
    @Autowired
    ChiTietSanPhamService chiTietSanPhamService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi() {
        return ResponseEntity.ok(chiTietSanPhamService.getListChiTietSanPham());
    }

    @GetMapping("/hien-thi/{id}")
    public ResponseEntity<?> hienThi(@PathVariable Integer id) {
        return ResponseEntity.ok(chiTietSanPhamService.getListChiTietSanPham(id));
    }

    @GetMapping("/chi-tiet/{id}")
    public ResponseEntity<?> chiTiet(@PathVariable Integer id) {
        return ResponseEntity.ok(chiTietSanPhamService.getChiTietSanPham(id));
    }

    @PostMapping("/them")
    public ResponseEntity<?> themCtsp(@Valid @RequestBody ChiTietSanPhamResponse ctsp) {
        return ResponseEntity.ok(chiTietSanPhamService.themChiTietSanPham(ctsp));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaCtsp(@Valid @RequestBody ChiTietSanPham cl, @PathVariable Integer id) {
        return ResponseEntity.ok(chiTietSanPhamService.suaChiTietSanPham(cl, id));
    }

    @PostMapping("/phan-trang/{idSanPham}")
    public ResponseEntity<?> phanTrang(@RequestParam(value = "page", defaultValue = "0") int page, @RequestParam(value = "pageSize", defaultValue = "3") int pageSize, @PathVariable Integer idSanPham) {
        return ResponseEntity.ok(chiTietSanPhamService.getPage(idSanPham, page, pageSize));
    }

    //    @PostMapping("/tim-kiem")
//    public ResponseEntity<?> timKiem(@RequestParam(value = "page",defaultValue = "0") int page,@RequestParam(value = "pageSize",defaultValue = "3") int pageSize,@RequestParam(value = "search",defaultValue = "") String search){
//        return ResponseEntity.ok(chiTietSanPhamService.getPage(idSanPham,page,pageSize));
//    }
    @GetMapping("/total-pages/{id}")
    public ResponseEntity<?> totalPages(@PathVariable Integer id) {
        return ResponseEntity.ok(chiTietSanPhamService.totalPage(id));
    }

    @PostMapping("/doi-trang-thai/{idChiTietSanPham}/{idSanPham}/{trangThai}")
    public ResponseEntity<?> doiTrangThai(
            @PathVariable Integer idSanPham,
            @PathVariable int trangThai,
            @PathVariable Integer idChiTietSanPham) {
        return ResponseEntity.ok(chiTietSanPhamService.doiTrangThai(idSanPham, idChiTietSanPham, trangThai));
    }

    @PostMapping(value = "/them-anh/{idSanPham}")
    public ResponseEntity<?> themAnh(
            @RequestPart final List<MultipartFile> file,
            @RequestParam("tenMau") List<String> tenMau,
            @PathVariable Integer idSanPham
    ) {
        chiTietSanPhamService.uploadImage(file, tenMau, idSanPham);
        return ResponseEntity.ok("Upload successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ChiTietSanPham>> searchChiTietSanPham(
            @RequestParam(required = false) String idMuiGiay,
            @RequestParam(required = false) String idSanPham,
            @RequestParam(required = false) String idMauSac,
            @RequestParam(required = false) String idNhaCungCap,
            @RequestParam(required = false) String idKichCo,
            @RequestParam(required = false) String idChatLieu,
            @RequestParam(required = false) String idDeGiay,
            @RequestParam(required = false) String idThuongHieu,
            @RequestParam(required = false) String idDanhMucSanPham,
            @RequestParam(required = false) String idCoGiay,
            @RequestParam(required = false) Boolean trangThai
            ,@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<ChiTietSanPham> chiTietSanPhams = chiTietSanPhamService.searchChiTietSanPham(
                idMuiGiay, idSanPham, idMauSac, idNhaCungCap, idKichCo, idChatLieu,
                idDeGiay, idThuongHieu, idDanhMucSanPham, idCoGiay, trangThai, pageable);

        return ResponseEntity.ok(chiTietSanPhams);
    }
}

package com.example.dev.controller;

import com.example.dev.DTO.request.DotGiamGia.DotGiamGiaRequestDTO;
import com.example.dev.DTO.request.DotGiamGia.GetSanPhamChiTietDTO;
import com.example.dev.DTO.request.DotGiamGia.GetSanPhamDTO;
import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.entity.DotGiamGia;
import com.example.dev.entity.attribute.SanPham;
import com.example.dev.service.DotGiamGiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/dot-giam-gia")
public class DotGiamGiaController {
    @Autowired
    DotGiamGiaService dotGiamGiaService;

//    @GetMapping("/hien-thi")
//    public ResponseEntity<?> hienThi(){
//        return ResponseEntity.ok(dotGiamGiaService.getDgg());
//    }

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi(
            @RequestParam(value = "skip", defaultValue = "0") int skip,
            @RequestParam(value = "limit", defaultValue = "10") int limit,
            @RequestParam(value = "tenDotGiamGia", required = false) String tenDotGiamGia,
            @RequestParam(value = "hinhThuc", required = false) String hinhThuc,
            @RequestParam(value = "giaTri", required = false) Integer giaTri,
            @RequestParam(value = "ngayBatDau", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ngayBatDau,
            @RequestParam(value = "ngayKetThuc", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ngayKetThuc,
            @RequestParam(value = "trangThai", required = false) String trangThai) {

        Map<String, Object> result = dotGiamGiaService.getDgg(skip, limit, tenDotGiamGia, hinhThuc, giaTri, ngayBatDau, ngayKetThuc, trangThai);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/lay-ma-dgg")
    public ResponseEntity<?> layMaDGG(){
        return ResponseEntity.ok(dotGiamGiaService.layMaDGG());
    }

    @GetMapping("/chi-tiet-dgg/{idDotGiamGia}")
    public ResponseEntity<DotGiamGia> addDGG(@PathVariable String idDotGiamGia){
        DotGiamGia dotGiamGia = dotGiamGiaService.getDggById(idDotGiamGia);
        return ResponseEntity.ok(dotGiamGia);
    }

    @PostMapping("/them-dgg")
    public ResponseEntity<DotGiamGia> addDGG(@RequestBody DotGiamGiaRequestDTO requestDTO) {
        DotGiamGia savedDotGiamGia = dotGiamGiaService.addDGG(requestDTO);
        return ResponseEntity.ok(savedDotGiamGia);
    }
    // Lấy danh sách sản phẩm
    @GetMapping("/get-san-pham")
    public ResponseEntity<GetSanPhamDTO> getSanPham(@RequestParam int skip,
                                                    @RequestParam int limit,
                                                    @RequestParam(required = false, defaultValue = "") String tenSanPham){
//        return dotGiamGiaService.getSanPham(tenSanPham, skip, limit);
        GetSanPhamDTO response = dotGiamGiaService.getSanPham(tenSanPham, skip, limit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-san-pham-all")
    public List<SanPham> getSanPham(){
        return dotGiamGiaService.getSpAll();
    }

    @PostMapping("/get-san-pham-chi-tiet")
    public ResponseEntity<GetSanPhamChiTietDTO> getSanPhamChiTiet(@RequestParam int skip,
                                                    @RequestParam int limit,
                                                    @RequestBody Map<String, List<Integer>> body){
        List<Integer> idSanPham = body.get("idSanPham"); // Lấy danh sách idSanPham từ body
//        List<ChiTietSanPham> chiTietSanPhams = dotGiamGiaService.getSanPhamChiTiet(idSanPham, skip, limit);
//        return ResponseEntity.ok(new GetSanPhamChiTietDTO(chiTietSanPhams, chiTietSanPhams.size()));
        Page<ChiTietSanPham> chiTietSanPhamPage = dotGiamGiaService.getSanPhamChiTiet(idSanPham, skip, limit);

        return ResponseEntity.ok(new GetSanPhamChiTietDTO(
                chiTietSanPhamPage.getContent(),  // Danh sách sản phẩm theo trang
                chiTietSanPhamPage.getTotalElements() // Tổng số bản ghi trong DB
        ));
//        GetSanPhamChiTietDTO response = dotGiamGiaService.getSanPhamChiTiet(idSanPham, skip, limit);
//        return ResponseEntity.ok(response);
    }

    // Lấy danh sách id sản phẩm chi tiết trong đợt giảm giá chi tiết
    @GetMapping("/get-list-id-san-pham-chi-tiet/{idDotGiamGia}")
    public ResponseEntity<List<Integer>> getListIdSPChiTiet(@PathVariable String idDotGiamGia){
        List<Integer> idSanPhamChiTiet = dotGiamGiaService.getListIdSPChiTiet(idDotGiamGia);
        return ResponseEntity.ok(idSanPhamChiTiet);
    }

    // Lấy danh sách id sản phẩm theo id sản phẩm chi tiết
    @PostMapping("/get-list-id-san-pham")
    public ResponseEntity<List<Integer>> getListIDSP(@RequestBody List<Integer> idSanPhamChiTiet){
        List<Integer> result = dotGiamGiaService.getListIDSP(idSanPhamChiTiet);
        return ResponseEntity.ok(result);
    }

    // Lấy danh sách sản phẩm theo list id sản phẩm
    @PostMapping("/get-list-san-pham")
    public ResponseEntity<List<SanPham>> getListSP(@RequestBody List<Integer> idSanPham){
//        List<Integer> result = dotGiamGiaService.getListSP(idSanPham);
        return ResponseEntity.ok(dotGiamGiaService.getListSP(idSanPham));
    }

    // Lấy danh sách sản phẩm chi tiết theo list sản phẩm chi tiết
    @PostMapping("/get-list-san-pham-chi-tiet")
    public ResponseEntity<List<ChiTietSanPham>> getListSPCT(@RequestBody List<Integer> idSanPhamChiTiet){
//        List<Integer> result = dotGiamGiaService.getListSPCT(idSanPhamChiTiet);
        return ResponseEntity.ok(dotGiamGiaService.getListSPCT(idSanPhamChiTiet));
    }
    // Cập nhật đợt giảm giá
    @PutMapping("/cap-nhat-dgg")
    public ResponseEntity<DotGiamGia> editDGG(@RequestBody DotGiamGiaRequestDTO requestDTO){
        DotGiamGia savedDotGiamGia = dotGiamGiaService.editDGG(requestDTO);
        return ResponseEntity.ok(savedDotGiamGia);
    }
//    @PostMapping("/get-san-pham-by-dot-giam-gia/{idDotGiamGia}")
//    public ResponseEntity<GetSanPhamDTO> getSanPhamByDotGiamGia(@PathVariable String idDotGiamGia){
//        List<SanPham> sanPhams = dotGiamGiaService.getSanPhamByDotGiamGia(idDotGiamGia);
//        return ResponseEntity.ok(new GetSanPhamDTO(sanPhams, sanPhams.size()));
////        GetSanPhamChiTietDTO response = dotGiamGiaService.getSanPhamChiTiet(idSanPham, skip, limit);
////        return ResponseEntity.ok(response);
//    }


//    @GetMapping("/sanpham/{idDotGiamGia}")
//    public ResponseEntity<List<SanPham>> getSanPhamByDotGiamGia(@PathVariable String idDotGiamGia) {
//        List<SanPham> sanPhamList = dotGiamGiaService.getSanPhamByDotGiamGia(idDotGiamGia);
//        if (sanPhamList.isEmpty()) {
//            return ResponseEntity.noContent().build(); // Trả về 204 nếu không có sản phẩm
//        }
//        return ResponseEntity.ok(sanPhamList);
//    }

}

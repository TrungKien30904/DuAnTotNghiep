package com.example.dev.controller.customer;

import com.example.dev.entity.customer.DiaChi;
import com.example.dev.entity.customer.KhachHang;
import com.example.dev.mapper.AddressMapper;
import com.example.dev.mapper.CustomerMapper;
import com.example.dev.service.customer.KhachHangService;
import com.example.dev.util.baseModel.BaseListResponse;
import com.example.dev.util.baseModel.BaseResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/khach-hang")
@CrossOrigin(origins = "http://localhost:3000")
public class KhachHangController {
    @Autowired
    private KhachHangService khachHangService;


    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
    @GetMapping("/hien-thi-customer")
    public ResponseEntity<List<KhachHang>> hienThiKhachHang() {
        return ResponseEntity.ok(khachHangService.getAllCustomerIsStatusTrue());
    }

    @GetMapping("/export-excel")
    public ResponseEntity<List<KhachHang>> hienThi() {
        return ResponseEntity.ok(khachHangService.getAll());
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable Integer id) {
        CustomerMapper khachHang = khachHangService.detailKhachHang(id);
        return ResponseEntity.ok(khachHang);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
    @PostMapping("/them")
    public ResponseEntity<BaseResponse<Integer>> them(@RequestPart("user") String model, @RequestPart("fileImage") MultipartFile file) {
        return ResponseEntity.ok(khachHangService.themKhachHang(model, file));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
    @PostMapping("/sua")
    public ResponseEntity<BaseResponse<KhachHang>> sua(@Valid @RequestBody CustomerMapper model) {
        return ResponseEntity.ok(khachHangService.suaKhachHang(model));
    }


    @PostMapping("/update-address")
    public ResponseEntity<?> updateAddress(@Valid @RequestBody CustomerMapper model) {
        return ResponseEntity.ok(khachHangService.updateAddress(model));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF','CUSTOMER')")
    @DeleteMapping("/xoa/{id}")
    public ResponseEntity<?> xoa(@PathVariable Integer id) {
        khachHangService.xoaKhachHang(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tim-kiem")
    public ResponseEntity<BaseListResponse<CustomerMapper>> timKiem(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean gioiTinh,
            @RequestParam(required = false) Boolean trangThai,
            @RequestParam(required = false) String soDienThoai,
            Pageable pageable
    ) {
        return ResponseEntity.ok(khachHangService.timKiem(keyword, gioiTinh, trangThai, soDienThoai, pageable));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        fieldError -> fieldError.getField(),
                        fieldError -> fieldError.getDefaultMessage(),
                        (existing, replacement) -> existing
                ));
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateFieldException(IllegalArgumentException ex) {
        Map<String, String> errors = Map.of("error", ex.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }

    @PostMapping("/them-kh")
    public ResponseEntity<?> themKh(@RequestBody KhachHang khachHang) {
        return ResponseEntity.ok(khachHangService.themKhachHang(khachHang));
    }

    @PutMapping("/update-address-selected")
    public ResponseEntity<?> updateSelectedAddress(@RequestBody AddressMapper addressMapper) {
        try {
            DiaChi updatedAddress = khachHangService.updateSelectedAddress(addressMapper);
            return ResponseEntity.ok(updatedAddress);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping("/update-address-direct")
    public ResponseEntity<?> updateDirectAddress(@RequestBody AddressMapper addressMapper) {
        try {
            KhachHang updatedCustomer = khachHangService.updateDirectAddress(addressMapper);
            return ResponseEntity.ok(updatedCustomer);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/detail-client/{id}")
    public ResponseEntity<?> detailClient(@PathVariable Integer id) {
        CustomerMapper khachHang = khachHangService.detailKhachHangClient(id);
        return ResponseEntity.ok(khachHang);
    }

    @PostMapping("/them-dia-chi")
    public ResponseEntity<DiaChi> themDiaChi(@Valid @RequestBody AddressMapper addressMapper) {
        DiaChi newDiaChi = khachHangService.themDiaChi(addressMapper);
        return ResponseEntity.status(HttpStatus.CREATED).body(newDiaChi);
    }
}

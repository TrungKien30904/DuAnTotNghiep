package com.example.dev.service;

import com.example.dev.entity.KhachHang;
import com.example.dev.entity.PhieuGiamGia;
import com.example.dev.entity.PhieuGiamGiaChiTiet;
import com.example.dev.repository.KhachHangRepository;
import com.example.dev.repository.PhieuGiamGiaChiTietRepository;
import com.example.dev.repository.PhieuGiamGiaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PhieuGiamGiaService {
    @Autowired
    private PhieuGiamGiaRepository giamGiaRepository;
    @Autowired
    private PhieuGiamGiaChiTietRepository chiTietRepository;
    @Autowired
    private KhachHangRepository khachHangRepository;
    @Autowired
    private EmailService emailService;

    private static final Random random = new Random();

    // hien thi pgg
    public Page<PhieuGiamGia> hienThi(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "ngayTao"));
        return giamGiaRepository.findAll(pageable);
    }

    // hien thi danh sach khach hang
    public Page<KhachHang> hienThiKhachHang(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return khachHangRepository.findAll(pageable);
    }

    private String generateDiscountCode() {
        String code;
        do {
            code = generateCode();
        } while (giamGiaRepository.existsByMaKhuyenMai(code));
        return code;
    }
    private String generateCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder("MGG");
        for (int i = 0; i < 6; i++) {
            code.append(characters.charAt(random.nextInt(characters.length())));
        }
        return code.toString();
    }

    // thêm
    @Transactional
    public PhieuGiamGia themPhieuGiamGia(PhieuGiamGia phieuGiamGia) {
        phieuGiamGia.setNguoiTao("Nguyen Van A"); // gắn cứng nào có role tính sau
        phieuGiamGia.setMaKhuyenMai(generateDiscountCode()); // Tự động sinh mã giảm giá

        if ("Công Khai".equals(phieuGiamGia.getLoai())) {
            List<KhachHang> allCustomers = khachHangRepository.findAll();
            for (KhachHang customer : allCustomers) {
                PhieuGiamGiaChiTiet chiTiet = new PhieuGiamGiaChiTiet();
                chiTiet.setPhieuGiamGia(phieuGiamGia);
                chiTiet.setKhachHang(customer);
                chiTiet.setNgayTao(LocalDateTime.now());
                chiTiet.setNgaySua(LocalDateTime.now());
                chiTiet.setNguoiTao("Nguyen Van A");
                chiTiet.setNguoiSua("Nguyen Van A");
                phieuGiamGia.getDanhSachKhachHang().add(chiTiet);

                // Gửi email cho khách hàng
                emailService.sendDiscountEmailCongKhai(customer, phieuGiamGia);
            }
        } else if ("Cá Nhân".equals(phieuGiamGia.getLoai())) {
            if (phieuGiamGia.getDanhSachKhachHang() != null && !phieuGiamGia.getDanhSachKhachHang().isEmpty()) {
                for (PhieuGiamGiaChiTiet chiTiet : phieuGiamGia.getDanhSachKhachHang()) {
                    // load lại danh sách khách hàng
                    KhachHang khachHang = khachHangRepository.findById(chiTiet.getKhachHang().getIdKhachHang())
                            .orElseThrow(() -> new RuntimeException("KhachHang not found"));
                    chiTiet.setPhieuGiamGia(phieuGiamGia);
                    chiTiet.setKhachHang(khachHang);
                    chiTiet.setNgayTao(LocalDateTime.now());
                    chiTiet.setNgaySua(LocalDateTime.now());
                    chiTiet.setNguoiTao("Nguyen Van A");
                    chiTiet.setNguoiSua("Nguyen Van A");// chưa có gắn tạm
                    // Gửi email cho khách hàng
                    emailService.sendDiscountEmailCaNhan(khachHang, phieuGiamGia);
                }
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh sách khách hàng cá nhân không được để trống");
            }
        }

        return giamGiaRepository.save(phieuGiamGia);
    }
    // xuất excel

    public ByteArrayInputStream exportPhieuGiamGiaToExcel() {
        String[] columns = {"STT","Mã Khuyến Mại", "Tên Khuyến Mại", "Hình Thức", "Loại", "Giá Trị Giảm", "Số Lượng", "Ngày Bắt Đầu", "Ngày Kết Thúc"};

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Phiếu Giảm Giá");

            // Header
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
            }

            // Data
            List<PhieuGiamGia> phieuGiamGias = giamGiaRepository.findAll();
            int rowIdx = 1;
            int index=1;
            for (PhieuGiamGia phieuGiamGia : phieuGiamGias) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(index++);
                row.createCell(1).setCellValue(phieuGiamGia.getMaKhuyenMai());
                row.createCell(2).setCellValue(phieuGiamGia.getTenKhuyenMai());
                row.createCell(3).setCellValue(phieuGiamGia.getHinhThuc());
                row.createCell(4).setCellValue(phieuGiamGia.getLoai());
                row.createCell(5).setCellValue(phieuGiamGia.getGiaTri().doubleValue());
                row.createCell(6).setCellValue(phieuGiamGia.getSoLuong());
                row.createCell(7).setCellValue(phieuGiamGia.getNgayBatDau().toString());
                row.createCell(8).setCellValue(phieuGiamGia.getNgayKetThuc().toString());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to export data to Excel file: " + e.getMessage());
        }
    }

    // chuyển đổi trạng thái
    @Transactional
    public PhieuGiamGia chuyenDoiTrangThai(int id) {
        PhieuGiamGia phieuGiamGia = timPhieuGiamTheoID(id);
        switch (phieuGiamGia.getTrangThai()) {
            case 2:
                phieuGiamGia.setTrangThai(1); // "Chưa Bắt Đầu" sang "Đang Diễn Ra"
                phieuGiamGia.setNgayBatDau(LocalDateTime.now());
                phieuGiamGia.setNgaySua(LocalDateTime.now());
                //phieuGiamGia.setNguoiSua();
                break;
            case 1:
                phieuGiamGia.setTrangThai(0); // "Đang Diễn Ra" sang "Đã Kết Thúc"
                phieuGiamGia.setNgayKetThuc(LocalDateTime.now());
                phieuGiamGia.setNgaySua(LocalDateTime.now());
                //phieuGiamGia.setNguoiSua();
                break;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ");
        }

        // Đồng bộ trạng thái với PhieuGiamGiaChiTiet
        for (PhieuGiamGiaChiTiet chiTiet : phieuGiamGia.getDanhSachKhachHang()) {
            chiTiet.setTrangThai(phieuGiamGia.getTrangThai());
            chiTietRepository.save(chiTiet);
        }

        // Gửi email thông báo thay đổi trạng thái cho khách hàng
        for (PhieuGiamGiaChiTiet chiTiet : phieuGiamGia.getDanhSachKhachHang()) {
            KhachHang khachHang = chiTiet.getKhachHang();
            emailService.sendStatusChangeEmail(khachHang, phieuGiamGia);
        }

        return giamGiaRepository.save(phieuGiamGia);
    }


    // tìm theo id
    public PhieuGiamGia timPhieuGiamTheoID(int id) {
        return giamGiaRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Phiếu giảm giá không tồn tại"));
    }

    // sửa
    @Transactional
    public PhieuGiamGia suaPhieuGiamGia(int id, PhieuGiamGia phieuGiamGia) {
        PhieuGiamGia existingPhieu = timPhieuGiamTheoID(id);

        // Nếu phiếu ban đầu là công khai hoặc phiếu mới là công khai
        if ("Công Khai".equals(existingPhieu.getLoai()) || "Công Khai".equals(phieuGiamGia.getLoai())) {
            existingPhieu.setTenKhuyenMai(phieuGiamGia.getTenKhuyenMai());
            existingPhieu.setGiaTri(phieuGiamGia.getGiaTri());
            existingPhieu.setDieuKien(phieuGiamGia.getDieuKien());
            existingPhieu.setLoai(phieuGiamGia.getLoai());
            existingPhieu.setGiaTriToiDa(phieuGiamGia.getGiaTriToiDa());
            existingPhieu.setHinhThuc(phieuGiamGia.getHinhThuc());
            existingPhieu.setNgaySua(LocalDateTime.now());
            existingPhieu.setNgayBatDau(phieuGiamGia.getNgayBatDau());
            existingPhieu.setNgayKetThuc(phieuGiamGia.getNgayKetThuc());
            existingPhieu.setNguoiSua(phieuGiamGia.getNguoiSua());
            existingPhieu.setSoLuong(phieuGiamGia.getSoLuong());

            // Xóa danh sách khách hàng cũ
            chiTietRepository.deleteByPhieuGiamGiaId(existingPhieu.getId());
            existingPhieu.getDanhSachKhachHang().clear();

            // Thêm danh sách khách hàng mới
            if ("Công Khai".equals(phieuGiamGia.getLoai())) {
                List<KhachHang> allCustomers = khachHangRepository.findAll();
                for (KhachHang customer : allCustomers) {
                    PhieuGiamGiaChiTiet chiTiet = new PhieuGiamGiaChiTiet();
                    chiTiet.setPhieuGiamGia(existingPhieu);
                    chiTiet.setKhachHang(customer);
                    chiTiet.setNgayTao(LocalDateTime.now());
                    chiTiet.setNgaySua(LocalDateTime.now());
                    chiTiet.setNguoiTao("Nguyen Van A");
                    chiTiet.setNguoiSua("Nguyen Van A");
                    existingPhieu.getDanhSachKhachHang().add(chiTiet);
                    chiTietRepository.save(chiTiet);

                    // Gửi email cho khách hàng công khai
                    emailService.sendUpdateChangeEmail(customer, existingPhieu);
                }
            } else {
                for (PhieuGiamGiaChiTiet chiTiet : phieuGiamGia.getDanhSachKhachHang()) {
                    KhachHang khachHang = khachHangRepository.findById(chiTiet.getKhachHang().getIdKhachHang())
                            .orElseThrow(() -> new RuntimeException("KhachHang not found"));

                    chiTiet.setPhieuGiamGia(existingPhieu);
                    chiTiet.setKhachHang(khachHang);
                    chiTiet.setNgayTao(LocalDateTime.now());
                    chiTiet.setNgaySua(LocalDateTime.now());
                    chiTiet.setNguoiTao("Nguyen Van A");
                    chiTiet.setNguoiSua("Nguyen Van A");
                    existingPhieu.getDanhSachKhachHang().add(chiTiet);
                    chiTietRepository.save(chiTiet);

                    // Gửi email cho khách hàng cá nhân
                    emailService.sendDiscountEmailCaNhan(khachHang, existingPhieu);
                }
            }

            return giamGiaRepository.save(existingPhieu); // Trả về object đã cập nhật
        }

        // Lấy danh sách khách hàng cũ
        Set<Integer> oldCustomerIds = existingPhieu.getDanhSachKhachHang().stream()
                .map(chiTiet -> chiTiet.getKhachHang().getIdKhachHang())
                .collect(Collectors.toSet());

        // Lấy danh sách khách hàng mới
        Set<Integer> newCustomerIds = phieuGiamGia.getDanhSachKhachHang().stream()
                .map(chiTiet -> chiTiet.getKhachHang().getIdKhachHang())
                .collect(Collectors.toSet());

        // Xác định khách hàng bị bỏ chọn
        Set<Integer> removedCustomerIds = oldCustomerIds.stream()
                .filter(idKhachHang -> !newCustomerIds.contains(idKhachHang))
                .collect(Collectors.toSet());

        // Xác định khách hàng mới được thêm
        Set<Integer> addedCustomerIds = newCustomerIds.stream()
                .filter(idKhachHang -> !oldCustomerIds.contains(idKhachHang))
                .collect(Collectors.toSet());

        // Gửi email xin lỗi đến các khách hàng bị bỏ chọn
        for (Integer removedCustomerId : removedCustomerIds) {
            KhachHang removedCustomer = khachHangRepository.findById(removedCustomerId)
                    .orElseThrow(() -> new RuntimeException("KhachHang not found"));
            emailService.sendApologyEmail(removedCustomer, existingPhieu);
        }

        existingPhieu.setTenKhuyenMai(phieuGiamGia.getTenKhuyenMai());
        existingPhieu.setGiaTri(phieuGiamGia.getGiaTri());
        existingPhieu.setDieuKien(phieuGiamGia.getDieuKien());
        existingPhieu.setLoai(phieuGiamGia.getLoai());
        existingPhieu.setGiaTriToiDa(phieuGiamGia.getGiaTriToiDa());
        existingPhieu.setHinhThuc(phieuGiamGia.getHinhThuc());
        existingPhieu.setNgaySua(LocalDateTime.now());
        existingPhieu.setNgayBatDau(phieuGiamGia.getNgayBatDau());
        existingPhieu.setNgayKetThuc(phieuGiamGia.getNgayKetThuc());
        existingPhieu.setNguoiSua(phieuGiamGia.getNguoiSua());
        existingPhieu.setSoLuong(phieuGiamGia.getSoLuong());

        // Xóa danh sách khách hàng cũ
        chiTietRepository.deleteByPhieuGiamGiaId(existingPhieu.getId());
        existingPhieu.getDanhSachKhachHang().clear();

        // Thêm danh sách khách hàng mới
        for (PhieuGiamGiaChiTiet chiTiet : phieuGiamGia.getDanhSachKhachHang()) {
            KhachHang khachHang = khachHangRepository.findById(chiTiet.getKhachHang().getIdKhachHang())
                    .orElseThrow(() -> new RuntimeException("KhachHang not found"));

            chiTiet.setPhieuGiamGia(existingPhieu);
            chiTiet.setKhachHang(khachHang);
            chiTiet.setNgayTao(LocalDateTime.now());
            chiTiet.setNgaySua(LocalDateTime.now());
            chiTiet.setNguoiTao("Nguyen Van A");
            chiTiet.setNguoiSua("Nguyen Van A");
            existingPhieu.getDanhSachKhachHang().add(chiTiet);
            chiTietRepository.save(chiTiet);

            // Chỉ gửi email cho khách hàng mới
            if (addedCustomerIds.contains(khachHang.getIdKhachHang())) {
                emailService.sendDiscountEmailCaNhan(khachHang, existingPhieu);
            }
        }

        return giamGiaRepository.save(existingPhieu); // Trả về object đã cập nhật
    }

    // tìm kiếm
    public Page<PhieuGiamGia> timKiem(String keyword, Integer trangThai, LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "ngayTao"));
        return giamGiaRepository.searchByMultipleCriteria(keyword, trangThai, startDate, endDate, pageable);
    }

    // tìm kiếm khách hàng
    public Page<KhachHang> timKiemKhachHang(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (keyword != null && !keyword.isEmpty()) {
            return khachHangRepository.searchByTen(keyword, pageable);
        }
        return khachHangRepository.findAll(pageable);
    }

    // tự động lưu trạng thái mơí vào đb
    @Scheduled(fixedRate = 60000) // Chạy mỗi 60 giây
    @Transactional
    public void updateCouponStatus() {
        List<PhieuGiamGia> danhSachPhieu = giamGiaRepository.findAllWithDetails();
        LocalDateTime today = LocalDateTime.now();

        for (PhieuGiamGia phieu : danhSachPhieu) {
            if (phieu.getNgayBatDau().isAfter(today)) {
                phieu.setTrangThai(2);
            } else if (phieu.getNgayKetThuc().isBefore(today)) {
                phieu.setTrangThai(0);
            } else {
                phieu.setTrangThai(1);
            }

            // Đồng bộ trạng thái với PhieuGiamGiaChiTiet
            for (PhieuGiamGiaChiTiet chiTiet : phieu.getDanhSachKhachHang()) {
                chiTiet.setTrangThai(phieu.getTrangThai());
                chiTietRepository.save(chiTiet);
            }
        }
        giamGiaRepository.saveAll(danhSachPhieu); // Lưu trạng thái mới vào DB
    }
}
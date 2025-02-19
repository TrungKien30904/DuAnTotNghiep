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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
                    KhachHang khachHang = khachHangRepository.findById(chiTiet.getKhachHang().getIdKhachHang()).orElseThrow(() -> new RuntimeException("KhachHang not found"));
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
        String[] columns = {"STT", "Mã Khuyến Mại", "Tên Khuyến Mại", "Hình Thức", "Loại", "Giá Trị Giảm", "Số Lượng", "Ngày Bắt Đầu", "Ngày Kết Thúc"};

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
            int index = 1;
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

    // update
    @Transactional
    public PhieuGiamGia updatePhieuGiamGia(Integer id, PhieuGiamGia phieuGiamGia) {
        PhieuGiamGia existingPhieu = timPhieuGiamTheoID(id);
        if (existingPhieu == null) {
            throw new RuntimeException("PhieuGiamGia with ID " + id + " not found");
        }

        boolean hasImportantChanges = hasImportantChanges(existingPhieu, phieuGiamGia);
        System.out.println(hasImportantChanges);

        // Cập nhật thông tin chung
        updatePhieuInfo(existingPhieu, phieuGiamGia);

        if ("Công Khai".equals(existingPhieu.getLoai()) || "Công Khai".equals(phieuGiamGia.getLoai())) {
            updateKhachHangCongKhai(existingPhieu, phieuGiamGia, hasImportantChanges);
        } else {
            updateKhachHangCaNhan(existingPhieu, phieuGiamGia, hasImportantChanges);
        }

        return giamGiaRepository.save(existingPhieu);
    }

    private void updatePhieuInfo(PhieuGiamGia existingPhieu, PhieuGiamGia newPhieu) {
        existingPhieu.setTenKhuyenMai(newPhieu.getTenKhuyenMai());
        existingPhieu.setGiaTri(newPhieu.getGiaTri());
        existingPhieu.setDieuKien(newPhieu.getDieuKien());
        existingPhieu.setLoai(newPhieu.getLoai());
        existingPhieu.setGiaTriToiDa(newPhieu.getGiaTriToiDa());
        existingPhieu.setHinhThuc(newPhieu.getHinhThuc());
        existingPhieu.setNgaySua(LocalDateTime.now());
        existingPhieu.setNgayBatDau(newPhieu.getNgayBatDau());
        existingPhieu.setNgayKetThuc(newPhieu.getNgayKetThuc());
        existingPhieu.setNguoiSua(newPhieu.getNguoiSua());
        existingPhieu.setSoLuong(newPhieu.getSoLuong());
    }

    private boolean compareBigDecimal(BigDecimal existingValue, BigDecimal newValue) {
        if (existingValue == null || newValue == null) {
            return existingValue == newValue;  // Trả về true nếu cả hai đều là null, false nếu một trong hai là null
        }
        return existingValue.compareTo(newValue) == 0;  // So sánh chính xác BigDecimal
    }

    private boolean hasImportantChanges(PhieuGiamGia existingPhieu, PhieuGiamGia newPhieu) {
        return Stream.of(new AbstractMap.SimpleEntry<>("TenKhuyenMai", !Objects.equals(existingPhieu.getTenKhuyenMai(), newPhieu.getTenKhuyenMai())), new AbstractMap.SimpleEntry<>("GiaTri", !compareBigDecimal(existingPhieu.getGiaTri(), newPhieu.getGiaTri())), new AbstractMap.SimpleEntry<>("GiaTriToiDa", !compareBigDecimal(existingPhieu.getGiaTriToiDa(), newPhieu.getGiaTriToiDa())), new AbstractMap.SimpleEntry<>("DieuKien", !compareBigDecimal(existingPhieu.getDieuKien(), newPhieu.getDieuKien())), new AbstractMap.SimpleEntry<>("HinhThuc", !Objects.equals(existingPhieu.getHinhThuc(), newPhieu.getHinhThuc())), new AbstractMap.SimpleEntry<>("NgayBatDau", !Objects.equals(existingPhieu.getNgayBatDau(), newPhieu.getNgayBatDau())), new AbstractMap.SimpleEntry<>("NgayKetThuc", !Objects.equals(existingPhieu.getNgayKetThuc(), newPhieu.getNgayKetThuc()))).filter(Map.Entry::getValue).peek(entry -> System.out.println(entry.getKey() + " is different")).findFirst().isPresent();
    }


    private void updateKhachHangCongKhai(PhieuGiamGia existingPhieu, PhieuGiamGia newPhieu, boolean hasImportantChanges) {
        Set<Integer> oldCustomerIds = existingPhieu.getDanhSachKhachHang().stream().map(chiTiet -> chiTiet.getKhachHang().getIdKhachHang()).collect(Collectors.toSet());

        List<KhachHang> allCustomers = khachHangRepository.findAll();
        Set<Integer> newCustomerIds = allCustomers.stream().map(KhachHang::getIdKhachHang).collect(Collectors.toSet());

        Set<Integer> removedCustomers = new HashSet<>(oldCustomerIds);
        removedCustomers.removeAll(newCustomerIds);


        for (KhachHang customer : allCustomers) {
            if (!oldCustomerIds.contains(customer.getIdKhachHang())) {
                PhieuGiamGiaChiTiet chiTiet = new PhieuGiamGiaChiTiet();
                chiTiet.setPhieuGiamGia(existingPhieu);
                chiTiet.setKhachHang(customer);
                chiTiet.setNgayTao(LocalDateTime.now());
                chiTiet.setNgaySua(LocalDateTime.now());
                chiTiet.setNguoiTao("Nguyen Van A");
                chiTiet.setNguoiSua("Nguyen Van A");
                existingPhieu.getDanhSachKhachHang().add(chiTiet);
                chiTietRepository.save(chiTiet);
                safeSendEmail(() -> emailService.sendDiscountEmailCongKhai(customer, existingPhieu));
            }
        }

        if (hasImportantChanges) {
            for (Integer oldCustomerId : oldCustomerIds) {
                KhachHang khachHang = khachHangRepository.findById(oldCustomerId).orElse(null);
                if (khachHang != null) {
                    safeSendEmail(() -> emailService.sendUpdateChangeEmail(khachHang, existingPhieu));
                }
            }
        }

    }

    private void updateKhachHangCaNhan(PhieuGiamGia existingPhieu, PhieuGiamGia newPhieu, boolean hasImportantChanges) {
        Set<Integer> oldCustomerIds = existingPhieu.getDanhSachKhachHang().stream().map(chiTiet -> chiTiet.getKhachHang().getIdKhachHang()).collect(Collectors.toSet());

        Set<Integer> newCustomerIds = newPhieu.getDanhSachKhachHang().stream().map(chiTiet -> chiTiet.getKhachHang().getIdKhachHang()).collect(Collectors.toSet());

        // Xác định khách hàng bị xóa và
        Set<Integer> removedCustomers = new HashSet<>(oldCustomerIds);
        removedCustomers.removeAll(newCustomerIds);
        // khách hàng mới
        Set<Integer> addedCustomers = new HashSet<>(newCustomerIds);
        addedCustomers.removeAll(oldCustomerIds);
        //khách hàng không thay đổi
        Set<Integer> unchangedCustomers = new HashSet<>(newCustomerIds);
        unchangedCustomers.retainAll(oldCustomerIds);

        // Xóa khách hàng bị bỏ chọn và gửi email xin lỗi
        existingPhieu.getDanhSachKhachHang().removeIf(chiTiet -> {
            int khachHangId = chiTiet.getKhachHang().getIdKhachHang();
            if (removedCustomers.contains(khachHangId)) {
                chiTietRepository.delete(chiTiet);
                safeSendEmail(() -> emailService.sendApologyEmail(chiTiet.getKhachHang(), existingPhieu));
                return true;
            }
            return false;
        });

        // Thêm khách hàng mới và gửi email tặng phiếu giảm giá
        for (PhieuGiamGiaChiTiet chiTiet : newPhieu.getDanhSachKhachHang()) {
            int khachHangId = chiTiet.getKhachHang().getIdKhachHang();
            if (addedCustomers.contains(khachHangId)) {
                KhachHang khachHang = khachHangRepository.findById(khachHangId).orElse(null);
                if (khachHang != null) {
                    chiTiet.setPhieuGiamGia(existingPhieu);
                    chiTiet.setKhachHang(khachHang);
                    chiTiet.setNgayTao(LocalDateTime.now());
                    chiTiet.setNgaySua(LocalDateTime.now());
                    chiTiet.setNguoiTao("Nguyen Van A");
                    chiTiet.setNguoiSua("Nguyen Van A");
                    existingPhieu.getDanhSachKhachHang().add(chiTiet);
                    chiTietRepository.save(chiTiet);
                    safeSendEmail(() -> emailService.sendDiscountEmailCaNhan(khachHang, existingPhieu));
                }
            }
        }

        // Nếu có thay đổi quan trọng, gửi email cập nhật cho khách hàng không thay đổi
        if (hasImportantChanges) {
            for (PhieuGiamGiaChiTiet chiTiet : existingPhieu.getDanhSachKhachHang()) {
                int khachHangId = chiTiet.getKhachHang().getIdKhachHang();
                if (unchangedCustomers.contains(khachHangId)) {
                    safeSendEmail(() -> emailService.sendUpdateChangeEmail(chiTiet.getKhachHang(), existingPhieu));
                }
            }
        }
    }


    private void safeSendEmail(Runnable emailTask) {
        try {
            emailTask.run();
        } catch (Exception e) {
            // Ghi log thay vì dừng toàn bộ quá trình cập nhật
            System.err.println("Lỗi khi gửi email: " + e.getMessage());
        }
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
            return khachHangRepository.searchByKeyword(keyword, pageable);
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

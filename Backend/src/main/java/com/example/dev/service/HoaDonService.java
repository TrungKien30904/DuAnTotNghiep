package com.example.dev.service;

import com.example.dev.entity.HoaDon;
import com.example.dev.entity.LichSuHoaDon;
import com.example.dev.repository.HoaDonRepository;
import com.example.dev.repository.LichSuHoaDonRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import java.io.ByteArrayOutputStream;

@Service
public class HoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private LichSuHoaDonRepository lichSuHoaDonRepository;
    private static final String PREFIX = "HD";
    private static final int RANDOM_LENGTH = 5;
    public List<HoaDon> findInvoices(String loaiDon, Optional<LocalDate> startDate, Optional<LocalDate> endDate, String searchQuery) {
        LocalDateTime startDateTime = startDate.map(date -> date.atStartOfDay()).orElse(null);
        LocalDateTime endDateTime = endDate.map(date -> date.atTime(23, 59, 59)).orElse(null);
        List<HoaDon> invoices = hoaDonRepository.findBySearchCriteria(loaiDon, startDateTime, endDateTime, searchQuery);
        return invoices;
    }

    public Map<String, Long> getInvoiceStatistics() {
        List<HoaDon> invoices = hoaDonRepository.findAll();
        return invoices.stream()
                .collect(Collectors.groupingBy(HoaDon::getTrangThai, Collectors.counting()));
    }

    public HoaDon findInvoice(String maHoaDon) {
        return hoaDonRepository.findByMaHoaDon(maHoaDon);
    }

    public HoaDon huy(String maHoaDon) {
        HoaDon hoaDon = findInvoice(maHoaDon);
        hoaDon.setTrangThai("Hủy");
        taoHoaDon(hoaDon, "Hủy", "admin");
        return hoaDonRepository.save(hoaDon);
    }

    public HoaDon xacnhan(String maHoaDon) {
        HoaDon hoaDon = findInvoice(maHoaDon);
        String trangThai = hoaDon.getTrangThai();
        if ("Chờ xác nhận".equals(trangThai)) {
            hoaDon.setTrangThai("Đã xác nhận");
        }
        if ("Đã xác nhận".equals(trangThai)) {
            hoaDon.setTrangThai("Chờ vận chuyển");
        }
        if ("Chờ vận chuyển".equals(trangThai)) {
            hoaDon.setTrangThai("Đã thanh toán");
        }
        if ("Đã thanh toán".equals(trangThai)) {
            hoaDon.setTrangThai("Giao thành công");
        }
        taoHoaDon(hoaDon, hoaDon.getTrangThai(), "admin");
        return hoaDonRepository.save(hoaDon);
    }

    public HoaDon quaylai(String maHoaDon) {
        HoaDon hoaDon = findInvoice(maHoaDon);
        hoaDon.setTrangThai("Chờ xác nhận");
        taoHoaDon(hoaDon, hoaDon.getTrangThai(), "admin");
        return hoaDonRepository.save(hoaDon);
    }

    public void taoHoaDon(HoaDon hoaDon, String hanhDong, String user) {
        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        lichSuHoaDon.setHoaDon(hoaDon);
        lichSuHoaDon.setHanhDong(hanhDong);
        lichSuHoaDon.setNgayTao(LocalDateTime.now());
        lichSuHoaDon.setNguoiTao(user);
        lichSuHoaDonRepository.save(lichSuHoaDon);
    }

    //123

    public HoaDon createHoaDon(HoaDon hoaDon) {
        // Nếu mã hóa đơn chưa có, tự động sinh mã
        if (hoaDon.getMaHoaDon() == null || hoaDon.getMaHoaDon().trim().isEmpty()) {
            hoaDon.setMaHoaDon(generateMaHoaDon());
            hoaDon.setNgayTao(LocalDate.now().atStartOfDay());
        }
        return hoaDonRepository.save(hoaDon);
    }

    public Optional<HoaDon> getHoaDonById(Integer id) {
        return hoaDonRepository.findById(id);
    }

    private String generateMaHoaDon() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder(PREFIX);
        Random random = new Random();

        for (int i = 0; i < RANDOM_LENGTH; i++) {
            int index = random.nextInt(characters.length());
            sb.append(characters.charAt(index));
        }
        return sb.toString();
    }

    public Resource xuatExcel() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

        List<HoaDon> invoices = hoaDonRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("HoaDon");

            // Tạo header
            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Mã HD", "Tên khách hàng", "Tên NV", "SĐT", "Email", "Tổng tiền", "Ngày tạo"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(createHeaderStyle(workbook));
            }

            // Đổ dữ liệu
            int rowIdx = 1;
            for (HoaDon invoice : invoices) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(invoice.getIdHoaDon());
                row.createCell(1).setCellValue(invoice.getMaHoaDon() != null ? invoice.getMaHoaDon() : "");

                // Kiểm tra khách hàng có tồn tại hay không
                if (invoice.getKhachHang() != null) {
                    row.createCell(2).setCellValue(invoice.getKhachHang().getHoTen() != null ? invoice.getKhachHang().getHoTen() : "");
                    row.createCell(4).setCellValue(invoice.getKhachHang().getSoDienThoai() != null ? invoice.getKhachHang().getSoDienThoai() : "");
                    row.createCell(5).setCellValue(invoice.getKhachHang().getEmail() != null ? invoice.getKhachHang().getEmail() : "");
                } else {
                    row.createCell(2).setCellValue("");
                    row.createCell(4).setCellValue("");
                    row.createCell(5).setCellValue("");
                }

                // Kiểm tra nhân viên có tồn tại hay không
                if (invoice.getNhanVien() != null) {
                    row.createCell(3).setCellValue(invoice.getNhanVien().getTen() != null ? invoice.getNhanVien().getTen() : "");
                } else {
                    row.createCell(3).setCellValue("");
                }

                // Kiểm tra tổng tiền
                row.createCell(6).setCellValue(invoice.getTongTien() != null ? invoice.getTongTien().doubleValue() : 0.0);

                // Kiểm tra ngày tạo
                row.createCell(7).setCellValue(invoice.getNgayTao() != null ? invoice.getNgayTao().format(formatter) : "");
            }

            workbook.write(out);
            return new ByteArrayResource(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi tạo file Excel", e);
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        return style;
    }

    public List<HoaDon> findAll() {
        return hoaDonRepository.findAll();
    }



    public void deleteById(Integer idHoaDon) {
        if (hoaDonRepository.existsById(idHoaDon)) {
            hoaDonRepository.deleteById(idHoaDon);
        } else {
            throw new RuntimeException("Hóa đơn không tồn tại với id: " + idHoaDon);
        }
    }
}

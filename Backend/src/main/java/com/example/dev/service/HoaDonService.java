package com.example.dev.service;

import com.example.dev.entity.HoaDon;
import com.example.dev.entity.LichSuHoaDon;
import com.example.dev.repository.HoaDonRepository;
import com.example.dev.repository.LichSuHoaDonRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.io.ByteArrayOutputStream;

@Service
public class HoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;


    @Autowired
    private LichSuHoaDonRepository lichSuHoaDonRepository;

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
                row.createCell(1).setCellValue(invoice.getMaHoaDon());
                row.createCell(2).setCellValue(invoice.getKhachHang().getHoTen());
                row.createCell(3).setCellValue(invoice.getNhanVien().getTen());
                row.createCell(4).setCellValue(invoice.getKhachHang().getSoDienThoai());
                row.createCell(5).setCellValue(invoice.getKhachHang().getEmail());
                row.createCell(6).setCellValue(invoice.getTongTien().doubleValue());
                row.createCell(7).setCellValue(invoice.getNgayTao().format(formatter));
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
}

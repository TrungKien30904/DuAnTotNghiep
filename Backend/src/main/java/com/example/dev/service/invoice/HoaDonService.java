package com.example.dev.service.invoice;

import com.example.dev.DTO.UserLogin.UserLogin;
import com.example.dev.DTO.request.HoaDonRequest;
import com.example.dev.DTO.response.HoaDon.HoaDonResponse;
import com.example.dev.DTO.response.HoaDon.ThanhToanHoaDonResponse;
import com.example.dev.DTO.response.HoaDonChiTiet.SanPhamCartResponse;
import com.example.dev.constant.BaseConstant;
import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.entity.PhieuGiamGia;
import com.example.dev.entity.customer.DiaChi;

import com.example.dev.entity.customer.KhachHang;
import com.example.dev.entity.invoice.HoaDon;
import com.example.dev.entity.invoice.HoaDonChiTiet;
import com.example.dev.entity.invoice.LichSuHoaDon;
import com.example.dev.entity.invoice.ThanhToanHoaDon;
import com.example.dev.repository.ChiTietSanPhamRepo;
import com.example.dev.repository.NhanVienRepo;
import com.example.dev.repository.customer.DiaChiRepo;
import com.example.dev.repository.customer.KhachHangRepo;
import com.example.dev.repository.invoice.HoaDonChiTietRepository;
import com.example.dev.repository.invoice.HoaDonRepository;
import com.example.dev.repository.invoice.LichSuHoaDonRepository;
import com.example.dev.repository.invoice.ThanhToanHoaDonRepository;
import com.example.dev.repository.voucher.PhieuGiamGiaRepository;
import com.example.dev.service.customer.DiaChiService;
import com.example.dev.service.EmailService;
import com.example.dev.service.payments.VNPayService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HoaDonService {

    private static final String PREFIX = "HD";
    private static final int RANDOM_LENGTH = 5;
    private final HoaDonChiTietRepository hoaDonChiTietRepository;
    private final ChiTietSanPhamRepo chiTietSanPhamRepo;
    private final ThanhToanHoaDonService thanhToanHoaDonService;
    private final LichSuHoaDonService lichSuHoaDonService;
    private final HoaDonRepository hoaDonRepository;
    private final PhieuGiamGiaRepository phieuGiamGiaRepository;
    private final LichSuHoaDonRepository lichSuHoaDonRepository;
    private final KhachHangRepo khachHangRepo;
    private final NhanVienRepo nhanVienRepo;
    private final VNPayService vnPayService;
    private final ThanhToanHoaDonRepository thanhToanHoaDonRepository;
    private final DiaChiService diaChiService;
    private final DiaChiRepo diaChiRepo;
    private final EmailService emailService;

    public List<HoaDon> findInvoices(String loaiDon, Optional<LocalDate> startDate, Optional<LocalDate> endDate, String searchQuery) {
        LocalDateTime startDateTime = startDate.map(date -> date.atStartOfDay()).orElse(null);
        LocalDateTime endDateTime = endDate.map(date -> date.atTime(23, 59, 59)).orElse(null);
        List<HoaDon> invoices = hoaDonRepository.findBySearchCriteria(loaiDon, startDateTime, endDateTime, searchQuery);
        return invoices;
    }

    public Map<String, Long> getInvoiceStatistics() {
        List<HoaDon> invoices = hoaDonRepository.findAll();
        return invoices.stream().collect(Collectors.groupingBy(HoaDon::getTrangThai, Collectors.counting()));
    }

    public HoaDonRequest findInvoiceByID(Integer idHoaDon) {
        HoaDonRequest request = new HoaDonRequest();
        HoaDon hd = hoaDonRepository.findById(idHoaDon).orElseThrow();
        request.setHoaDon(hd);
        if (hd.getKhachHang() != null) {
            request.setDiaChiKhachHang(diaChiService.getAddressCustomer(hd.getKhachHang().getIdKhachHang()));
        }
        if(hd.getTenNguoiNhan() != null || hd.getSoDienThoai() != null) {
            String provinceName = diaChiService.getProvince(hd.getTinhThanhPho());
            String districtName = diaChiService.getDistricts(hd.getTinhThanhPho(), hd.getQuanHuyen());
            String wardName = diaChiService.getWards(hd.getQuanHuyen(),hd.getXaPhuong());
            String fullAddress = "";
//            DiaChi dc = DiaChi.builder()
//                    .id(idHoaDon)
//                    .diaChiChiTiet()
//                    .build();
        }
        return request;
    }

    public HoaDon findInvoice(String maHoaDon) {
        return hoaDonRepository.findByMaHoaDon(maHoaDon);
    }

    public HoaDon huy(String maHoaDon, Authentication auth) {
        HoaDon hoaDon = findInvoice(maHoaDon);
        hoaDon.setTrangThai("Hủy");
        UserLogin user = (UserLogin) auth.getPrincipal();
        hoaDon.setNguoiSua(user.getUsername());
        hoaDon.setNhanVien(nhanVienRepo.findById(user.getId()).orElse(null));
        taoHoaDon(hoaDon, BaseConstant.Action.DELETE.getValue(), auth);
        return hoaDonRepository.save(hoaDon);
    }


    public HoaDon xacnhan(String maHoaDon, Authentication auth) {
        HoaDon hoaDon = findInvoice(maHoaDon);
        List<HoaDonChiTiet> cart = hoaDonChiTietRepository.findByHoaDon_MaHoaDon(maHoaDon);
        BigDecimal total = BigDecimal.ZERO;
        ThanhToanHoaDon tt = thanhToanHoaDonRepository.findByHoaDon_IdHoaDon(hoaDon.getIdHoaDon());

        if (hoaDon.getTrangThai().equalsIgnoreCase("Đã hoàn thành") || hoaDon.getTrangThai().equalsIgnoreCase("Hủy"))
            return null;
        String trangThai = hoaDon.getTrangThai();
        if ("Chờ xác nhận".equals(trangThai)) {
            hoaDon.setTrangThai("Đã xác nhận");
            for (HoaDonChiTiet chiTiet : cart) {
                total = total.add(chiTiet.getThanhTien());
                ChiTietSanPham ctsp = chiTietSanPhamRepo.findById(chiTiet.getChiTietSanPham().getIdChiTietSanPham()).orElse(null);
                if (ctsp != null) {
                    if (chiTiet.getSoLuong() > ctsp.getSoLuong()) {
                        chiTiet.setSoLuong(ctsp.getSoLuong());
                    }
                    chiTietSanPhamRepo.updateQuantity(ctsp.getIdChiTietSanPham(), ctsp.getSoLuong() - chiTiet.getSoLuong());
                }
            }
            hoaDon.setTongTien(total);
            tt.setSoTienThanhToan(total);
        }
        if ("Đã xác nhận".equals(trangThai)) {
            hoaDon.setTrangThai("Chờ vận chuyển");
        }
        if ("Chờ vận chuyển".equals(trangThai)) {
            hoaDon.setTrangThai("Đang vận chuyển");
        }
        if ("Đang vận chuyển".equals(trangThai)) {
            hoaDon.setTrangThai("Đã hoàn thành");
            tt.setTrangThai(true);
        }
        UserLogin user = (UserLogin) auth.getPrincipal();
        hoaDon.setNguoiSua(user.getUsername());
        hoaDon.setNhanVien(nhanVienRepo.findById(user.getId()).orElse(null));
        taoHoaDon(hoaDon, BaseConstant.Action.UPDATE.getValue(), auth);
        thanhToanHoaDonRepository.save(tt);
        return hoaDonRepository.save(hoaDon);
    }

    public HoaDon quaylai(String maHoaDon, Authentication auth) {
        HoaDon hoaDon = findInvoice(maHoaDon);
        List<HoaDonChiTiet> cart = hoaDonChiTietRepository.findByHoaDon_MaHoaDon(maHoaDon);
        BigDecimal total = BigDecimal.ZERO;
        String trangThai = hoaDon.getTrangThai();
        ThanhToanHoaDon tt = thanhToanHoaDonRepository.findByHoaDon_IdHoaDon(hoaDon.getIdHoaDon());

        if (trangThai.equalsIgnoreCase("Hủy")) return null;
        if ("Đã xác nhận".equals(trangThai)) {
            hoaDon.setTrangThai("Chờ xác nhận");
            for (HoaDonChiTiet chiTiet : cart) {
                total = total.add(chiTiet.getThanhTien());
                ChiTietSanPham ctsp = chiTietSanPhamRepo.findById(chiTiet.getChiTietSanPham().getIdChiTietSanPham()).orElse(null);
                if (ctsp != null) {
                    chiTietSanPhamRepo.updateQuantity(ctsp.getIdChiTietSanPham(), ctsp.getSoLuong() + chiTiet.getSoLuong());
                }
            }
            hoaDon.setTongTien(total);
            tt.setSoTienThanhToan(total);
        }
        if ("Chờ vận chuyển".equals(trangThai)) {
            hoaDon.setTrangThai("Đã xác nhận");
        }
        if ("Đang vận chuyển".equals(trangThai)) {
            hoaDon.setTrangThai("Chờ vận chuyển");
        }
        if ("Đã hoàn thành".equals(trangThai)) {
            hoaDon.setTrangThai("Hủy");
            tt.setTrangThai(false);
        }
        UserLogin user = (UserLogin) auth.getPrincipal();
        hoaDon.setNguoiSua(user.getUsername());
        hoaDon.setNhanVien(nhanVienRepo.findById(user.getId()).orElse(null));
        taoHoaDon(hoaDon, BaseConstant.Action.UPDATE.getValue(), auth);
        thanhToanHoaDonRepository.save(tt);

        return hoaDonRepository.save(hoaDon);
    }

    public void taoHoaDon(HoaDon hoaDon, String hanhDong, Authentication auth) {
        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        lichSuHoaDon.setGhiChu(hoaDon.getTrangThai());
        lichSuHoaDon.setHoaDon(hoaDon);
        lichSuHoaDon.setHanhDong(hanhDong);
        lichSuHoaDon.setNgayTao(LocalDateTime.now());
        UserLogin user = (UserLogin) auth.getPrincipal();
        lichSuHoaDon.setNguoiTao(user.getUsername());
        lichSuHoaDonRepository.save(lichSuHoaDon);
    }

    //123

    public HoaDon createHoaDon(Authentication auth) {
        // Nếu mã hóa đơn chưa có, tự động sinh mã
        HoaDon newInvoice = new HoaDon();
        UserLogin user = (UserLogin) auth.getPrincipal();
        newInvoice.setMaHoaDon(generateMaHoaDon());
        newInvoice.setNgayTao(LocalDateTime.now());
        newInvoice.setNguoiTao(user.getUsername());
        newInvoice.setNhanVien(nhanVienRepo.findById(user.getId()).orElse(null));
        newInvoice.setTrangThai("Hóa đơn trống");
        HoaDon n = hoaDonRepository.save(newInvoice);
        lichSuHoaDonService.themLichSu(LichSuHoaDon.builder().hoaDon(n).hanhDong(BaseConstant.Action.CREATE.getValue()).ngayTao(LocalDateTime.now()).nguoiTao(user.getUsername()).ghiChu("Thêm hóa đơn mới tại cửa hàng").build());
        return n;
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

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

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


    public void deleteById(Integer idHoaDon, Authentication auth) {
        if (hoaDonRepository.existsById(idHoaDon)) {
            List<HoaDonChiTiet> listRemove = hoaDonChiTietRepository.findAllByHoaDon_IdHoaDon(idHoaDon);
            for (HoaDonChiTiet removeCart : listRemove) {
                ChiTietSanPham refundProduct = chiTietSanPhamRepo.findById(removeCart.getChiTietSanPham().getIdChiTietSanPham()).orElseThrow();
                refundProduct.setSoLuong(refundProduct.getSoLuong() + removeCart.getSoLuong());
                chiTietSanPhamRepo.save(refundProduct);
            }
            hoaDonChiTietRepository.deleteAll(listRemove);
            HoaDon invoiceRemove = hoaDonRepository.findById(idHoaDon).orElseThrow();
            UserLogin user = (UserLogin) auth.getPrincipal();
            invoiceRemove.setNguoiSua(user.getUsername());
            invoiceRemove.setNhanVien(nhanVienRepo.findById(user.getId()).orElse(null));
            invoiceRemove.setTrangThai("Hủy");
            hoaDonRepository.save(invoiceRemove);
            lichSuHoaDonService.themLichSu(LichSuHoaDon.builder().hoaDon(invoiceRemove).hanhDong(BaseConstant.Action.DELETE.getValue()).ngayTao(LocalDateTime.now()).nguoiTao(user.getUsername()).ghiChu(invoiceRemove.getTrangThai()).build());

        } else {
            throw new RuntimeException("Hóa đơn không tồn tại với id: " + idHoaDon);
        }
    }

    public List<HoaDon> findAllByStatus() {
        return hoaDonRepository.findAllByTrangThaiEqualsIgnoreCase("Hóa đơn trống");
    }

    public void updateVoucher(Integer idHoaDon, Integer voucherId, Authentication auth) {
        Optional<HoaDon> optionalHoaDon = hoaDonRepository.findById(idHoaDon);
        if (optionalHoaDon.isPresent()) {
            HoaDon hoaDon = optionalHoaDon.get();
            PhieuGiamGia phieuGiamGia = phieuGiamGiaRepository.findById(voucherId).orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));
            UserLogin user = (UserLogin) auth.getPrincipal();
            hoaDon.setNguoiSua(user.getUsername());
            hoaDon.setNhanVien(nhanVienRepo.findById(user.getId()).orElse(null));
            hoaDon.setPhieuGiamGia(phieuGiamGia);
            hoaDonRepository.save(hoaDon);
        } else {
            throw new RuntimeException("Hóa đơn không tồn tại");
        }
    }

    public void pay(HoaDonResponse hoaDonResponse, Authentication auth) {
        HoaDon find = hoaDonRepository.findById(hoaDonResponse.getIdHoaDon()).orElseThrow();
        PhieuGiamGia pgg = phieuGiamGiaRepository.findById(hoaDonResponse.getIdPhieuGiamGia()).orElseThrow();

        find.setPhieuGiamGia(pgg);
        find.setTongTien(hoaDonResponse.getTongTien());
        find.setLoaiDon(hoaDonResponse.getLoaiDon());
        find.setPhuongThucNhanHang(hoaDonResponse.getPhuongThucNhanHang());
        find.setTinhThanhPho(hoaDonResponse.getTinhThanhPho());
        find.setQuanHuyen(hoaDonResponse.getQuanHuyen());
        find.setXaPhuong(hoaDonResponse.getXaPhuong());
        find.setGhiChu(hoaDonResponse.getGhiChu());
        find.setPhiVanChuyen(hoaDonResponse.getPhiVanChuyen());
        find.setKhachHang(khachHangRepo.findById(hoaDonResponse.getKhachHang()).orElse(null));
        find.setNgaySua(LocalDateTime.now());
        UserLogin user = (UserLogin) auth.getPrincipal();
        find.setNguoiSua(user.getUsername());
        find.setNhanVien(nhanVienRepo.findById(user.getId()).orElse(null));
        if (hoaDonResponse.getPhuongThucNhanHang().equals("taiquay")) {
            find.setTrangThai("Đã hoàn thành");
        } else {
            find.setTrangThai("Chờ vận chuyển");
        }

        hoaDonRepository.save(find);


        List<ThanhToanHoaDon> tthd = new ArrayList<>();
        for (ThanhToanHoaDonResponse tt : hoaDonResponse.getThanhToanHoaDon()) {
            tthd.add(ThanhToanHoaDon.builder().hoaDon(find).hinhThucThanhToan(tt.getHinhThucThanhToan()).soTienThanhToan(tt.getSoTien()).trangThai(true).ngayTao(LocalDateTime.now()).nguoiTao(user.getUsername()).build());
        }
        thanhToanHoaDonService.thanhToanHoaDon(tthd);

        lichSuHoaDonService.themLichSu(LichSuHoaDon.builder().hoaDon(find).hanhDong(BaseConstant.Action.UPDATE.getValue()).ngayTao(LocalDateTime.now()).nguoiTao(user.getUsername()).ghiChu(find.getTrangThai()).build());
    }


    // Online
    public void payCOD(HoaDonResponse hoaDonResponse, Authentication auth) {
        if (hoaDonResponse == null || hoaDonResponse.getTongTien() == null) {
            throw new RuntimeException("Dữ liệu đơn hàng không hợp lệ");
        }
        PhieuGiamGia pgg = phieuGiamGiaRepository.findById(hoaDonResponse.getIdPhieuGiamGia()).orElseThrow();

        HoaDon hoaDon = new HoaDon();
        hoaDon.setPhieuGiamGia(pgg);
        hoaDon.setMaHoaDon(generateMaHoaDon());
        hoaDon.setTongTien(hoaDonResponse.getTongTien());
        hoaDon.setLoaiDon("Online");
        hoaDon.setNgayTao(LocalDateTime.now());
        hoaDon.setTinhThanhPho(hoaDonResponse.getTinhThanhPho());
        hoaDon.setQuanHuyen(hoaDonResponse.getQuanHuyen());
        hoaDon.setXaPhuong(hoaDonResponse.getXaPhuong());
        hoaDon.setSoDienThoai(hoaDonResponse.getSoDienThoai());
        hoaDon.setTenNguoiNhan(hoaDonResponse.getTenNguoiNhan());
        hoaDon.setEmail(hoaDonResponse.getEmail());
        hoaDon.setGhiChu(hoaDonResponse.getGhiChu());
        hoaDon.setPhiVanChuyen(hoaDonResponse.getPhiVanChuyen());
        hoaDon.setPhuongThucNhanHang("giaohang");
        hoaDon.setTrangThai("Chờ xác nhận");

        if (hoaDonResponse.getKhachHang() != null) {
            hoaDon.setKhachHang(khachHangRepo.findById(hoaDonResponse.getKhachHang()).orElse(null));
        } else {
            hoaDon.setKhachHang(null);
        }
        if (hoaDonResponse.getVoucher() != null) {
            hoaDon.setPhieuGiamGia(phieuGiamGiaRepository.findById(hoaDonResponse.getVoucher()).orElse(null));
        } else {
            hoaDon.setPhieuGiamGia(null);
        }

        if (auth != null) {
            UserLogin user = (UserLogin) auth.getPrincipal();
            hoaDon.setNguoiTao(user.getUsername());
            hoaDon.setNhanVien(nhanVienRepo.findById(user.getId()).orElse(null));
        } else {
            hoaDon.setNguoiTao("Guest");
            hoaDon.setNhanVien(null);
        }

        // ✅ Lưu hóa đơn vào database
        hoaDonRepository.save(hoaDon);

        // ✅ Lưu sản phẩm vào bảng hoa_don_chi_tiet
        List<SanPhamCartResponse> sanPhamList = hoaDonResponse.getDanhSachSanPham();
        for (SanPhamCartResponse sp : sanPhamList) {
            HoaDonChiTiet chiTiet = new HoaDonChiTiet();
            chiTiet.setHoaDon(hoaDon);
            chiTiet.setChiTietSanPham(chiTietSanPhamRepo.findById(sp.getIdChiTietSanPham()).orElseThrow());
            chiTiet.setSoLuong(sp.getSoLuongMua());
            chiTiet.setDonGia(sp.getGiaSauGiam());
            chiTiet.setThanhTien(sp.getGiaSauGiam().multiply(BigDecimal.valueOf(chiTiet.getSoLuong())));
            hoaDonChiTietRepository.save(chiTiet);
        }

        // ✅ Lưu thanh toán
        ThanhToanHoaDon thanhToan = new ThanhToanHoaDon();
        thanhToan.setHoaDon(hoaDon);
        thanhToan.setHinhThucThanhToan("COD");
        thanhToan.setSoTienThanhToan(hoaDon.getTongTien());
        thanhToan.setTrangThai(false);
        thanhToan.setNgayTao(LocalDateTime.now());
        thanhToan.setNguoiTao(auth != null ? ((UserLogin) auth.getPrincipal()).getUsername() : "Guest");

        thanhToanHoaDonService.thanhToanHoaDon(Collections.singletonList(thanhToan));

        // ✅ Ghi lịch sử đơn hàng
        LichSuHoaDon lichSu = new LichSuHoaDon();
        lichSu.setHoaDon(hoaDon);
        lichSu.setGhiChu(hoaDon.getTrangThai());
        lichSu.setHanhDong(BaseConstant.Action.UPDATE.getValue());
        lichSu.setNgayTao(LocalDateTime.now());
        lichSu.setNguoiTao(auth != null ? ((UserLogin) auth.getPrincipal()).getUsername() : "Guest");

        lichSuHoaDonService.themLichSu(lichSu);

        // ✅ Gửi email xác nhận đơn hàng
        if (hoaDon.getKhachHang() == null && hoaDon.getEmail() != null) {
            emailService.sendOrderConfirmationEmail(hoaDon.getEmail(), hoaDon, sanPhamList);
        }
    }

    public String taoHoaDonVaThanhToan(HoaDonResponse hoaDonResponse, Authentication auth, String vnp_IpAddr, HttpServletRequest req) {
        // Kiểm tra dữ liệu hợp lệ
        if (hoaDonResponse == null || hoaDonResponse.getTongTien() == null) {
            throw new RuntimeException("Dữ liệu đơn hàng không hợp lệ");
        }

        // Bước 1: Tạo hóa đơn mới
        HoaDon hoaDon = new HoaDon();
        hoaDon.setMaHoaDon(generateMaHoaDon());
        hoaDon.setTongTien(hoaDonResponse.getTongTien());
        hoaDon.setLoaiDon("Online");
        hoaDon.setNgayTao(LocalDateTime.now());
        hoaDon.setTinhThanhPho(hoaDonResponse.getTinhThanhPho());
        hoaDon.setQuanHuyen(hoaDonResponse.getQuanHuyen());
        hoaDon.setXaPhuong(hoaDonResponse.getXaPhuong());
        hoaDon.setSoDienThoai(hoaDonResponse.getSoDienThoai());
        hoaDon.setTenNguoiNhan(hoaDonResponse.getTenNguoiNhan());
        hoaDon.setEmail(hoaDonResponse.getEmail());
        hoaDon.setGhiChu(hoaDonResponse.getGhiChu());
        hoaDon.setPhiVanChuyen(hoaDonResponse.getPhiVanChuyen());
        hoaDon.setPhuongThucNhanHang("giaohang");
        hoaDon.setTrangThai("Chờ xác nhận");


        if (hoaDonResponse.getKhachHang() != null) {
            hoaDon.setKhachHang(khachHangRepo.findById(hoaDonResponse.getKhachHang()).orElse(null));
        } else {
            hoaDon.setKhachHang(null);
        }

        if (hoaDonResponse.getVoucher() != null) {
            hoaDon.setPhieuGiamGia(phieuGiamGiaRepository.findById(hoaDonResponse.getVoucher()).orElse(null));
        } else {
            hoaDon.setPhieuGiamGia(null);
        }


        hoaDon.setNguoiTao("Guest");
        hoaDon.setNhanVien(null);


        // Lưu hóa đơn vào database
        hoaDon = hoaDonRepository.save(hoaDon);

        // Bước 2: Lưu sản phẩm vào bảng hoa_don_chi_tiet
        for (SanPhamCartResponse sp : hoaDonResponse.getDanhSachSanPham()) {
            HoaDonChiTiet chiTiet = new HoaDonChiTiet();
            chiTiet.setHoaDon(hoaDon);
            chiTiet.setChiTietSanPham(chiTietSanPhamRepo.findById(sp.getIdChiTietSanPham()).orElseThrow());
            chiTiet.setSoLuong(sp.getSoLuongMua());
            chiTiet.setDonGia(sp.getGiaSauGiam());
            chiTiet.setThanhTien(sp.getGiaSauGiam().multiply(BigDecimal.valueOf(chiTiet.getSoLuong())));
            hoaDonChiTietRepository.save(chiTiet);
        }

        // Bước 3: Lưu thanh toán
        ThanhToanHoaDon thanhToan = new ThanhToanHoaDon();
        thanhToan.setHoaDon(hoaDon);
        thanhToan.setHinhThucThanhToan("VNPay");
        thanhToan.setSoTienThanhToan(hoaDon.getTongTien());
        thanhToan.setTrangThai(false);
        thanhToan.setNgayTao(LocalDateTime.now());
        thanhToan.setNguoiTao(auth != null ? ((UserLogin) auth.getPrincipal()).getUsername() : "Guest");

        thanhToanHoaDonService.thanhToanHoaDon(Collections.singletonList(thanhToan));

        // Bước 4: Ghi lịch sử đơn hàng
        LichSuHoaDon lichSu = new LichSuHoaDon();
        lichSu.setHoaDon(hoaDon);
        lichSu.setHanhDong("Đặt hàng - VNPay");
        lichSu.setNgayTao(LocalDateTime.now());
        lichSu.setNguoiTao(auth != null ? ((UserLogin) auth.getPrincipal()).getUsername() : "Guest");

        lichSuHoaDonService.themLichSu(lichSu);

        // Bước 5: Gọi VNPayService để tạo URL thanh toán
        return vnPayService.createPaymentUrl(hoaDon.getIdHoaDon(), hoaDon.getTongTien());
    }


    public boolean xuLyKetQuaThanhToan(Map<String, String> params) {
        String vnp_ResponseCode = params.get("vnp_ResponseCode");
        String vnp_TxnRef = params.get("vnp_TxnRef"); // Mã đơn hàng là id hóa đơn
        String vnp_TransactionStatus = params.get("vnp_TransactionStatus");
        System.out.println("vnp_ResponseCode: " + vnp_ResponseCode);
        System.out.println("vnp_TransactionStatus: " + vnp_TransactionStatus);

        HoaDon hoaDon = hoaDonRepository.findById(Integer.parseInt(vnp_TxnRef)).orElseThrow();

        if ("00".equals(vnp_ResponseCode) && "00".equals(vnp_TransactionStatus)) {
            // Cập nhật trạng thái hóa đơn thành công
            thanhToanHoaDonService.capNhatTrangThaiThanhToan(hoaDon.getIdHoaDon(), true);
            vnPayService.VNPayReturnData(params);

            // Gửi email xác nhận đơn hàng
            if (hoaDon.getKhachHang() == null && hoaDon.getEmail() != null) {
                List<HoaDonChiTiet> danhSachSanPham = hoaDonChiTietRepository.findAllByHoaDon_IdHoaDon(hoaDon.getIdHoaDon());
                List<SanPhamCartResponse> sanPhamList = danhSachSanPham.stream().map(chiTiet -> {
                    SanPhamCartResponse sp = new SanPhamCartResponse();
                    sp.setIdHoaDon(chiTiet.getHoaDon().getIdHoaDon());
                    sp.setIdChiTietSanPham(chiTiet.getChiTietSanPham().getIdChiTietSanPham());
                    sp.setSoLuongMua(chiTiet.getSoLuong());
                    sp.setGiaSauGiam(chiTiet.getDonGia());
                    sp.setIdHoaDonChiTiet(chiTiet.getIdHoaDonChiTiet());
                    sp.setGiaDuocTinh(chiTiet.getThanhTien());
                    sp.setTenSanPham(chiTiet.getChiTietSanPham().getSanPham().getTen()); // Lấy tên sản phẩm
                    return sp;
                }).collect(Collectors.toList());
                emailService.sendOrderConfirmationEmail(hoaDon.getEmail(), hoaDon, sanPhamList);
            }
            return true;
        } else {
            // Xử lý thất bại
            thanhToanHoaDonService.capNhatTrangThaiThanhToan(hoaDon.getIdHoaDon(), false);
            return false;
        }
    }

    public void UpdateInvoice(Integer idHoaDon) {
        HoaDon invoice = hoaDonRepository.findById(idHoaDon).orElseThrow();
        List<HoaDonChiTiet> listCart = hoaDonChiTietRepository.findAllByHoaDon_IdHoaDon(idHoaDon);
        KhachHang kh = invoice.getKhachHang();
        List<DiaChi> dckh = diaChiRepo.findByKhachHang_IdKhachHang(kh.getIdKhachHang());

        if (dckh.isEmpty()){
            throw new RuntimeException("Khong tim thay dia chi khach");
        }
        DiaChi addressChange = new DiaChi();
        for (DiaChi dc : dckh) {
            if (dc.isMacDinh()){
                addressChange = dc;
                break;
            }
        }
        diaChiService.updateShippingFee(addressChange,idHoaDon);

        BigDecimal total = BigDecimal.ZERO;

// Tính tổng tiền hàng
        for (HoaDonChiTiet chiTiet : listCart) {
            total = total.add(chiTiet.getThanhTien()); // Cộng dồn thay vì multiply
        }

// Kiểm tra nếu có phiếu giảm giá
        PhieuGiamGia pgg = invoice.getPhieuGiamGia();
        if (pgg != null && total.compareTo(pgg.getDieuKien()) >= 0) {
            BigDecimal discount = getDiscount(pgg, total);

            // Trừ giảm giá vào tổng tiền
            total = total.subtract(discount);

            // Đảm bảo total không âm
            if (total.compareTo(BigDecimal.ZERO) < 0) {
                total = BigDecimal.ZERO;
            }
        }

        if (invoice.getHoanPhi() != null) total = total.subtract(invoice.getHoanPhi());
        if (invoice.getPhuPhi() != null) total = total.add(invoice.getPhuPhi());
        if (invoice.getPhiVanChuyen() != null) total = total.add(invoice.getPhiVanChuyen());


        invoice.setTongTien(total);

        hoaDonRepository.save(invoice);
    }

    private static BigDecimal getDiscount(PhieuGiamGia pgg, BigDecimal total) {
        BigDecimal discount = BigDecimal.ZERO;

        if (pgg.getHinhThuc().equalsIgnoreCase("VND")) {
            // Giảm giá cố định (VND)
            discount = pgg.getGiaTri();
        } else {
            // Giảm theo phần trăm
            BigDecimal percentage = pgg.getGiaTri().divide(new BigDecimal(100)); // Chuyển về hệ số phần trăm
            discount = total.multiply(percentage); // Tính số tiền giảm

            // Nếu giảm giá vượt quá mức tối đa, giới hạn lại
            if (discount.compareTo(pgg.getGiaTriToiDa()) > 0) {
                discount = pgg.getGiaTriToiDa();
            }
        }
        return discount;
    }    public List<HoaDon> hienThiHoaDonKhachHang(Integer idKhachHang) {
        return hoaDonRepository.findHoaDonByKhachHangId(idKhachHang);
    }

}

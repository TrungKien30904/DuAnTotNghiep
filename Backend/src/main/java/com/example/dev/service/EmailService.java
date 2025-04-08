package com.example.dev.service;

import com.example.dev.DTO.response.HoaDonChiTiet.SanPhamCartResponse;
import com.example.dev.entity.PhieuGiamGia;
import com.example.dev.entity.customer.KhachHang;
import com.example.dev.entity.invoice.HoaDon;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class EmailService {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm dd-MM-yyyy");
    private static final NumberFormat numberFormatter = NumberFormat.getNumberInstance(new Locale("vi", "VN"));
    @Autowired
    private JavaMailSender emailSender;

    @Async
    public void sendHtmlMessage(String to, String subject, String htmlBody) {
        new Thread(() -> {
            try {
                MimeMessage message = emailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(htmlBody, true);
                emailSender.send(message);
            } catch (MessagingException e) {
                throw new RuntimeException("Failed to send email", e);
            }
        }).start();
    }

    @Async
    public void sendStatusChangeEmail(KhachHang khachHang, PhieuGiamGia phieuGiamGia) {
        new Thread(() -> {
            String subject = "Thông báo thay đổi thời gian phiếu giảm giá";
            String ngayBatDauFormatted = phieuGiamGia.getNgayBatDau().format(formatter);
            String ngayKetThucFormatted = phieuGiamGia.getNgayKetThuc().format(formatter);
            String htmlBody = "<!DOCTYPE html>" + "<html>" + "<head>" + "<title>Coupon</title>" + "<link href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css\" rel=\"stylesheet\"/>" + "<style>" + "body { font-family: Arial, sans-serif; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }" + ".coupon-container { width: 100%; max-width: 600px; border: 5px solid #00bcd4; padding: 20px; text-align: center; background-color: #fff; position: relative; box-sizing: border-box; }" + ".coupon-container::before, .coupon-container::after { content: ''; position: absolute; width: 100%; height: 100%; background: url('https://placehold.co/600x600') no-repeat center center; background-size: cover; opacity: 0.1; top: 0; left: 0; }" + ".coupon-header { display: flex; justify-content: center; align-items: center; margin-bottom: 10px; }" + ".coupon-header img { width: 50px; height: auto; margin-right: 10px; }" + ".coupon-header h1 { font-size: 24px; color: #ff0000; margin: 0; }" + ".coupon-header h3 { font-size: 18px; color: #333; margin: 0; }" + ".coupon-code { background-color: #ff5722; color: #fff; padding: 10px; font-size: 18px; margin: 20px 0; }" + ".coupon-code span { display: block; background-color: #fff; color: #ff5722; padding: 10px; font-size: 24px; font-weight: bold; }" + ".discount { font-size: 24px; color: #333; margin: 20px 0; }" + ".discount span { color: #ff0000; }" + ".terms { font-size: 14px; color: #333; }" + ".terms span { color: #ff0000; }" + ".effective-date { font-size: 20px; color: #333; }" + ".footer { text-align: center; color: #777; font-size: 12px; padding-top: 10px; border-top: 1px solid #ddd; margin-top: 20px; }" + "@media (max-width: 480px) {" + "body { padding: 10px; }" + ".coupon-container { width: 100%; padding: 10px; }" + ".coupon-header h1, .coupon-header h3, .discount { font-size: 16px; }" + ".coupon-code span { font-size: 18px; }" + "}" + "</style>" + "</head>" + "<body>" + "<div class='coupon-container'>" + "<div class='coupon-header'>" + "<h1>Cenndiii Shop</h1>" + "</div>" + "<div class='coupon-header'>" + "<h3>Xin chào " + khachHang.getHoTen() + ",</h3>" + "</div>" + "<div class='coupon-header'>" + "<h3>Chúng tôi đã thay đổi thời gian hoạt động của phiếu giảm giá:</h3>" + "</div>" + "<div class='coupon-header'>" + "<h3> Tên phiếu giảm giá: " + phieuGiamGia.getTenKhuyenMai() + "</h3>" + "</div>" + "<div class='coupon-code'>Mã phiếu giảm giá:<span>" + phieuGiamGia.getMaKhuyenMai() + "</span></div>" + "<div class='effective-date'>Ngày bắt đầu: <span>" + ngayBatDauFormatted + "</span></div>" + "<div class='effective-date'>Ngày kết thúc: <span>" + ngayKetThucFormatted + "</span></div>" + "<div class='footer'>Trân trọng,<br/>Đội ngũ của chúng tôi</div>" + "</div>" + "</body>" + "</html>";
            sendHtmlMessage(khachHang.getEmail(), subject, htmlBody);
        }).start();
    }

    @Async
    public void sendUpdateChangeEmail(KhachHang khachHang, PhieuGiamGia phieuGiamGia) {
        new Thread(() -> {
            String subject = "Thông báo thay đổi chi tiết phiếu giảm giá";
            String ngayBatDauFormatted = phieuGiamGia.getNgayBatDau().format(formatter);
            String ngayKetThucFormatted = phieuGiamGia.getNgayKetThuc().format(formatter);
            String formattedGiaTriGiamGia = numberFormatter.format(phieuGiamGia.getGiaTri());
            String formattedDK = numberFormatter.format(phieuGiamGia.getDieuKien());
            String htmlBody = "<!DOCTYPE html>" + "<html>" + "<head>" + "<title>Coupon</title>" + "<link href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css\" rel=\"stylesheet\"/>" + "<style>" + "body { font-family: Arial, sans-serif; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }" + ".coupon-container { width: 100%; max-width: 600px; border: 5px solid #00bcd4; padding: 20px; text-align: center; background-color: #fff; position: relative; box-sizing: border-box; }" + ".coupon-container::before, .coupon-container::after { content: ''; position: absolute; width: 100%; height: 100%; background: url('https://placehold.co/600x600') no-repeat center center; background-size: cover; opacity: 0.1; top: 0; left: 0; }" + ".coupon-header { display: flex; justify-content: center; align-items: center; margin-bottom: 10px; }" + ".coupon-header img { width: 50px; height: auto; margin-right: 10px; }" + ".coupon-header h1 { font-size: 24px; color: #ff0000; margin: 0; }" + ".coupon-header h3 { font-size: 18px; color: #333; margin: 0; }" + ".coupon-code { background-color: #ff5722; color: #fff; padding: 10px; font-size: 18px; margin: 20px 0; }" + ".coupon-code span { display: block; background-color: #fff; color: #ff5722; padding: 10px; font-size: 24px; font-weight: bold; }" + ".discount { font-size: 24px; color: #333; margin: 20px 0; }" + ".discount span { color: #ff0000; }" + ".terms { font-size: 14px; color: #333; }" + ".terms span { color: #ff0000; }" + ".effective-date { font-size: 16px; color: #333; }" + ".footer { text-align: center; color: #777; font-size: 12px; padding-top: 10px; border-top: 1px solid #ddd; margin-top: 20px; }" + "@media (max-width: 480px) {" + "body { padding: 10px; }" + ".coupon-container { width: 100%; padding: 10px; }" + ".coupon-header h1, .coupon-header h3, .discount { font-size: 16px; }" + ".coupon-code span { font-size: 18px; }" + "}" + "</style>" + "</head>" + "<body>" + "<div class='coupon-container'>" + "<div class='coupon-header'>" + "<h1>Cenndiii Shop</h1>" + "</div>" + "<div class='coupon-header'>" + "<h3>Xin chào " + khachHang.getHoTen() + ",</h3>" + "</div>" + "<div class='coupon-header'>" + "<h3>Chúng tôi đã thay đổi chi tiết của phiếu giảm giá:</h3>" + "</div>" + "<div class='coupon-header'>" + "<h3> Tên phiếu giảm giá: " + phieuGiamGia.getTenKhuyenMai() + "</h3>" + "</div>" + "<div class='coupon-code'>Mã phiếu giảm giá:<span>" + phieuGiamGia.getMaKhuyenMai() + "</span></div>" + "<div class='discount'>Giá trị giảm: <span>" + formattedGiaTriGiamGia + " " + phieuGiamGia.getHinhThuc() + "</span></div>" + "<div class='effective-date'>Ngày bắt đầu: <span>" + ngayBatDauFormatted + "</span></div>" + "<div class='effective-date'>Ngày kết thúc: <span>" + ngayKetThucFormatted + "</span></div>" + "<div class='terms'>ÁP DỤNG CHO ĐƠN HÀNG TỐI THIỂU<br/><span>" + formattedDK + " VNĐ</span></div>" + "<div class='footer'>Trân trọng,<br/>Đội ngũ của chúng tôi</div>" + "</div>" + "</body>" + "</html>";
            sendHtmlMessage(khachHang.getEmail(), subject, htmlBody);
        }).start();
    }

    @Async
    public void sendDiscountEmailCaNhan(KhachHang customer, PhieuGiamGia phieuGiamGia) {
        new Thread(() -> {
            String subject = "Mã giảm giá của bạn";
            String ngayBatDauFormatted = phieuGiamGia.getNgayBatDau().format(formatter);
            String ngayKetThucFormatted = phieuGiamGia.getNgayKetThuc().format(formatter);
            String formattedGiaTriGiamGia = numberFormatter.format(phieuGiamGia.getGiaTri());
            String formattedDK = numberFormatter.format(phieuGiamGia.getDieuKien());
            String htmlBody = "<!DOCTYPE html>" + "<html>" + "<head>" + "<title>Coupon</title>" + "<link href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css\" rel=\"stylesheet\"/>" + "<style>" + "body { font-family: Arial, sans-serif; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }" + ".coupon-container { width: 100%; max-width: 600px; border: 5px solid #00bcd4; padding: 20px; text-align: center; background-color: #fff; position: relative; box-sizing: border-box; }" + ".coupon-container::before, .coupon-container::after { content: ''; position: absolute; width: 100%; height: 100%; background: url('https://placehold.co/600x600') no-repeat center center; background-size: cover; opacity: 0.1; top: 0; left: 0; }" + ".coupon-header { display: flex; justify-content: center; align-items: center; margin-bottom: 10px; }" + ".coupon-header img { width: 50px; height: auto; margin-right: 10px; }" + ".coupon-header h1 { font-size: 24px; color: #ff0000; margin: 0; }" + ".coupon-header h3 { font-size: 18px; color: #333; margin: 0; }" + ".coupon-code { background-color: #ff5722; color: #fff; padding: 10px; font-size: 18px; margin: 20px 0; }" + ".coupon-code span { display: block; background-color: #fff; color: #ff5722; padding: 10px; font-size: 24px; font-weight: bold; }" + ".discount { font-size: 24px; color: #333; margin: 20px 0; }" + ".discount span { color: #ff0000; }" + ".terms { font-size: 14px; color: #333; }" + ".terms span { color: #ff0000; }" + ".effective-date { font-size: 12px; color: #333; }" + ".footer { text-align: center; color: #777; font-size: 12px; padding-top: 10px; border-top: 1px solid #ddd; margin-top: 20px; }" + "@media (max-width: 480px) {" + "body { padding: 10px; }" + ".coupon-container { width: 100%; padding: 10px; }" + ".coupon-header h1, .coupon-header h3, .discount { font-size: 16px; }" + ".coupon-code span { font-size: 18px; }" + "}" + "</style>" + "</head>" + "<body>" + "<div class='coupon-container'>" + "<div class='coupon-header'>" + "<h1>Cenndiii Shop</h1>" + "</div>" + "<div class='coupon-header'>" + "<h3>Xin chào " + customer.getHoTen() + ",</h3>" + "</div>" + "<div class='coupon-header'>" + "<h3>Shop tặng riêng bạn phiếu giảm giá này</h3>" + "</div>" + "<div class='coupon-code'>HÃY NHẬP MÃ<span>" + phieuGiamGia.getMaKhuyenMai() + "</span></div>" + "<div class='discount'>Để Nhận Ngay Phiếu Giảm Giá: <span>" + formattedGiaTriGiamGia + " " + phieuGiamGia.getHinhThuc() + "</span></div>" + "<div class='effective-date'>Ngày bắt đầu: <span>" + ngayBatDauFormatted + "</span></div>" + "<div class='effective-date'>Ngày kết thúc: <span>" + ngayKetThucFormatted + "</span></div>" + "<div class='terms'>ÁP DỤNG CHO ĐƠN HÀNG TỐI THIỂU<br/><span>" + formattedDK + " VNĐ</span></div>" + "<div class='footer'>Trân trọng,<br/>Đội ngũ của chúng tôi</div>" + "</div>" + "</body>" + "</html>";
            sendHtmlMessage(customer.getEmail(), subject, htmlBody);
        }).start();
    }

    @Async
    public void sendDiscountEmailCongKhai(KhachHang customer, PhieuGiamGia phieuGiamGia) {
        new Thread(() -> {
            String subject = "Mã giảm giá của bạn";
            String ngayBatDauFormatted = phieuGiamGia.getNgayBatDau().format(formatter);
            String ngayKetThucFormatted = phieuGiamGia.getNgayKetThuc().format(formatter);
            String formattedGiaTriGiamGia = numberFormatter.format(phieuGiamGia.getGiaTri());
            String formattedDK = numberFormatter.format(phieuGiamGia.getDieuKien());
            String htmlBody = "<!DOCTYPE html>" + "<html>" + "<head>" + "<title>Coupon</title>" + "<link href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css\" rel=\"stylesheet\"/>" + "<style>" + "body { font-family: Arial, sans-serif; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }" + ".coupon-container { width: 100%; max-width: 600px; border: 5px solid #00bcd4; padding: 20px; text-align: center; background-color: #fff; position: relative; box-sizing: border-box; }" + ".coupon-container::before, .coupon-container::after { content: ''; position: absolute; width: 100%; height: 100%; background: url('https://placehold.co/600x600') no-repeat center center; background-size: cover; opacity: 0.1; top: 0; left: 0; }" + ".coupon-header { display: flex; justify-content: center; align-items: center; margin-bottom: 10px; }" + ".coupon-header img { width: 50px; height: auto; margin-right: 10px; }" + ".coupon-header h1 { font-size: 24px; color: #ff0000; margin: 0; }" + ".coupon-header h3 { font-size: 18px; color: #333; margin: 0; }" + ".coupon-code { background-color: #ff5722; color: #fff; padding: 10px; font-size: 18px; margin: 20px 0; }" + ".coupon-code span { display: block; background-color: #fff; color: #ff5722; padding: 10px; font-size: 24px; font-weight: bold; }" + ".discount { font-size: 24px; color: #333; margin: 20px 0; }" + ".discount span { color: #ff0000; }" + ".terms { font-size: 14px; color: #333; }" + ".terms span { color: #ff0000; }" + ".effective-date { font-size: 12px; color: #333; }" + ".footer { text-align: center; color: #777; font-size: 12px; padding-top: 10px; border-top: 1px solid #ddd; margin-top: 20px; }" + "@media (max-width: 480px) {" + "body { padding: 10px; }" + ".coupon-container { width: 100%; padding: 10px; }" + ".coupon-header h1, .coupon-header h3, .discount { font-size: 16px; }" + ".coupon-code span { font-size: 18px; }" + "}" + "</style>" + "</head>" + "<body>" + "<div class='coupon-container'>" + "<div class='coupon-header'>" + "<h1>Cenndiii Shop</h1>" + "</div>" + "<div class='coupon-header'>" + "<h3>Xin chào " + customer.getHoTen() + ",</h3>" + "</div>" + "<div class='coupon-header'>" + "<h3>Chúc mừng bạn đã nhận được phiếu giảm giá của chúng tôi</h3>" + "</div>" + "<div class='coupon-code'>HÃY NHẬP MÃ<span>" + phieuGiamGia.getMaKhuyenMai() + "</span></div>" + "<div class='discount'>Để Nhận Ngay Phiếu Giảm Giá: <span>" + formattedGiaTriGiamGia + " " + phieuGiamGia.getHinhThuc() + "</span></div>" + "<div class='effective-date'>Ngày bắt đầu: <span>" + ngayBatDauFormatted + "</span></div>" + "<div class='effective-date'>Ngày kết thúc: <span>" + ngayKetThucFormatted + "</span></div>" + "<div class='terms'>ÁP DỤNG CHO ĐƠN HÀNG TỐI THIỂU<br/><span>" + formattedDK + " VNĐ</span></div>" + "<div class='footer'>Trân trọng,<br/>Đội ngũ của chúng tôi</div>" + "</div>" + "</body>" + "</html>";
            sendHtmlMessage(customer.getEmail(), subject, htmlBody);
        }).start();
    }

    @Async
    public void sendApologyEmail(KhachHang customer, PhieuGiamGia phieuGiamGia) {
        new Thread(() -> {
            String subject = "Thư xin lỗi khách hàng";
            String htmlBody = "<!DOCTYPE html>" + "<html>" + "<head>" + "<title>Coupon</title>" + "<link href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css\" rel=\"stylesheet\"/>" + "<style>" + "body { font-family: Arial, sans-serif; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }" + ".coupon-container { width: 100%; max-width: 600px; border: 5px solid #00bcd4; padding: 20px; text-align: center; background-color: #fff; position: relative; box-sizing: border-box; }" + ".coupon-container::before, .coupon-container::after { content: ''; position: absolute; width: 100%; height: 100%; background: url('https://placehold.co/600x600') no-repeat center center; background-size: cover; opacity: 0.1; top: 0; left: 0; }" + ".coupon-header { display: flex; justify-content: center; align-items: center; margin-bottom: 10px; }" + ".coupon-header img { width: 50px; height: auto; margin-right: 10px; }" + ".coupon-header h1 { font-size: 24px; color: #ff0000; margin: 0; }" + ".coupon-header h3 { font-size: 18px; color: #333; margin: 0; }" + ".coupon-code { background-color: #ff5722; color: #fff; padding: 10px; font-size: 18px; margin: 20px 0; }" + ".coupon-code span { display: block; background-color: #fff; color: #ff5722; padding: 10px; font-size: 24px; font-weight: bold; }" + ".discount { font-size: 24px; color: #333; margin: 20px 0; }" + ".discount span { color: #ff0000; }" + ".terms { font-size: 14px; color: #333; }" + ".terms span { color: #ff0000; }" + ".effective-date { font-size: 12px; color: #333; }" + ".footer { text-align: center; color: #777; font-size: 12px; padding-top: 10px; border-top: 1px solid #ddd; margin-top: 20px; }" + "@media (max-width: 480px) {" + "body { padding: 10px; }" + ".coupon-container { width: 100%; padding: 10px; }" + ".coupon-header h1, .coupon-header h3, .discount { font-size: 16px; }" + ".coupon-code span { font-size: 18px; }" + "}" + "</style>" + "</head>" + "<body>" + "<div class='coupon-container'>" + "<div class='coupon-header'>" + "<h1>Cenndiii Shop</h1>" + "</div>" + "<div class='coupon-header'>" + "<h3>Xin chào " + customer.getHoTen() + ",</h3>" + "</div>" + "<div class='coupon-header'>" + "<h3>Vì một số lý do nên chúng tôi sẽ thu hồi phiếu giảm giá này</h3>" + "</div>" + "<div class='coupon-code'>MÃ PHIẾU GIẢM GIÁ<span>" + phieuGiamGia.getMaKhuyenMai() + "</span></div>" + "<div class='discount'>Rất mong quý khách hàng thông cảm !</div>" + "<div class='footer'>Trân trọng,<br/>Đội ngũ của chúng tôi</div>" + "</div>" + "</body>" + "</html>";
            sendHtmlMessage(customer.getEmail(), subject, htmlBody);
        }).start();
    }

    @Async
    public void sendOrderConfirmationEmail(String to, HoaDon hoaDon, List<SanPhamCartResponse> sanPhamList) {
        new Thread(() -> {
            String subject = "Xác nhận đơn hàng";

            StringBuilder htmlBody = new StringBuilder();
            htmlBody.append("<html><body style='font-family: Arial, sans-serif; line-height: 1.6;'>")
                    .append("<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;'>")
                    .append("<h1 style='color: #4CAF50; text-align: center;'>Đơn hàng của bạn đã được đặt thành công!</h1>")
                    .append("<p style='font-size: 16px;'>Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi. Dưới đây là chi tiết đơn hàng của bạn:</p>")
                    .append("<table style='width: 100%; margin-top: 20px; border-collapse: collapse;'>")
                    .append("<tr><td style='padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;'>Mã đơn hàng:</td>")
                    .append("<td style='padding: 10px; border-bottom: 1px solid #ddd;'>").append(hoaDon.getMaHoaDon()).append("</td></tr>")
                    .append("<tr><td style='padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;'>Tên người nhận:</td>")
                    .append("<td style='padding: 10px; border-bottom: 1px solid #ddd;'>").append(hoaDon.getTenNguoiNhan()).append("</td></tr>")
                    .append("<tr><td style='padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;'>Số điện thoại:</td>")
                    .append("<td style='padding: 10px; border-bottom: 1px solid #ddd;'>").append(hoaDon.getSoDienThoai()).append("</td></tr>")
                    .append("<tr><td style='padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;'>Phí vận chuyển:</td>")
                    .append("<td style='padding: 10px; border-bottom: 1px solid #ddd;'>").append(numberFormatter.format(hoaDon.getPhiVanChuyen())).append(" đ</td></tr>")
                    .append("<tr><td style='padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;'>Tổng tiền:</td>")
                    .append("<td style='padding: 10px; border-bottom: 1px solid #ddd;'>").append(numberFormatter.format(hoaDon.getTongTien())).append(" đ</td></tr>")
                    .append("<tr><td style='padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;'>Trạng thái:</td>")
                    .append("<td style='padding: 10px; border-bottom: 1px solid #ddd;'>").append(hoaDon.getTrangThai()).append("</td></tr>")
                    .append("</table>");

            // Danh sách sản phẩm
            htmlBody.append("<h2 style='color: #333; margin-top: 20px;'>Danh sách sản phẩm:</h2>")
                    .append("<ul style='list-style-type: none; padding: 0;'>");

            for (SanPhamCartResponse sp : sanPhamList) {
                htmlBody.append("<li style='display: flex; align-items: center; background-color: #ffffff; ")
                        .append("margin: 10px 0; padding: 12px; border-radius: 8px; border: 1px solid #ddd; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);'>")
                        .append("<img src='").append(sp.getAnhSanPham()).append("' alt='Ảnh sản phẩm' ")
                        .append("style='width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 12px;' />")
                        .append("<div style='flex-grow: 1;'>")
                        .append("<div style='color: #333; font-size: 14px; font-weight: 600;'>Tên: ").append(sp.getTenSanPham()).append("</div>")
                        .append("<div style='color: #666; font-size: 13px;'>Số lượng: <span style='font-weight: 500;'>").append(sp.getSoLuongMua()).append("</span></div>")
                        .append("<div style='color: #d32f2f; font-size: 13px; font-weight: bold;'>Giá: ").append(numberFormatter.format(sp.getGiaSauGiam())).append(" đ</div>")
                        .append("</div>")
                        .append("</li>");
            }

            htmlBody.append("</ul>")
                    .append("<p style='text-align: center; margin-top: 20px; font-size: 14px; color: #888;'>Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi!</p>")
                    .append("</div>")
                    .append("</body></html>");

            sendHtmlMessage(to, subject, htmlBody.toString());
        }).start();
    }

}

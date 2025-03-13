package com.example.dev.service.nhanvien;


import com.example.dev.entity.nhanvien.NhanVien;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailNhanVienService {
    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendHtmlMessage(String to, String subject, String htmlBody) {
        new Thread(() -> {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(htmlBody, true);
                mailSender.send(message);
            } catch (MessagingException e) {
                throw new RuntimeException("Failed to send email", e);
            }
        }).start();
    }

    @Async
    public void sendAccount(NhanVien nhanVien) {
        new Thread(() -> {
            if (nhanVien == null || nhanVien.getEmail() == null || nhanVien.getSoDienThoai() == null) {
                System.out.println("Lỗi: Nhân viên hoặc thông tin email không hợp lệ.");
                return;
            }
            String subject = "Tài khoản của bạn";
            String htmlBody = generateEmailContent(nhanVien);
            sendHtmlMessage(nhanVien.getEmail(), subject, htmlBody);
        }).start();
    }

    private String generateEmailContent(NhanVien nhanVien) {
        return String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                <title>Thông tin tài khoản</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                    .container { background: #fff; padding: 20px; border-radius: 10px; text-align: center; max-width: 400px; margin: auto; }
                    h1 { color: #ff5722; }
                    .account-info { font-size: 18px; margin: 20px 0; }
                    .footer { font-size: 12px; color: #555; margin-top: 20px; }
                </style>
                </head>
                <body>
                <div class='container'>
                    <h1>Chào %s,</h1>
                    <p class='account-info'>Tài khoản đăng nhập của bạn để đăng nhập shop Cendii là: %s</p>
                    <p class='account-info'>Mật khẩu: %s</p>
                    <p class='footer'>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
                </div>
                </body>
                </html>
                """, nhanVien.getTen(), nhanVien.getSoDienThoai(), nhanVien.getMatKhau());
    }
}

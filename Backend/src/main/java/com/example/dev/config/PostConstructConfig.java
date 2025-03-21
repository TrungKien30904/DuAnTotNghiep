package com.example.dev.config;

import com.example.dev.entity.nhanvien.NhanVien;
import com.example.dev.repository.NhanVienRepo;
import com.example.dev.repository.customer.KhachHangRepo;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PostConstructConfig {
    private final PasswordEncoder passwordEncoder;
    private final NhanVienRepo nhanVienRepo;

    @PostConstruct
    public void init() {
        NhanVien nv = nhanVienRepo.findBySoDienThoai("0397803267").orElse(null);
        if(nv == null) {
            NhanVien nv1 = new NhanVien();
            nv1.setSoDienThoai("0397803267");
            nv1.setCccd("037239339456");
            nv1.setEmail("abc@gmail.com");
            nv1.setTen("Admin 1");
            nv1.setGioiTinh("Nam");
            nv1.setTrangThai(true);
            nv1.setVaiTro("ADMIN");
            nv1.setMatKhau(passwordEncoder.encode("1234"));
            nhanVienRepo.save(nv1);
        }

    }
}

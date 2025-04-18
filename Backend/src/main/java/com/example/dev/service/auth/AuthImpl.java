package com.example.dev.service.auth;

import com.example.dev.DTO.UserLogin.UserLogin;
import com.example.dev.DTO.response.auth.LoginResponse;
import com.example.dev.entity.customer.KhachHang;
import com.example.dev.entity.nhanvien.NhanVien;
import com.example.dev.repository.NhanVienRepo;
import com.example.dev.repository.customer.KhachHangRepo;
import com.example.dev.repository.customer.KhachHangRepository;
import com.example.dev.security.JWTService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthImpl implements AuthService{

    private final KhachHangRepo khachHangRepository;
    private final NhanVienRepo nhanVienRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    @Override
    public LoginResponse login(String username, String password, boolean isCustomer) {

        if(isCustomer){
            KhachHang khachHang = khachHangRepository.findBySoDienThoai(username).orElse(null);
            if (khachHang != null) {
                if (passwordEncoder.matches(password,khachHang.getMatKhau())){
                    UserLogin userLogin = UserLogin.builder()
                            .id(khachHang.getIdKhachHang())
                            .userName(khachHang.getHoTen())
                            .phoneNum(khachHang.getSoDienThoai())
                            .permissions(List.of("CUSTOMER"))
                            .build();
                    return LoginResponse.builder()
                            .token(jwtService.generateToken(userLogin))
                            .refreshToken(jwtService.generateRefreshToken(userLogin))
                            .build();
                }
            }
        }else{
            NhanVien nhanVien = nhanVienRepository.findBySoDienThoai(username).orElse(null);
            if (nhanVien != null) {
                if (passwordEncoder.matches(password,nhanVien.getMatKhau())){
                    UserLogin userLogin = UserLogin.builder()
                            .id(nhanVien.getIdNhanVien())
                            .userName(nhanVien.getTen())
                            .phoneNum(nhanVien.getSoDienThoai())
                            .permissions(List.of(nhanVien.getVaiTro() ))
                            .build();
                    return LoginResponse.builder()
                            .token(jwtService.generateToken(userLogin))
                            .refreshToken(jwtService.generateRefreshToken(userLogin))
                            .build();
                }
            }
        }
        return null;
    }

    @Override
    public LoginResponse getToken(Authentication authentication) {
        UserLogin userLogin = (UserLogin) authentication.getPrincipal();
        return LoginResponse.builder()
                .token(jwtService.generateToken(userLogin))
                .refreshToken(jwtService.generateRefreshToken(userLogin))
                .build();
    }
}

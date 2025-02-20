package com.example.dev.validator;

import com.example.dev.entity.KhachHang;
import com.example.dev.repository.KhachHangRepo;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Component
public class KhachHangValidator {

    @Autowired
    private KhachHangRepo khachHangRepository;

    public void validateKhachHang(KhachHang khachHang, Integer existingCustomerId) throws BadRequestException {
        if (khachHang == null) {
            throw new BadRequestException("Dữ liệu khách hàng không để trống");
        }

        validateHoTen(khachHang.getHoTen());
        validateEmail(khachHang.getEmail(), existingCustomerId);
        validateSoDienThoai(khachHang.getSoDienThoai(), existingCustomerId);
    }

    private void validateHoTen(String hoTen) throws BadRequestException {
        if (!StringUtils.hasText(hoTen)) {
            throw new BadRequestException("Họ tên không được để trống");
        }
        if (!hoTen.trim().equals(hoTen) || hoTen.contains("  ")) {
            throw new BadRequestException("Họ tên không được chứa khoảng trắng ở đầu, cuối hoặc nhiều khoảng trắng liên tiếp");
        }
        if (!hoTen.matches("^[\\p{L}\\s]+$")) {
            throw new BadRequestException("Họ tên không được chứa ký tự đặc biệt hoặc số");
        }
        if (hoTen.length() < 3 || hoTen.length() > 255) {
            throw new BadRequestException("Họ tên phải lớn hơn 3 ký tự và không quá 255 ký tự");
        }
    }

    private void validateEmail(String email, Integer existingCustomerId) throws BadRequestException {
        if (!StringUtils.hasText(email)) {
            throw new BadRequestException("Email không được để trống");
        }
        email = email.trim();

        if (!email.matches("^[\\w-\\.]+@[\\w-]+\\.[a-zA-Z]{2,4}$")) {
            throw new BadRequestException("Email không đúng định dạng");
        }

        if (!email.contains(".") || !email.endsWith("@gmail.com")) {
            throw new BadRequestException("Email phải có dấu chấm và phải kết thúc bằng @gmail.com");
        }

        // Kiểm tra email trong database
        Optional<KhachHang> existingKhachHang = khachHangRepository.findByEmail(email);
        if (existingKhachHang.isPresent() && !existingKhachHang.get().getIdKhachHang().equals(existingCustomerId)) {
            throw new BadRequestException("Email đã tồn tại");
        }
    }


    private void validateSoDienThoai(String soDienThoai, Integer existingCustomerId) throws BadRequestException {
        if (!StringUtils.hasText(soDienThoai)) {
            throw new BadRequestException("Số điện thoại không được để trống");
        }
        if (!soDienThoai.matches("^0[0-9]{9}$")) {
            throw new BadRequestException("Số điện thoại không hợp lệ");
        }

        // Kiểm tra số điện thoại trong database
        Optional<KhachHang> existingKhachHang = khachHangRepository.findBySoDienThoai(soDienThoai);
        if (existingKhachHang.isPresent() && !existingKhachHang.get().getIdKhachHang().equals(existingCustomerId)) {
            throw new BadRequestException("Số điện thoại đã tồn tại");
        }
    }


    public boolean isEmailExists(String email) {
        return !khachHangRepository.findByEmail(email).isEmpty();
    }

    public boolean isSoDienThoaiExists(String soDienThoai) {
        return !khachHangRepository.findBySoDienThoai(soDienThoai).isEmpty();
    }
}
package com.example.dev.validator;

import com.example.dev.entity.customer.DiaChi;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class DiaChiValidator {
    public void validateDiaChi(DiaChi diaChi, Integer existingDiaChiId) throws BadRequestException {
        if (diaChi == null) {
            throw new BadRequestException("Dữ liệu địa chỉ không để trống");
        }

        validateTenNguoiNhan(diaChi.getTenNguoiNhan());
        validateSoDienThoai(diaChi.getSoDienThoai());
        validateDiaChiChiTiet(diaChi.getDiaChiChiTiet());
    }

    private void validateTenNguoiNhan(String tenNguoiNhan) throws BadRequestException {
        if (!StringUtils.hasText(tenNguoiNhan)) {
            throw new BadRequestException("Tên người nhận không để trống");
        }
        if (!tenNguoiNhan.trim().equals(tenNguoiNhan) || tenNguoiNhan.contains("  ")) {
            throw new BadRequestException("Tên người nhận không được chứa khoảng trắng ở đầu, cuối hoặc nhiều khoảng trắng liên tiếp");
        }
        if (!tenNguoiNhan.matches("^[\\p{L}\\s]+$")) {
            throw new BadRequestException("Tên người nhận không được chứa ký tự đặc biệt hoặc số");
        }
        if (tenNguoiNhan.length() < 3 || tenNguoiNhan.length() > 50) {
            throw new BadRequestException("Tên người nhận phải lớn hơn 3 ký tự và không quá 50 ký tự");
        }
    }

    private void validateSoDienThoai(String soDienThoai) throws BadRequestException {
        if (!StringUtils.hasText(soDienThoai)) {
            throw new BadRequestException("Số điện thoại không để trống");
        }
        if (!soDienThoai.matches("^[0-9]{10,15}$")) {
            throw new BadRequestException("Số điện thoại phải có từ 10 đến 15 chữ số và không chứa ký tự đặc biệt");
        }
    }
    private void validateDiaChi(Integer id, DiaChi diaChi) throws BadRequestException{
        if(id == null || diaChi == null){
            throw  new BadRequestException("Id hoặc địa chỉ không được phép NULL");
        }
    }

    private void validateDiaChiChiTiet(String diaChiChiTiet) throws BadRequestException {
        if (!StringUtils.hasText(diaChiChiTiet)) {
            throw new BadRequestException("Địa chỉ chi tiết không được để trống");
        }
        if (diaChiChiTiet.length() < 5 || diaChiChiTiet.length() > 255) {
            throw new BadRequestException("Địa chỉ chi tiết phải có từ 5 đến 255 ký tự");
        }
    }
}

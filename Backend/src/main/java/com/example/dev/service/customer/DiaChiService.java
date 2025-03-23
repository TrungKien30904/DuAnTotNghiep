package com.example.dev.service.customer;

import com.example.dev.entity.DiaChi;
import com.example.dev.entity.KhachHang;
import com.example.dev.exception.CustomExceptions;
import com.example.dev.repository.DiaChiRepo;
import com.example.dev.validator.DiaChiValidator;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DiaChiService {

    private DiaChiRepo diaChiRepo;

    private DiaChiValidator diaChiValidator;

    public Page<DiaChi> getAllAddresses(Pageable pageable) {
        return diaChiRepo.findAll(pageable);
    }

    public DiaChi getAddressById(Integer id) {
        DiaChi diaChi = diaChiRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("DiaChi not found with ID: " + id));

        return diaChi;
    }

    public DiaChi updateAddress(Integer id, DiaChi diaChi) throws CustomExceptions.CustomBadRequest, BadRequestException {
        diaChiValidator.validateDiaChi(diaChi, id);
        DiaChi existingDiaChi = diaChiRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("DiaChi not found with ID: " + id));


        DiaChi updatedDiaChi = diaChiRepo.save(existingDiaChi);

        return existingDiaChi;
    }

    public void deleteAddress(Integer id) throws CustomExceptions.CustomBadRequest {
        DiaChi diaChi = diaChiRepo.findById(id)
                .orElseThrow(() -> new CustomExceptions.CustomNotFoundException("DiaChi not found"));

        if (diaChi.isMacDinh()) {
            throw new CustomExceptions.CustomBadRequest("Không thể xóa địa chỉ mặc định");
        }

        diaChiRepo.delete(diaChi);
    }

//    public List<DiaChi> getMyAddressDTO() {
//        List<DiaChi> list = getMyAddress();
//        return list;
//    }

//    public List<DiaChi> getMyAddress() {
//        List<DiaChi> list = new ArrayList<>();
//        KhachHang khachHang = new KhachHang();
//        if (khachHang != null) {
//            list = diaChiRepo.findDiaChiByKhachHang(khachHang);
//        }
//        return list;
//    }
//
//    public boolean isPhoneNumberExists(String phone) {
//        return !diaChiRepo.findDiaChiBySoDienThoai(phone).isEmpty();
//    }
}

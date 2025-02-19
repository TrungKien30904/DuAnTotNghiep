package com.example.dev.service.nhanvien;

import com.example.dev.entity.nhanvien.NhanVien;
import com.example.dev.repository.NhanVienRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NhanVienService {
    @Autowired
    NhanVienRepo nhanVienRepo;

    public Page<NhanVien> getAllEmployees(Pageable pageable) {
        return nhanVienRepo.findAll(pageable);
    }

    public List<NhanVien> getNv(){
        return nhanVienRepo.findAll();
    }

    public boolean existsBySoDienThoai(String soDienThoai) {
        return nhanVienRepo.findBySoDienThoai(soDienThoai).isPresent();
    }

    public boolean existsByEmail(String email) {
        return nhanVienRepo.findByEmail(email).isPresent();
    }

    public boolean existsByCccd(String cccd) {
        return nhanVienRepo.findByCccd(cccd).isPresent();
    }

    public List<NhanVien> themNv(NhanVien nhanVien){
        nhanVienRepo.save(nhanVien);
        return getNv();
    }

    public List<NhanVien> suaNhanVien(NhanVien nhanVien, Integer id){
        nhanVienRepo.updateNhanVien(nhanVien.getTen(), nhanVien.getGioiTinh(), nhanVien.getNgaySinh(),nhanVien.getSoDienThoai(),nhanVien.getEmail(), nhanVien.getVaiTro()
        ,nhanVien.getTrangThai(),nhanVien.getHinh_anh(),nhanVien.getCccd(),nhanVien.getDiachi(), id);
        return getNv();
    }

    public NhanVien detail(Integer id){
        return nhanVienRepo.findById(id).orElse(null);
    }

    public List<NhanVien> searchEmployees(String ten, String soDienThoai, Boolean trangThai, LocalDate ngaySinh) {
        return nhanVienRepo.searchEmployees(ten, soDienThoai, trangThai, ngaySinh);
    }

    public Page<NhanVien> searchEmployees(String ten, String soDienThoai, Boolean trangThai, LocalDate ngaySinh, Pageable pageable) {
        return nhanVienRepo.searchEmployees(ten, soDienThoai, trangThai, ngaySinh,pageable);
    }

    public NhanVien findById(Integer id) {
        return nhanVienRepo.findById(id).orElse(null);
    }
}

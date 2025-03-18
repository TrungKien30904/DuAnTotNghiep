package com.example.dev.service.attribute;

import com.example.dev.entity.attribute.DanhMucSanPham;
import com.example.dev.repository.atriibute.DanhMucSanPhamRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class DanhMucService {
    @Autowired
    private DanhMucSanPhamRepo danhMucRepo;

    public List<DanhMucSanPham> getDanhMuc() {
        return danhMucRepo.findAll(Sort.by(Sort.Direction.DESC, "idDanhMuc"));
    }

    public List<DanhMucSanPham> getDanhMucs(String ten, Boolean trangThai) {
        if (ten != null && !ten.isEmpty() && trangThai != null) {
            return danhMucRepo.findByTenAndTrangThai(ten, trangThai);
        } else if (ten != null && !ten.isEmpty()) {
            return danhMucRepo.findByTen(ten);
        } else if (trangThai != null) {
            return danhMucRepo.findByTrangThai(trangThai);
        }
        return getDanhMuc();
    }

    public DanhMucSanPham themDanhMuc(DanhMucSanPham danhMuc) {
        return danhMucRepo.save(danhMuc);
    }

    public List<DanhMucSanPham> suaDanhMuc(DanhMucSanPham danhMuc, Integer id) {
        danhMuc.setIdDanhMuc(id);
        danhMucRepo.save(danhMuc);
        return getDanhMuc();
    }

    public boolean existsByName(String ten) {
        return danhMucRepo.existsByTen(ten);
    }

    public DanhMucSanPham findById(Integer id) {
        return danhMucRepo.findById(id).orElse(null);
    }
}

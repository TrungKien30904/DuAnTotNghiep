package com.example.dev.service.attribute;

import com.example.dev.entity.attribute.NhaCungCap;
import com.example.dev.repository.atriibute.NhaCungCapRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NhaCungCapService {
    @Autowired
    private NhaCungCapRepo nhaCungCapRepo;

    public List<NhaCungCap> getNhaCungCap() {
        return nhaCungCapRepo.findAll(Sort.by(Sort.Direction.DESC, "idNhaCungCap"));
    }

    public List<NhaCungCap> getNhaCungCaps(String ten, Boolean trangThai) {
        if (ten != null && !ten.isEmpty() && trangThai != null) {
            return nhaCungCapRepo.findByTenAndTrangThai(ten, trangThai);
        } else if (ten != null && !ten.isEmpty()) {
            return nhaCungCapRepo.findByTen(ten);
        } else if (trangThai != null) {
            return nhaCungCapRepo.findByTrangThai(trangThai);
        }
        return getNhaCungCap();
    }

    public NhaCungCap themNhaCungCap(NhaCungCap nhaCungCap) {
        return nhaCungCapRepo.save(nhaCungCap);
    }

    public List<NhaCungCap> suaNhaCungCap(NhaCungCap nhaCungCap, Integer id) {
        nhaCungCap.setIdNhaCungCap(id);
        nhaCungCapRepo.save(nhaCungCap);
        return getNhaCungCap();
    }

    public boolean existsByName(String ten) {
        return nhaCungCapRepo.existsByTen(ten);
    }

    public NhaCungCap findById(Integer id) {
        return nhaCungCapRepo.findById(id).orElse(null);
    }
}

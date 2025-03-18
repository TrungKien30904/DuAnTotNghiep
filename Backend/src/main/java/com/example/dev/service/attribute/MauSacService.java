package com.example.dev.service.attribute;

import com.example.dev.entity.attribute.MauSac;
import com.example.dev.repository.atriibute.MauSacRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class MauSacService {
    @Autowired
    private MauSacRepo mauSacRepo;

    public List<MauSac> getMauSac() {
        return mauSacRepo.findAll(Sort.by(Sort.Direction.DESC, "idMauSac"));
    }

    public List<MauSac> getMauSacs(String ten, Boolean trangThai) {
        if (ten != null && !ten.isEmpty() && trangThai != null) {
            return mauSacRepo.findByTenAndTrangThai(ten, trangThai);
        } else if (ten != null && !ten.isEmpty()) {
            return mauSacRepo.findByTen(ten);
        } else if (trangThai != null) {
            return mauSacRepo.findByTrangThai(trangThai);
        }
        return getMauSac();
    }

    public MauSac themMauSac(MauSac mauSac) {
        return mauSacRepo.save(mauSac);
    }

    public List<MauSac> suaMauSac(MauSac mauSac, Integer id) {
        mauSac.setIdMauSac(id);
        mauSacRepo.save(mauSac);
        return getMauSac();
    }

    public boolean existsByName(String ten) {
        return mauSacRepo.existsByTen(ten);
    }

    public MauSac findById(Integer id) {
        return mauSacRepo.findById(id).orElse(null);
    }
}

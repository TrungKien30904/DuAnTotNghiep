package com.example.dev.service.attribute;

import com.example.dev.entity.attribute.MuiGiay;
import com.example.dev.repository.atriibute.MuiGiayRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MuiGiayService {
    @Autowired
    private MuiGiayRepo muiGiayRepo;

    public List<MuiGiay> getMuiGiay() {
        return muiGiayRepo.findAll(Sort.by(Sort.Direction.DESC, "idMuiGiay"));
    }

    public List<MuiGiay> getMuiGiays(String ten, Boolean trangThai) {
        if (ten != null && !ten.isEmpty() && trangThai != null) {
            return muiGiayRepo.findByTenAndTrangThai(ten, trangThai);
        } else if (ten != null && !ten.isEmpty()) {
            return muiGiayRepo.findByTen(ten);
        } else if (trangThai != null) {
            return muiGiayRepo.findByTrangThai(trangThai);
        }
        return getMuiGiay();
    }

    public MuiGiay themMuiGiay(MuiGiay muiGiay) {
        return muiGiayRepo.save(muiGiay);
    }

    public List<MuiGiay> suaMuiGiay(MuiGiay muiGiay, Integer id) {
        muiGiay.setIdMuiGiay(id);
        muiGiayRepo.save(muiGiay);
        return getMuiGiay();
    }

    public boolean existsByName(String ten) {
        return muiGiayRepo.existsByTen(ten);
    }

    public MuiGiay findById(Integer id) {
        return muiGiayRepo.findById(id).orElse(null);
    }
}

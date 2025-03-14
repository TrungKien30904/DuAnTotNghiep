package com.example.dev.service.attribute;

import com.example.dev.entity.attribute.DeGiay;
import com.example.dev.repository.atriibute.DeGiayRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeGiayService {
    @Autowired
    private DeGiayRepo deGiayRepo;

    public List<DeGiay> getCoGiay() {
        return deGiayRepo.findAll(Sort.by(Sort.Direction.DESC, "idDeGiay"));
    }

    public List<DeGiay> getDeGiays(String ten, Boolean trangThai) {
        if (ten != null && !ten.isEmpty() && trangThai != null) {
            return deGiayRepo.findByTenAndTrangThai(ten, trangThai);
        } else if (ten != null && !ten.isEmpty()) {
            return deGiayRepo.findByTen(ten);
        } else if (trangThai != null) {
            return deGiayRepo.findByTrangThai(trangThai);
        }
        return getCoGiay();
    }

    public DeGiay themDeGiay(DeGiay deGiay) {
        return deGiayRepo.save(deGiay);
    }

    public List<DeGiay> suaDeGiay(DeGiay deGiay, Integer id) {
        deGiay.setIdDeGiay(id);
        deGiayRepo.save(deGiay);
        return getCoGiay();
    }

    public boolean existsByName(String ten) {
        return deGiayRepo.existsByTen(ten);
    }

    public DeGiay findById(Integer id) {
        return deGiayRepo.findById(id).orElse(null);
    }
}
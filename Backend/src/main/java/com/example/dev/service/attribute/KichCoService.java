package com.example.dev.service.attribute;

import com.example.dev.entity.attribute.KichCo;
import com.example.dev.repository.atriibute.KichCoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class KichCoService {
    @Autowired
    private KichCoRepo kichCoRepo;

    public List<KichCo> getKichCo() {
        return kichCoRepo.findAll(Sort.by(Sort.Direction.DESC, "idKichCo"));
    }

    public List<KichCo> getKichCos(String ten, Boolean trangThai) {
        if (ten != null && !ten.isEmpty() && trangThai != null) {
            return kichCoRepo.findByTenAndTrangThai(ten, trangThai);
        } else if (ten != null && !ten.isEmpty()) {
            return kichCoRepo.findByTen(ten);
        } else if (trangThai != null) {
            return kichCoRepo.findByTrangThai(trangThai);
        }
        return getKichCo();
    }

    public KichCo themKichCo(KichCo kichCo) {
        return kichCoRepo.save(kichCo);
    }

    public List<KichCo> suaKichCo(KichCo kichCo, Integer id) {
        kichCo.setIdKichCo(id);
        kichCoRepo.save(kichCo);
        return getKichCo();
    }

    public boolean existsByName(String ten) {
        return kichCoRepo.existsByTen(ten);
    }

    public KichCo findById(Integer id) {
        return kichCoRepo.findById(id).orElse(null);
    }
}

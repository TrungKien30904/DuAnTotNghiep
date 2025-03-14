package com.example.dev.service.attribute;

import com.example.dev.entity.attribute.CoGiay;
import com.example.dev.entity.attribute.DeGiay;
import com.example.dev.repository.atriibute.CoGiayRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service

public class CoGiayService {
    @Autowired
    CoGiayRepo coGiayRepo;

    public List<CoGiay> getCoGiay() {
        return coGiayRepo.findAll(Sort.by(Sort.Direction.DESC, "idCoGiay"));
    }

    public List<CoGiay> getCoGiays(String ten, Boolean trangThai) {
        if (ten != null && !ten.isEmpty() && trangThai != null) {
            return coGiayRepo.findByTenAndTrangThai(ten, trangThai);
        } else if (ten != null && !ten.isEmpty()) {
            return coGiayRepo.findAllByTen(ten);
        } else if (trangThai != null) {
            return coGiayRepo.findByTrangThai(trangThai);
        } else {
            return getCoGiay();
        }
    }

    public List<CoGiay> getCoGiayBan(){
        return coGiayRepo.findAllByTrangThaiIsTrue();
    }
//    public List<CoGiay> themCoGiay(CoGiay cg){
//        coGiayRepo.save(cg);
//        return getCoGiay();
//    }

    public boolean existsByName(String ten) {
        return coGiayRepo.findByTen(ten).isPresent();
    }

    public List<CoGiay> themCoGiay(CoGiay cg) {
        // Kiểm tra xem tên giày đã tồn tại hay chưa
        coGiayRepo.save(cg);
        return getCoGiay();
    }

    public List<CoGiay> suaCoGiay(CoGiay cg,Integer id){
        cg.setIdCoGiay(id);
        coGiayRepo.save(cg);
        return getCoGiay();
    }

    public CoGiay findById(Integer id) {
        return coGiayRepo.findById(id).orElse(null);
    }
}
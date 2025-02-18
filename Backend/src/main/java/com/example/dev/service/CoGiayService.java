package com.example.dev.service;

import com.example.dev.entity.attribute.CoGiay;
import com.example.dev.repository.CoGiayRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class CoGiayService {
    @Autowired
    CoGiayRepo coGiayRepo;

    public List<CoGiay> getCoGiay(){
        return coGiayRepo.findAll();
    }
    public List<CoGiay> getCoGiayBan(){
        return coGiayRepo.findAllByTrangThaiIsTrue();
    }
    public CoGiay themCoGiay(CoGiay cg){
        coGiayRepo.save(cg);
        return cg;
    }

    public List<CoGiay> suaCoGiay(CoGiay cg,Integer id){
        cg.setIdCoGiay(id);
        coGiayRepo.save(cg);
        return getCoGiay();
    }
}

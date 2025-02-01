package com.example.dev.service;

import com.example.dev.entity.DeGiay;
import com.example.dev.repository.DeGiayRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class DeGiayService {
    @Autowired
    DeGiayRepo deGiayRepo;

    public List<DeGiay> getDeGiay(){
        return deGiayRepo.findAll();
    }

    public List<DeGiay> themDeGiay(DeGiay dg){
        deGiayRepo.save(dg);
        return getDeGiay();
    }

    public List<DeGiay> suaDeGiay(DeGiay dg,Integer id){
        dg.setIdDeGiay(id);
        deGiayRepo.save(dg);
        return getDeGiay();
    }
}

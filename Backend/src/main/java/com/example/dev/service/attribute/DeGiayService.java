package com.example.dev.service.attribute;

import com.example.dev.entity.attribute.DeGiay;
import com.example.dev.repository.attribute.DeGiayRepo;
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

    public List<DeGiay> getDeGiayBan(){
        return deGiayRepo.findAllByTrangThaiIsTrue();
    }

    public DeGiay themDeGiay(DeGiay dg){
        deGiayRepo.save(dg);
        return dg;
    }

    public List<DeGiay> suaDeGiay(DeGiay dg,Integer id){
        dg.setIdDeGiay(id);
        deGiayRepo.save(dg);
        return getDeGiay();
    }
}

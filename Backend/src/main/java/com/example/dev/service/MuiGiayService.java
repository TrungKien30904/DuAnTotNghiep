package com.example.dev.service;

import com.example.dev.entity.MuiGiay;
import com.example.dev.repository.MuiGiayRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MuiGiayService {
    @Autowired
    MuiGiayRepo muiGiayRepo;

    public List<MuiGiay> getMg(){
        return muiGiayRepo.findAll();
    }

    public List<MuiGiay> themMuiGiay(MuiGiay mg){
        muiGiayRepo.save(mg);
        return getMg();
    }

    public List<MuiGiay> suaMuiGiay(MuiGiay mg,Integer id){
        mg.setIdMuiGiay(id);
        muiGiayRepo.save(mg);
        return getMg();
    }
}

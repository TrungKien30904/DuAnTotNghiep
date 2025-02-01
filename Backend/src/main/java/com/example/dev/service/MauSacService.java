package com.example.dev.service;

import com.example.dev.entity.MauSac;
import com.example.dev.repository.MauSacRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class MauSacService {
    @Autowired
    MauSacRepo mauSacRepo;

    public List<MauSac> getMs(){
        return mauSacRepo.findAll();
    }

    public List<MauSac> themMauSac(MauSac ms){
        mauSacRepo.save(ms);
        return getMs();
    }

    public List<MauSac> suaMauSac(MauSac ms,Integer id){
        ms.setIdMauSac(id);
        mauSacRepo.save(ms);
        return getMs();
    }
}

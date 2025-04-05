package com.example.dev.service.attribute;

import com.example.dev.entity.attribute.MauSac;
import com.example.dev.repository.attribute.MauSacRepo;
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

    public List<MauSac> getMauSacBan(){
        return mauSacRepo.findAllByTrangThaiIsTrue();
    }

    public MauSac themMauSac(MauSac ms){
        MauSac check =  mauSacRepo.findMauSacByTenEqualsIgnoreCase(ms.getTen());
        if(check == null){
            mauSacRepo.save(ms);
            return ms;
        }
        return null;
    }

    public List<MauSac> suaMauSac(MauSac ms,Integer id){
        ms.setIdMauSac(id);
        mauSacRepo.save(ms);
        return getMs();
    }
}

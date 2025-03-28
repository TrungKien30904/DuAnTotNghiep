package com.example.dev.service.attribute;

import com.example.dev.entity.attribute.KichCo;
import com.example.dev.repository.attribute.KichCoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class KichCoService {
    @Autowired
    KichCoRepo kichCoRepo;

    public List<KichCo> getKc(){
        return kichCoRepo.findAll();
    }

    public List<KichCo> getKichCoBan(){
        return kichCoRepo.findAllByTrangThaiIsTrue();
    }

    public KichCo themKichCo(KichCo kc){
        KichCo check = kichCoRepo.findKichCoByTenEqualsIgnoreCase(kc.getTen());
        if(check == null){
            kichCoRepo.save(kc);
            return kc;
        }
        return null;
    }

    public List<KichCo> suaKichCo(KichCo kc,Integer id){
        kc.setIdKichCo(id);
        kichCoRepo.save(kc);
        return getKc();
    }
}

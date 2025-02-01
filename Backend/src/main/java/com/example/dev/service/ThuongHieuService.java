package com.example.dev.service;

import com.example.dev.entity.ThuongHieu;
import com.example.dev.repository.ThuongHieuRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThuongHieuService {
    @Autowired
    ThuongHieuRepo thuongHieuRepo;

    public List<ThuongHieu> getTh(){
        return thuongHieuRepo.findAll();
    }

    public List<ThuongHieu> themThuongHieu(ThuongHieu thuongHieu){
        thuongHieuRepo.save(thuongHieu);
        return getTh();
    }

    public List<ThuongHieu> suaThuongHieu(ThuongHieu thuongHieu,Integer id){
        thuongHieu.setIdThuongHieu(id);
        thuongHieuRepo.save(thuongHieu);
        return getTh();
    }
}

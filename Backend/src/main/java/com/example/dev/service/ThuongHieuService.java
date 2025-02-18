package com.example.dev.service;

import com.example.dev.entity.attribute.ThuongHieu;
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

    public List<ThuongHieu> getThuongHieuBan(){
        return thuongHieuRepo.findAllByTrangThaiIsTrue();
    }
    public ThuongHieu themThuongHieu(ThuongHieu thuongHieu){
        thuongHieuRepo.save(thuongHieu);
        return thuongHieu;
    }

    public List<ThuongHieu> suaThuongHieu(ThuongHieu thuongHieu,Integer id){
        thuongHieu.setIdThuongHieu(id);
        thuongHieuRepo.save(thuongHieu);
        return getTh();
    }
}

package com.example.dev.service;

import com.example.dev.entity.attribute.NhaCungCap;
import com.example.dev.repository.NhaCungCapRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NhaCungCapService {
    @Autowired
    NhaCungCapRepo nhaCungCapRepo;

    public List<NhaCungCap> getNcc(){
        return nhaCungCapRepo.findAll();
    }

    public List<NhaCungCap> getNhaCungCapBan(){
        return nhaCungCapRepo.findAllByTrangThaiIsTrue();
    }
    public NhaCungCap themNhaCungCap(NhaCungCap ncc){
        nhaCungCapRepo.save(ncc);
        return ncc;
    }

    public List<NhaCungCap> suaNhaCungCap(NhaCungCap ncc,Integer id){
        ncc.setIdNhaCungCap(id);
        nhaCungCapRepo.save(ncc);
        return getNcc();
    }
}

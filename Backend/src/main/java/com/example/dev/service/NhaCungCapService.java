package com.example.dev.service;

import com.example.dev.entity.NhaCungCap;
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

    public List<NhaCungCap> themNhaCungCap(NhaCungCap ncc){
        nhaCungCapRepo.save(ncc);
        return getNcc();
    }

    public List<NhaCungCap> suaNhaCungCap(NhaCungCap ncc,Integer id){
        ncc.setIdNhaCungCap(id);
        nhaCungCapRepo.save(ncc);
        return getNcc();
    }
}

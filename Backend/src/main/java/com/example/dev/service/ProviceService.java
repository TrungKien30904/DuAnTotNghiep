package com.example.dev.service;

import com.example.dev.entity.Province;
import com.example.dev.repository.ProvinceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProviceService {
    @Autowired
    ProvinceRepository provinceRepository;

    public List<Province> findAll() {
        return provinceRepository.findAll();
    }
}

package com.example.dev.service.customer;

import com.example.dev.entity.customer.Province;
import com.example.dev.repository.customer.ProvinceRepository;
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

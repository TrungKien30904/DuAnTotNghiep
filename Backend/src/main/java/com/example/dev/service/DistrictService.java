package com.example.dev.service;

import com.example.dev.entity.District;
import com.example.dev.repository.DistrictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DistrictService {

    @Autowired
    private DistrictRepository districtRepository;

    public List<District> getDistrict(int provinceId){
        return districtRepository.findDistrictByProvinceId(provinceId);
    }

    public List<District> getAll(){
        return districtRepository.findAll();
    }
}

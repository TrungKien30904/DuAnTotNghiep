package com.example.dev.service.customer;

import com.example.dev.entity.customer.Ward;
import com.example.dev.repository.customer.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WardService {
    @Autowired
    private WardRepository wardRepository;

    public List<Ward> getWards(int districtId) {
        try{
            return wardRepository.findWardByDistrictId(districtId);
        }
        catch (Exception e){
            return null;
        }
    }

    public List<Ward> getAll() {
        try{
            return wardRepository.findAll();
        }
        catch (Exception e){
            return null;
        }
    }
}

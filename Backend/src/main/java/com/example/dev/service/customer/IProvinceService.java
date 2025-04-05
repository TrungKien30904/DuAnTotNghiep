package com.example.dev.service.customer;

import com.example.dev.mapper.DistrictMapper;
import com.example.dev.mapper.ProvinceMapper;
import com.example.dev.mapper.WardMapper;
import com.example.dev.model.ProvinceModel;
import org.springframework.stereotype.Service;

import java.util.List;

public interface IProvinceService {
    List<ProvinceMapper> getProvinceModel();
    List<DistrictMapper> getDistrictModel(Integer provinceId);
    List<WardMapper> getWardModel(Integer districtId);
    ProvinceModel getProvinceModel(Integer id);
}

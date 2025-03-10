package com.example.dev.service.customer;

import com.example.dev.mapper.DistrictMapper;
import com.example.dev.mapper.ProvinceMapper;
import com.example.dev.mapper.WardMapper;
import com.example.dev.model.DistrictModel;
import com.example.dev.model.ProvinceModel;
import com.example.dev.model.WardModel;
import com.example.dev.service.customer.IProvinceService;
import com.example.dev.util.IRestService;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.util.List;

@Service
public class ProvinceServiceImpl implements IProvinceService {

    private final IRestService restService;

    public ProvinceServiceImpl(IRestService restService){
        this.restService = restService;
    }

    @Override
    public List<ProvinceMapper> getProvinceModel() {
        try{
            String url = "https://provinces.open-api.vn/api/p";
            String objects =  this.restService.callRestUrl(url, null);
            if(objects != null){
                Type types = new TypeToken<List<ProvinceModel>>(){}.getType();
                Gson gson = new Gson();
                List<ProvinceModel> models =  gson.fromJson(objects, types);
                return models.stream().map(ProvinceModel::toProvinceMapper).toList();
            }
            return null;
        }catch (Exception e){
            return null;
        }
    }
    @Override
    public List<DistrictMapper> getDistrictModel(Integer provinceId) {
        try{
            String url = "https://provinces.open-api.vn/api/p/{id}?depth=2";
            String objects =  this.restService.callRestUrl(url, provinceId);
            if(objects != null){
                Type types = new TypeToken<ProvinceModel>(){}.getType();
                Gson gson = new Gson();
                ProvinceModel model =  gson.fromJson(objects, types);
                return model.getDistricts().stream().map(DistrictModel::toDistrictMapper).toList();
            }
            return null;
        }catch (Exception e){
            return null;
        }
    }
    @Override
    public List<WardMapper> getWardModel(Integer districtId) {
        try{
            String url = "https://provinces.open-api.vn/api/d/{id}?depth=2";
            String objects =  this.restService.callRestUrl(url, districtId);
            if(objects != null){
                Type types = new TypeToken<DistrictModel>(){}.getType();
                Gson gson = new Gson();
                DistrictModel model =  gson.fromJson(objects, types);
                return model.getWards().stream().map(WardModel::toWardMapper).toList();
            }
            return null;
        }catch (Exception e){
            return null;
        }
    }

    @Override
    public ProvinceModel getProvinceModel(Integer id) {
        try{
            String url = "https://provinces.open-api.vn/api/p/{id}?depth=3";
            String objects =  this.restService.callRestUrl(url, id);
            if(objects != null){
                Type types = new TypeToken<ProvinceModel>(){}.getType();
                Gson gson = new Gson();
                return gson.fromJson(objects, types);
            }
            return null;
        }catch (Exception e){
            return null;
        }
    }
}

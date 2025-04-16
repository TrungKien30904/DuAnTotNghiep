package com.example.dev.service.attribute;

import com.example.dev.DTO.request.SearchRequest.SearchRequest;
import com.example.dev.DTO.response.SearchResponse.SearchResponse;
import com.example.dev.entity.attribute.ThuongHieu;
import com.example.dev.repository.attribute.ThuongHieuRepo;
import com.example.dev.util.Page.GeneratePageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    public void suaThuongHieu(ThuongHieu thuongHieu){
        thuongHieuRepo.save(thuongHieu);
    }
}

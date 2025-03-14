package com.example.dev.service.invoice;

import com.example.dev.DTO.request.HoaDonChiTiet.HoaDonChiTietRequest;
import com.example.dev.entity.invoice.HoaDonChiTiet;
import com.example.dev.repository.invoice.HoaDonChiTietRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HoaDonChiTietService {

    @Autowired
    public HoaDonChiTietRepository hoaDonChiTiehoRepository;

    //123
    public List<HoaDonChiTiet> findByMaHoaDon(String maHoaDon) {
        return hoaDonChiTiehoRepository.findByHoaDon_MaHoaDon(maHoaDon);
    }

    public List<HoaDonChiTiet> findByIdHoaDon(Integer idHoaDon) {
        return hoaDonChiTiehoRepository.findAllByHoaDon_IdHoaDon(idHoaDon);
    }

    public void softDelete(Integer id){
        hoaDonChiTiehoRepository.softDelete(id);
    }

    public List<HoaDonChiTietRequest> getCartByIdInvoice(Integer idHoaDon) {
        return hoaDonChiTiehoRepository.listCart(idHoaDon);
    }

}

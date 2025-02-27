package com.example.dev.controller;

import com.example.dev.entity.HoaDonChiTiet;
import com.example.dev.service.HoaDonChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("HoaDonChiTiet")
public class HoaDonChiTietController {

    @Autowired
    private HoaDonChiTietService hoaDonChiTietService;

    //123
    @GetMapping("/listHoaDonChiTiet")
    public List<HoaDonChiTiet> findByIdHoaDon(@RequestParam("maHoaDon") String maHoaDon) {
        return hoaDonChiTietService.findByIdHoaDon(maHoaDon);
    }
}

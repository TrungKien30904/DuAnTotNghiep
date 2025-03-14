package com.example.dev.mapper;

import com.example.dev.DTO.request.ChiTietSanPham.ChiTietSanPhamRequest;
import com.example.dev.entity.ChiTietSanPham;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ChiTietSanPhamMapper {
    ChiTietSanPham dtoToEntity (ChiTietSanPhamRequest dto);

    ChiTietSanPhamRequest entityToDto(ChiTietSanPham entity);
}

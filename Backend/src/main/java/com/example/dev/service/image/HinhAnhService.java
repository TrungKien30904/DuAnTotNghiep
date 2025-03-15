package com.example.dev.service.image;

import com.example.dev.entity.HinhAnh;
import com.example.dev.repository.HinhAnhRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HinhAnhService {

    private final HinhAnhRepo hinhAnhRepo;

    public List<HinhAnh> getAllImageByProduct(Integer productId) {
        return hinhAnhRepo.findImageByProduct(productId);
    }
}

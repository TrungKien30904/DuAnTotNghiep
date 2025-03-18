package com.example.dev.service.attribute;

import com.example.dev.entity.attribute.ThuongHieu;
import com.example.dev.repository.atriibute.ThuongHieuRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThuongHieuService {
    @Autowired
    private ThuongHieuRepo thuongHieuRepo;

    public List<ThuongHieu> getThuongHieu() {
        return thuongHieuRepo.findAll(Sort.by(Sort.Direction.DESC, "idThuongHieu"));
    }

    public List<ThuongHieu> getThuongHieus(String ten, Boolean trangThai) {
        if (ten != null && !ten.isEmpty() && trangThai != null) {
            return thuongHieuRepo.findByTenAndTrangThai(ten, trangThai);
        } else if (ten != null && !ten.isEmpty()) {
            return thuongHieuRepo.findByTen(ten);
        } else if (trangThai != null) {
            return thuongHieuRepo.findByTrangThai(trangThai);
        }
        return getThuongHieu();
    }

    public ThuongHieu themThuongHieu(ThuongHieu thuongHieu) {
        return thuongHieuRepo.save(thuongHieu);
    }

    public List<ThuongHieu> suaThuongHieu(ThuongHieu thuongHieu, Integer id) {
        thuongHieu.setIdThuongHieu(id);
        thuongHieuRepo.save(thuongHieu);
        return getThuongHieu();
    }

    public boolean existsByName(String ten) {
        return thuongHieuRepo.existsByTen(ten);
    }

    public ThuongHieu findById(Integer id) {
        return thuongHieuRepo.findById(id).orElse(null);
    }
}

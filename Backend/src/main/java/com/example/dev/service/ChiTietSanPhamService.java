package com.example.dev.service;

import com.example.dev.DTO.request.ChiTietSanPham.ChiTietSanPhamRequest;
import com.example.dev.DTO.response.ChiTietSanPham.BienTheResponse;
import com.example.dev.DTO.response.ChiTietSanPham.ChiTietSanPhamResponse;
import com.example.dev.DTO.response.CloudinaryResponse;
import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.entity.HinhAnh;
import com.example.dev.repository.ChiTietSanPhamRepo;
import com.example.dev.repository.HinhAnhRepo;
import com.example.dev.repository.MauSacRepo;
import com.example.dev.repository.SanPhamRepo;
import com.example.dev.util.FileUpLoadUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChiTietSanPhamService {
    @Autowired
    ChiTietSanPhamRepo chiTietSanPhamRepo;

    @Autowired
    CloudinaryService cloudinaryService;

    @Autowired
    HinhAnhRepo hinhAnhRepo;

    private final List<ChiTietSanPham> listId = new ArrayList<>();
    @Autowired
    private SanPhamRepo sanPhamRepo;
    @Autowired
    private MauSacRepo mauSacRepo;

    public List<ChiTietSanPham> getListChiTietSanPham() {
        return chiTietSanPhamRepo.findAll();
    }

    public List<ChiTietSanPham> getListChiTietSanPham(Integer idSanPham) {
        return chiTietSanPhamRepo.findAll().stream().filter(ctsp -> ctsp.getSanPham().getIdSanPham().equals(idSanPham)).toList();
    }

    public ChiTietSanPham getChiTietSanPham(Integer id) {
        return chiTietSanPhamRepo.findById(id).get();
    }

    public Integer themChiTietSanPham(ChiTietSanPhamResponse dto) {
        ChiTietSanPham ctsp = null;
        List<ChiTietSanPham> chiTietSanPhams = getListChiTietSanPham();
        for (BienTheResponse dt : dto.getBienThe()) {
            ctsp = new ChiTietSanPham();
            ctsp.setSanPham(dto.getSanPham());
            ctsp.setCoGiay(dto.getCoGiay());
            ctsp.setDeGiay(dto.getDeGiay());
            ctsp.setMuiGiay(dto.getMuiGiay());
            ctsp.setChatLieu(dto.getChatLieu());
            ctsp.setThuongHieu(dto.getThuongHieu());
            ctsp.setNhaCungCap(dto.getNhaCungCap());
            ctsp.setDanhMucSanPham(dto.getDanhMuc());
            ctsp.setMoTa(dto.getMoTa());
            ctsp.setNgayTao(LocalDateTime.now());
            ctsp.setNguoiTao("Admin");
            ctsp.setMauSac(dt.getMauSac());
            ctsp.setKichCo(dt.getKichCo());
            ctsp.setGia(dt.getGia());
            ctsp.setSoLuong(dt.getSoLuong());
            ctsp.setMa(dt.getMauSac().getTen() + dt.getKichCo().getTen());
            boolean isUpdate = false;
            if (!chiTietSanPhams.isEmpty()) {
                for (ChiTietSanPham c : getListChiTietSanPham(ctsp.getSanPham().getIdSanPham())) {
                    if (isEqual(c, ctsp)) {
                        c.setSoLuong(c.getSoLuong() + ctsp.getSoLuong());
                        c.setGia(ctsp.getGia());
                        chiTietSanPhamRepo.save(c);
                        isUpdate = true;
                    }
                }
            } else {
                chiTietSanPhamRepo.save(ctsp);
                isUpdate = true;
            }
            if (!isUpdate) {
                chiTietSanPhamRepo.save(ctsp);
            }
        }
        assert ctsp != null;
        return ctsp.getSanPham().getIdSanPham();
    }

    public List<ChiTietSanPhamRequest> suaChiTietSanPham(ChiTietSanPham ctsp, Integer id) {
        ctsp.setIdChiTietSanPham(id);
        ChiTietSanPham find = chiTietSanPhamRepo.findById(id).get();
        if (isEqual(ctsp, find)) {
            find.setSoLuong(ctsp.getSoLuong() + find.getSoLuong());
            find.setGia(ctsp.getGia());
        }
        chiTietSanPhamRepo.save(ctsp);
        return getPage(id, 0, 3);
    }

    public List<ChiTietSanPhamRequest> getPage(Integer idSanPham, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);
        List<ChiTietSanPhamRequest> request = new ArrayList<>();
        List<ChiTietSanPham> list = chiTietSanPhamRepo.findBySanPham_IdSanPham(idSanPham, pageable);
        return getChiTietSanPhamRequests(request, list);
    }

    public int totalPage(Integer id) {
        return chiTietSanPhamRepo.findAll().stream().filter(ctsp -> ctsp.getSanPham().getIdSanPham().equals(id)).toList().size();
    }

    public ChiTietSanPham doiTrangThai(Integer idSanPham, Integer idChiTietSanPham, int trangThai) {
        ChiTietSanPham newCtsp = new ChiTietSanPham();
        for (ChiTietSanPham ctsp : getListChiTietSanPham(idSanPham)) {
            if (ctsp.getIdChiTietSanPham().equals(idChiTietSanPham)) {
                ctsp.setTrangThai(trangThai != 1);
                newCtsp = chiTietSanPhamRepo.save(ctsp);
            }
        }
        return newCtsp;
    }


    public boolean isEqual(ChiTietSanPham c1, ChiTietSanPham c2) {
        return c1.getSanPham().getIdSanPham().equals(c2.getSanPham().getIdSanPham()) && c1.getChatLieu().getIdChatLieu().equals(c2.getChatLieu().getIdChatLieu()) && c1.getCoGiay().getIdCoGiay().equals(c2.getCoGiay().getIdCoGiay()) && c1.getDanhMucSanPham().getIdDanhMuc().equals(c2.getDanhMucSanPham().getIdDanhMuc()) && c1.getDeGiay().getIdDeGiay().equals(c2.getDeGiay().getIdDeGiay()) && c1.getKichCo().getIdKichCo().equals(c2.getKichCo().getIdKichCo()) && c1.getMauSac().getIdMauSac().equals(c2.getMauSac().getIdMauSac()) && c1.getMuiGiay().getIdMuiGiay().equals(c2.getMuiGiay().getIdMuiGiay()) && c1.getNhaCungCap().getIdNhaCungCap().equals(c2.getNhaCungCap().getIdNhaCungCap()) && c1.getThuongHieu().getIdThuongHieu().equals(c2.getThuongHieu().getIdThuongHieu());
    }

    @Transactional
    public void uploadImage(final List<MultipartFile> file, List<String> listTenMau, Integer idSanPham) {
        if (!file.isEmpty()) {
//            for(String publicId : hinhAnhRepo.publicId(idSanPham)) {
//                this.cloudinaryService.deleteImage(publicId);
//            }
            for (int i = 0; i < file.size(); i++) {
                //Tao hinh anh
                HinhAnh anh = new HinhAnh();
                anh.setSanPham(sanPhamRepo.findById(idSanPham).get());

                // du lieu tu fe
                MultipartFile f = file.get(i);
                String tenMau = listTenMau.get(i);

                // xoa neu ton tai anh cu
//                for (String publicId : hinhAnhRepo.publicId(String.valueOf(idSanPham),tenMau.substring(1,7))){
//                    this.cloudinaryService.deleteImage(publicId);
//                }

                // lay ten file
                final String fileName = FileUpLoadUtil.getFileName(f.getOriginalFilename());
                // kiem tra dinh dang
                FileUpLoadUtil.assertAllowed(f, FileUpLoadUtil.IMAGE_PATTERN);
                // tai anh
                final CloudinaryResponse response = this.cloudinaryService.uploadFile(f, fileName, tenMau, idSanPham);


                anh.setMauSac(mauSacRepo.findMauSacByTenEqualsIgnoreCase(tenMau));
                anh.setIdHinhAnh(response.getPublicId());
                anh.setLienKet(response.getUrl());
                anh.setNgayTao(LocalDateTime.now());
                anh.setNguoiTao("admin");
                anh.setTrangThai(true);
                this.hinhAnhRepo.save(anh);
            }
        } else {
            System.out.println("File is empty");
        }


    }

    public List<ChiTietSanPhamRequest> timKiem(String search, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);
        List<ChiTietSanPhamRequest> request = new ArrayList<>();
        List<ChiTietSanPham> list = chiTietSanPhamRepo.searchs(search, pageable).getContent();
        return getChiTietSanPhamRequests(request, list);
    }

    private List<ChiTietSanPhamRequest> getChiTietSanPhamRequests(List<ChiTietSanPhamRequest> request, List<ChiTietSanPham> list) {
        for (ChiTietSanPham c : list) {
            ChiTietSanPhamRequest r = new ChiTietSanPhamRequest();
            r.setIdChiTietSanPham(c.getIdChiTietSanPham());
            r.setMuiGiay(c.getMuiGiay());
            r.setSanPham(c.getSanPham());
            r.setMauSac(c.getMauSac());
            r.setNhaCungCap(c.getNhaCungCap());
            r.setKichCo(c.getKichCo());
            r.setChatLieu(c.getChatLieu());
            r.setDeGiay(c.getDeGiay());
            r.setThuongHieu(c.getThuongHieu());
            r.setDanhMucSanPham(c.getDanhMucSanPham());
            r.setCoGiay(c.getCoGiay());
            r.setSoLuong(c.getSoLuong());
            r.setGia(c.getGia());
            r.setMoTa(c.getMoTa());
            r.setTrangThai(c.getTrangThai());
            r.setNgayTao(c.getNgayTao());
            r.setNgaySua(c.getNgaySua());
            r.setNguoiTao(c.getNguoiTao());
            r.setNguoiSua(c.getNguoiSua());
            r.setListAnh(hinhAnhRepo.listURl(c.getIdChiTietSanPham()));
            request.add(r);
        }
        return request;
    }

    public void xoaAnh() {

    }

    public Page<ChiTietSanPham> searchChiTietSanPham(String idMuiGiay, String idSanPham, String idMauSac,
                                                     String idNhaCungCap, String idKichCo, String idChatLieu,
                                                     String idDeGiay, String idThuongHieu, String idDanhMucSanPham,
                                                     String idCoGiay, Boolean trangThai, Pageable pageable) {
        return chiTietSanPhamRepo.searchChiTietSanPham(idMuiGiay, idSanPham, idMauSac, idNhaCungCap, idKichCo,
                idChatLieu, idDeGiay, idThuongHieu, idDanhMucSanPham, idCoGiay, trangThai,pageable);
    }
}

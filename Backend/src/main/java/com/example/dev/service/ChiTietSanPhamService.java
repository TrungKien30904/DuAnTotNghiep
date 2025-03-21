package com.example.dev.service;

import com.example.dev.DTO.UserLogin.UserLogin;
import com.example.dev.DTO.request.ChiTietSanPham.ChiTietSanPhamRequest;
import com.example.dev.DTO.request.DotGiamGia.SpGiamGiaRequest;
import com.example.dev.DTO.response.ChiTietSanPham.BienTheResponse;
import com.example.dev.DTO.response.ChiTietSanPham.ChiTietSanPhamResponse;
import com.example.dev.DTO.response.CloudinaryResponse;
import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.entity.HinhAnh;
import com.example.dev.entity.invoice.HoaDonChiTiet;
import com.example.dev.mapper.ChiTietSanPhamMapper;
import com.example.dev.repository.*;
import com.example.dev.repository.attribute.MauSacRepo;
import com.example.dev.repository.attribute.SanPhamRepo;
import com.example.dev.repository.history.ChiTietLichSuRepo;
import com.example.dev.repository.history.LichSuRepo;
import com.example.dev.repository.invoice.HoaDonChiTietRepository;
import com.example.dev.repository.invoice.HoaDonRepository;
import com.example.dev.service.history.HistoryImpl;
import com.example.dev.util.FileUpLoadUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChiTietSanPhamService {

    private final ChiTietSanPhamRepo chiTietSanPhamRepo;
    private final CloudinaryService cloudinaryService;
    private final HinhAnhRepo hinhAnhRepo;
    private final SanPhamRepo sanPhamRepo;
    private final MauSacRepo mauSacRepo;
    private final ChiTietSanPhamMapper chiTietSanPhamMapper;
    private final HoaDonRepository hoaDonRepository;
    private final HoaDonChiTietRepository hoaDonChiTietRepository;
    private final LichSuRepo lichSuRepo;
    private final ChiTietLichSuRepo chiTietLichSuRepo;
    private final HistoryImpl historyImpl;

    public List<ChiTietSanPham> getListChiTietSanPham() {
        return chiTietSanPhamRepo.findAll();
    }

    public List<ChiTietSanPhamRequest> getAllChiTietSanPham() {
        List<ChiTietSanPhamRequest> request = new ArrayList<>();
        return getChiTietSanPhamRequests(request, getListChiTietSanPham());
    }

    public List<ChiTietSanPham> getListChiTietSanPham(Integer idSanPham) {
        return chiTietSanPhamRepo.findAll().stream().filter(ctsp -> ctsp.getSanPham().getIdSanPham().equals(idSanPham)).toList();
    }

    public ChiTietSanPham getChiTietSanPham(Integer id) {
        return chiTietSanPhamRepo.findById(id).orElse(null);
    }

    public Map<String,List<?>> getProductDetailsByColor(Integer idSanPham, Integer idMauSac) {
        Map<String, List<?>> data = new HashMap<>();
        data.put("chiTietSanPham",chiTietSanPhamRepo.getAllProductByColor(idSanPham,idMauSac));
        data.put("listAnh",hinhAnhRepo.findHinhAnhBySanPham_IdSanPhamAndMauSac_IdMauSac(idSanPham,idMauSac));
        return data;
    }
//    public List<ChiTietSanPhamRequest> getProductDetailsByColor(Integer idSanPham,Integer idMauSac) {
//        List<ChiTietSanPhamRequest> listRequest = new ArrayList<>();
//
//        List<String> lienKet = hinhAnhRepo.findHinhAnhBySanPham_IdSanPhamAndMauSac_IdMauSac(idSanPham,idMauSac).stream()
//                .map(HinhAnh::getLienKet).toList();
//        for (ChiTietSanPham ctsp : chiTietSanPhamRepo.getAllProductByColor(idSanPham,idMauSac)){
//            ChiTietSanPhamRequest request = chiTietSanPhamMapper.entityToDto(ctsp);
//            request.setListAnh(lienKet);
//            listRequest.add(request);
//        }
//        return listRequest;
//    }
    public Integer themChiTietSanPham(ChiTietSanPhamResponse dto, Authentication auth) {
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
            UserLogin userLogin = (UserLogin) auth.getPrincipal();
            ctsp.setNguoiTao(userLogin.getUsername());
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

    public List<ChiTietSanPhamRequest> suaChiTietSanPham(ChiTietSanPham ctsp, Integer id,Authentication auth) {
        try {
            ChiTietSanPham find = chiTietSanPhamRepo.findById(id).orElseThrow();

            if (isEqual(ctsp, find)) {
                ctsp.setIdChiTietSanPham(id);
                ctsp.setNgaySua(LocalDateTime.now());
                UserLogin userLogin = (UserLogin) auth.getPrincipal();
                ctsp.setNguoiSua(userLogin.getUsername());
                chiTietSanPhamRepo.save(ctsp);
                log.info("Update ProductDetails > {}", ctsp.toString());
//                historyImpl.saveHistory(find,ctsp, BaseConstant.Action.UPDATE.getValue(), id,"Admin");
            }else{
//              thêm sản phẩm mới từ id sp cũ
                ctsp.setNgayTao(LocalDateTime.now());
                UserLogin userLogin = (UserLogin) auth.getPrincipal();
                ctsp.setNguoiTao(userLogin.getUsername());
                ctsp.setMa(ctsp.getMauSac().getTen() + ctsp.getKichCo().getTen());
                ctsp.setTaoBoi(find.getIdChiTietSanPham());
                chiTietSanPhamRepo.save(ctsp);

                // sua sp cu
                find.setSoLuong(0);
                find.setGiaDuocTinh(find.getGia());
                find.setGia(ctsp.getGia());
                chiTietSanPhamRepo.save(find);

                List<HoaDonChiTiet> listCart = hoaDonChiTietRepository.findAllByChiTietSanPham_IdChiTietSanPham(id);
                for (HoaDonChiTiet hdct : listCart) {
                    hdct.setDonGia(find.getGiaDuocTinh());
                    hdct.setThanhTien(find.getGiaDuocTinh().multiply(BigDecimal.valueOf(hdct.getSoLuong())));
                }
                hoaDonChiTietRepository.saveAll(listCart);
                log.info("Create new ProductDetails > {}", ctsp.toString());
//                historyImpl.saveHistory(null,ctsp, BaseConstant.Action.CREATE.getValue(), id,"Admin");
            }

        }catch (Exception e) {
            log.error(e.getMessage());
        }
        return getPage(id, 0, 3);
    }

    public List<ChiTietSanPhamRequest> getPage(Integer idSanPham, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);
        List<ChiTietSanPhamRequest> request = new ArrayList<>();
        List<ChiTietSanPham> list = chiTietSanPhamRepo.findBySanPham_IdSanPhamAndGiaDuocTinhIsNull(idSanPham, pageable);
        return getChiTietSanPhamRequests(request, list);
    }

    public int totalPage(Integer id) {
        return chiTietSanPhamRepo.findAll().stream().filter(ctsp -> ctsp.getSanPham().getIdSanPham().equals(id) && ctsp.getGiaDuocTinh() == null).toList().size();
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
        return c1.getSanPham().getIdSanPham().equals(c2.getSanPham().getIdSanPham()) &&
               c1.getChatLieu().getIdChatLieu().equals(c2.getChatLieu().getIdChatLieu()) &&
               c1.getCoGiay().getIdCoGiay().equals(c2.getCoGiay().getIdCoGiay()) &&
               c1.getDanhMucSanPham().getIdDanhMuc().equals(c2.getDanhMucSanPham().getIdDanhMuc()) &&
               c1.getDeGiay().getIdDeGiay().equals(c2.getDeGiay().getIdDeGiay()) &&
               c1.getKichCo().getIdKichCo().equals(c2.getKichCo().getIdKichCo()) &&
               c1.getMauSac().getIdMauSac().equals(c2.getMauSac().getIdMauSac()) &&
               c1.getMuiGiay().getIdMuiGiay().equals(c2.getMuiGiay().getIdMuiGiay()) &&
               c1.getNhaCungCap().getIdNhaCungCap().equals(c2.getNhaCungCap().getIdNhaCungCap()) &&
               c1.getThuongHieu().getIdThuongHieu().equals(c2.getThuongHieu().getIdThuongHieu()) &&
               c1.getGia().compareTo(c2.getGia()) == 0;
    }

    @Transactional
    public void uploadImage(final List<MultipartFile> file, List<String> listTenMau, Integer idSanPham,Authentication auth) {
            if (!file.isEmpty()) {
//            for(String publicId : hinhAnhRepo.publicId(idSanPham)) {
//                this.cloudinaryService.deleteImage(publicId);
//            }
                for (int i = 0; i < file.size(); i++) {
                    //Tao hinh anh
                    HinhAnh anh = new HinhAnh();
                    anh.setSanPham(sanPhamRepo.findById(idSanPham).orElse(null));

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
                    UserLogin userLogin = (UserLogin) auth.getPrincipal();
                    anh.setNguoiTao(userLogin.getUsername());
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

    public List<ChiTietSanPhamRequest> showProductOnline(Integer idSanPham){
        List<ChiTietSanPham> list = chiTietSanPhamRepo.findChiTietSanPhamBySanPham_IdSanPhamAndGiaDuocTinhIsNull(idSanPham);
        List<ChiTietSanPhamRequest> request = new ArrayList<>();
        return getChiTietSanPhamRequests(request,list);
    }
    private List<ChiTietSanPhamRequest> getChiTietSanPhamRequests(List<ChiTietSanPhamRequest> request, List<ChiTietSanPham> list) {
        for (ChiTietSanPham c : list) {
            ChiTietSanPhamRequest r = new ChiTietSanPhamRequest();
            r.setIdChiTietSanPham(c.getIdChiTietSanPham());
            r.setMa(c.getMa());
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
            r.setGiaDuocTinh(c.getGiaDuocTinh());
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

    public List<HoaDonChiTiet> themSp(Integer idHoaDon, Integer idChiTietSanPham, int soLuongThem, BigDecimal giaSauGiam) {
        boolean isUpdate = false;
        // tim hdct có idhd = ?
        List<HoaDonChiTiet> listHoaDonChiTiet = hoaDonChiTietRepository.findAllByHoaDon_IdHoaDon(idHoaDon);

        // tìm sp đang thao tác
        ChiTietSanPham ctsp = chiTietSanPhamRepo.findById(idChiTietSanPham).orElse(null);
        if (ctsp == null) {
            return null;
        }
        for(HoaDonChiTiet hdct : listHoaDonChiTiet) {
            if(hdct.getHoaDon().getIdHoaDon().equals(idHoaDon)) {
                if(hdct.getChiTietSanPham().getIdChiTietSanPham().equals(idChiTietSanPham)) {
                    hdct.setSoLuong(hdct.getSoLuong() + soLuongThem);
                    hdct.setThanhTien(giaSauGiam.multiply(BigDecimal.valueOf(hdct.getSoLuong())));
                    isUpdate = true;
                    hoaDonChiTietRepository.save(hdct);
                    break;
                }
            }
        }

        if (!isUpdate) {
            HoaDonChiTiet hoaDonThem = new HoaDonChiTiet();
            hoaDonThem.setChiTietSanPham(ctsp);
            hoaDonThem.setHoaDon(hoaDonRepository.findById(idHoaDon).orElseThrow());
            hoaDonThem.setSoLuong(soLuongThem);
            hoaDonThem.setDonGia(giaSauGiam);
            hoaDonThem.setThanhTien(giaSauGiam.multiply(BigDecimal.valueOf(soLuongThem)));
            hoaDonThem.setNgayTao(LocalDateTime.now());
            hoaDonThem.setNguoiTao("admin");
            hoaDonChiTietRepository.save(hoaDonThem);
        }

        chiTietSanPhamRepo.updateQuantity(idChiTietSanPham, ctsp.getSoLuong() - soLuongThem);
        return hoaDonChiTietRepository.findAllByHoaDon_IdHoaDon(idHoaDon);
    }

    @Transactional
    public void suaSoLuongHoaDonChiTiet(Integer idHdct,Integer idCtsp,int slThem,BigDecimal giaDuocTinh){
        HoaDonChiTiet hdct = hoaDonChiTietRepository.findById(idHdct)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Hóa đơn chi tiết với id: " + idHdct));

        ChiTietSanPham ctsp = chiTietSanPhamRepo.findById(idCtsp)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Chi tiết sản phẩm với id: " + idCtsp));

        if (giaDuocTinh == null){
            if (slThem > 0 && slThem <= hdct.getSoLuong() + ctsp.getSoLuong()) {
                int chenhLech = slThem - hdct.getSoLuong();
                if (chenhLech <= ctsp.getSoLuong()) {
                    hdct.setSoLuong(slThem);
                    hdct.setThanhTien(hdct.getDonGia().multiply(BigDecimal.valueOf(slThem))); // Fix tính toán
                    hoaDonChiTietRepository.save(hdct);

                    if (ctsp.getSoLuong() >= chenhLech) { // Kiểm tra trước khi trừ
                        chiTietSanPhamRepo.updateQuantity(idCtsp, ctsp.getSoLuong() - chenhLech);
                    } else {
                        throw new RuntimeException("Không đủ hàng trong kho!");
                    }
                }
            } else {
                throw new RuntimeException("Số lượng cập nhật không hợp lệ!");
            }
        }else{
            List<ChiTietSanPham> backTo = chiTietSanPhamRepo.findAllByTaoBoi(idCtsp);
            if (slThem > 0 && slThem <= hdct.getSoLuong()) {
                //     -1           9            10
                int chenhLech = slThem - hdct.getSoLuong();
                hdct.setSoLuong(slThem);
                hoaDonChiTietRepository.save(hdct);
                if (!backTo.isEmpty()) {
                    for (ChiTietSanPham b : backTo) {
                        if (b.getGiaDuocTinh() == null && b.getTaoBoi().equals(idCtsp)) {
                            chiTietSanPhamRepo.updateQuantity(b.getIdChiTietSanPham(), b.getSoLuong() - chenhLech);
                        }
                    }
                }
            }
        }
    }

    @Transactional
    public List<HoaDonChiTiet> xoaSp(Integer idHdct, Integer idChiTietSanPham) {
        // tim sp can xoa
        HoaDonChiTiet hdct = hoaDonChiTietRepository.findById(idHdct).orElse(null);

        // lay sp trong db de cap nhat
        ChiTietSanPham ctsp = chiTietSanPhamRepo.findById(idChiTietSanPham).orElse(null);

        List<ChiTietSanPham> backTo = chiTietSanPhamRepo.findAllByTaoBoi(idChiTietSanPham);
        if (hdct != null && ctsp != null){
            if (!backTo.isEmpty()) {
                for (ChiTietSanPham b : backTo) {
                    if (b.getGiaDuocTinh() == null && b.getTaoBoi().equals(idChiTietSanPham)) {
                        chiTietSanPhamRepo.updateQuantity(b.getIdChiTietSanPham(), b.getSoLuong() + hdct.getSoLuong());
                    }
                }
            }else{
                chiTietSanPhamRepo.updateQuantity(idChiTietSanPham, ctsp.getSoLuong() + hdct.getSoLuong());
            }
            hoaDonChiTietRepository.delete(hdct);
        }
        assert hdct != null;
        return hoaDonChiTietRepository.findAllByHoaDon_IdHoaDon(hdct.getHoaDon().getIdHoaDon());
    }

    public void capNhatSl(Integer idHdct,Integer idCtsp,int slThem,BigDecimal giaDuocTinh){

        HoaDonChiTiet productChange = hoaDonChiTietRepository.findById(idHdct).orElse(null);

        if (productChange != null) {
            if (giaDuocTinh == null){
                if (productChange.getSoLuong() >= 0){
                    productChange.setSoLuong(productChange.getSoLuong() + slThem);
                    productChange.setThanhTien(productChange.getDonGia().multiply(BigDecimal.valueOf(productChange.getSoLuong())));
                    hoaDonChiTietRepository.save(productChange);
                }
                ChiTietSanPham ctsp = chiTietSanPhamRepo.findById(idCtsp).orElse(null);
                if (ctsp != null) {
                    if (ctsp.getSoLuong() >= 0){
                        ctsp.setSoLuong(ctsp.getSoLuong() - slThem);
                        chiTietSanPhamRepo.save(ctsp);
                    }
                }
            }else{
                if (slThem < 0){
                    if (productChange.getSoLuong() >= 0){
                        productChange.setSoLuong(productChange.getSoLuong() + slThem);
                        productChange.setThanhTien(productChange.getDonGia().multiply(BigDecimal.valueOf(productChange.getSoLuong())));
                        hoaDonChiTietRepository.save(productChange);
                    }
                    List<ChiTietSanPham> backTo = chiTietSanPhamRepo.findAllByTaoBoi(idCtsp);
                    if (!backTo.isEmpty()) {
                        for (ChiTietSanPham b : backTo) {
                            if (b.getGiaDuocTinh() == null && b.getTaoBoi().equals(idCtsp)) {
                                chiTietSanPhamRepo.updateQuantity(b.getIdChiTietSanPham(), b.getSoLuong() - slThem);
                            }
                        }
                    }
                }
            }
        }


    }

    public List<SpGiamGiaRequest> getSpGiamGia(Integer idChiTietSanPham){
        return chiTietSanPhamRepo.getSanPhamGiamGia(idChiTietSanPham);
    }

}

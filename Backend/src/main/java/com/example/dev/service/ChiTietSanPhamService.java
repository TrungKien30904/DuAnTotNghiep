package com.example.dev.service;

import com.example.dev.DTO.UserLogin.UserLogin;
import com.example.dev.DTO.request.ChiTietSanPham.ChiTietSanPhamRequest;
import com.example.dev.DTO.request.DotGiamGia.SpGiamGiaRequest;
import com.example.dev.DTO.response.ChiTietSanPham.BienTheResponse;
import com.example.dev.DTO.response.ChiTietSanPham.ChiTietSanPhamResponse;
import com.example.dev.DTO.response.CloudinaryResponse;
import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.entity.HinhAnh;
import com.example.dev.entity.invoice.HoaDon;
import com.example.dev.entity.invoice.HoaDonChiTiet;
import com.example.dev.repository.ChiTietSanPhamRepo;
import com.example.dev.repository.HinhAnhRepo;
import com.example.dev.repository.attribute.MauSacRepo;
import com.example.dev.repository.attribute.SanPhamRepo;
import com.example.dev.repository.history.ChiTietLichSuRepo;
import com.example.dev.repository.history.LichSuRepo;
import com.example.dev.repository.invoice.HoaDonChiTietRepository;
import com.example.dev.repository.invoice.HoaDonRepository;
import com.example.dev.service.history.HistoryImpl;
import com.example.dev.service.invoice.HoaDonService;
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
    //    private final ChiTietSanPhamMapper chiTietSanPhamMapper;
    private final HoaDonRepository hoaDonRepository;
    private final HoaDonChiTietRepository hoaDonChiTietRepository;
    private final LichSuRepo lichSuRepo;
    private final ChiTietLichSuRepo chiTietLichSuRepo;
    private final HistoryImpl historyImpl;
    private final HoaDonService hoaDonService;
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

    public Map<String, List<?>> getProductDetailsByColor(Integer idSanPham, Integer idMauSac) {
        Map<String, List<?>> data = new HashMap<>();
        data.put("chiTietSanPham", chiTietSanPhamRepo.getAllProductByColor(idSanPham, idMauSac));
        data.put("listAnh", hinhAnhRepo.findHinhAnhBySanPham_IdSanPhamAndMauSac_IdMauSac(idSanPham, idMauSac));
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

    public List<ChiTietSanPhamRequest> suaChiTietSanPham(ChiTietSanPham newProduct, Integer id, Authentication auth) {
        try {
            ChiTietSanPham oldProduct = chiTietSanPhamRepo.findById(id).orElseThrow();
            List<HoaDonChiTiet> listCart = hoaDonChiTietRepository.findAllByChiTietSanPham_IdChiTietSanPhamAndHoaDon_TrangThaiNot(id,"Đã hoàn thành");
            List<SpGiamGiaRequest> giaGiam =  chiTietSanPhamRepo.getSanPhamGiamGia(id);

            if (isEqual(newProduct, oldProduct)) {
                newProduct.setIdChiTietSanPham(id);
                newProduct.setNgaySua(LocalDateTime.now());
                UserLogin userLogin = (UserLogin) auth.getPrincipal();
                newProduct.setNguoiSua(userLogin.getUsername());
                chiTietSanPhamRepo.save(newProduct);
                log.info("Update ProductDetails > {}", newProduct);
//                historyImpl.saveHistory(find,ctsp, BaseConstant.Action.UPDATE.getValue(), id, userLogin.getUsername());
            } else {
                if (!listCart.isEmpty()) {
                    UserLogin userLogin = (UserLogin) auth.getPrincipal();
                    // thêm sản phẩm mới tạo bởi sp cũ với giá cũ
                    newProduct.setGiaDuocTinh(giaGiam.get(0).getGiaSauGiam());
                    newProduct.setSoLuong(oldProduct.getSoLuong());
                    newProduct.setNguoiTao(userLogin.getUsername());
                    newProduct.setNgayTao(LocalDateTime.now());
                    newProduct.setTaoBoi(oldProduct.getIdChiTietSanPham());

                    ChiTietSanPham c = chiTietSanPhamRepo.save(newProduct);

                    // sửa giá sản phẩm cũ
                    oldProduct.setGia(newProduct.getGia());
                    oldProduct.setNgaySua(LocalDateTime.now());
                    oldProduct.setNguoiSua(userLogin.getUsername());
                    chiTietSanPhamRepo.save(oldProduct);

                    // tìm trong hóa đơn chi tiết các sp đã được thêm để chỉnh sửa
                    for (HoaDonChiTiet hdct : listCart) {
                        hdct.setChiTietSanPham(c);
                        hdct.setDonGia(newProduct.getGiaDuocTinh());
                        hdct.setThanhTien(newProduct.getGiaDuocTinh().multiply(BigDecimal.valueOf(hdct.getSoLuong())));
                        hdct.setNgaySua(LocalDateTime.now());
                        hdct.setNguoiSua(userLogin.getUsername());
                    }

                    hoaDonChiTietRepository.saveAll(listCart);
                    log.info("Create new ProductDetails > {}", newProduct);
//                historyImpl.saveHistory(null,ctsp, BaseConstant.Action.CREATE.getValue(), id, userLogin.getUsername());
                }else{
                    newProduct.setIdChiTietSanPham(id);
                    newProduct.setNgaySua(LocalDateTime.now());
                    UserLogin userLogin = (UserLogin) auth.getPrincipal();
                    newProduct.setNguoiSua(userLogin.getUsername());
                    chiTietSanPhamRepo.save(newProduct);
                    log.info("Update ProductDetails > {}", newProduct);
                }
            }

        } catch (Exception e) {
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
        return c1.getSanPham().getIdSanPham().equals(c2.getSanPham().getIdSanPham()) && c1.getChatLieu().getIdChatLieu().equals(c2.getChatLieu().getIdChatLieu()) && c1.getCoGiay().getIdCoGiay().equals(c2.getCoGiay().getIdCoGiay()) && c1.getDanhMucSanPham().getIdDanhMuc().equals(c2.getDanhMucSanPham().getIdDanhMuc()) && c1.getDeGiay().getIdDeGiay().equals(c2.getDeGiay().getIdDeGiay()) && c1.getKichCo().getIdKichCo().equals(c2.getKichCo().getIdKichCo()) && c1.getMauSac().getIdMauSac().equals(c2.getMauSac().getIdMauSac()) && c1.getMuiGiay().getIdMuiGiay().equals(c2.getMuiGiay().getIdMuiGiay()) && c1.getNhaCungCap().getIdNhaCungCap().equals(c2.getNhaCungCap().getIdNhaCungCap()) && c1.getThuongHieu().getIdThuongHieu().equals(c2.getThuongHieu().getIdThuongHieu()) && c1.getGia().compareTo(c2.getGia()) == 0;
    }

    @Transactional
    public void uploadImage(final List<MultipartFile> file, List<String> listTenMau, Integer idSanPham, Authentication auth) {
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

    public List<ChiTietSanPhamRequest> showProductOnline(Integer idSanPham) {
        List<ChiTietSanPham> list = chiTietSanPhamRepo.findChiTietSanPhamBySanPham_IdSanPhamAndGiaDuocTinhIsNull(idSanPham);
        List<ChiTietSanPhamRequest> request = new ArrayList<>();
        return getChiTietSanPhamRequests(request, list);
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
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon).orElseThrow(() -> new RuntimeException("Hóa đơn không tồn tại"));

        ChiTietSanPham ctsp = chiTietSanPhamRepo.findById(idChiTietSanPham).orElseThrow(() -> new RuntimeException("Chi tiết sản phẩm không tồn tại"));

        // Tìm sản phẩm trong hóa đơn (nếu đã có)
        Optional<HoaDonChiTiet> existingHdctOpt = hoaDonChiTietRepository.findAllByHoaDon_IdHoaDon(idHoaDon).stream().filter(hdct -> hdct.getChiTietSanPham().getIdChiTietSanPham().equals(idChiTietSanPham)).findFirst();

        if (existingHdctOpt.isPresent()) {
            // Cập nhật số lượng và thành tiền
            HoaDonChiTiet hdct = existingHdctOpt.get();
            hdct.setSoLuong(hdct.getSoLuong() + soLuongThem);
            hdct.setThanhTien(giaSauGiam.multiply(BigDecimal.valueOf(hdct.getSoLuong())));
            hoaDonChiTietRepository.save(hdct);
        } else {
            // Thêm sản phẩm mới vào hóa đơn
            HoaDonChiTiet hoaDonMoi = new HoaDonChiTiet();
            hoaDonMoi.setChiTietSanPham(ctsp);
            hoaDonMoi.setHoaDon(hoaDon);
            hoaDonMoi.setSoLuong(soLuongThem);
            hoaDonMoi.setDonGia(giaSauGiam);
            hoaDonMoi.setThanhTien(giaSauGiam.multiply(BigDecimal.valueOf(soLuongThem)));
            hoaDonMoi.setNgayTao(LocalDateTime.now());
            hoaDonMoi.setNguoiTao("admin");
            hoaDonChiTietRepository.save(hoaDonMoi);
        }

        // Trừ số lượng sản phẩm nếu không phải đơn online
        if (!"Online".equalsIgnoreCase(hoaDon.getLoaiDon())) {
            chiTietSanPhamRepo.updateQuantity(idChiTietSanPham, ctsp.getSoLuong() - soLuongThem);
        }else{
            hoaDonService.UpdateInvoice(idHoaDon);
        }

        return hoaDonChiTietRepository.findAllByHoaDon_IdHoaDon(idHoaDon);
    }


    @Transactional
    public void suaSoLuongHoaDonChiTiet(Integer idHoaDon, Integer idHdct, Integer idCtsp, int slThem, BigDecimal giaDuocTinh) {
        HoaDonChiTiet hdct = hoaDonChiTietRepository.findById(idHdct).orElseThrow(() -> new RuntimeException("Không tìm thấy Hóa đơn chi tiết với id: " + idHdct));

        ChiTietSanPham ctsp = chiTietSanPhamRepo.findById(idCtsp).orElseThrow(() -> new RuntimeException("Không tìm thấy Chi tiết sản phẩm với id: " + idCtsp));

        HoaDon hoaDon = idHoaDon != null ? hoaDonRepository.findById(idHoaDon).orElse(null) : null;
        boolean isOnlineOrder = hoaDon != null && "Online".equalsIgnoreCase(hoaDon.getLoaiDon());

        int chenhLech = slThem - hdct.getSoLuong();
        if (giaDuocTinh != null) {
            if (slThem > hdct.getSoLuong()){
                throw new RuntimeException("Không thêm được sản phẩm thay đổi giá!");
            }
        }else{
            if (slThem <= 0 || slThem > hdct.getSoLuong() + ctsp.getSoLuong()) {
                throw new RuntimeException("Số lượng cập nhật không hợp lệ!");
            }
        }
        hdct.setSoLuong(slThem);
        hdct.setThanhTien(hdct.getDonGia().multiply(BigDecimal.valueOf(slThem)));
        hoaDonChiTietRepository.save(hdct);
        // Nếu đơn không phải Online, cập nhật số lượng tồn kho
        if (!isOnlineOrder) {
            if (chenhLech > ctsp.getSoLuong()) {
                throw new RuntimeException("Không đủ hàng trong kho!");
            }
            // Xử lý logic khi `giaDuocTinh` khác null
            if (giaDuocTinh == null) {
                chiTietSanPhamRepo.updateQuantity(ctsp.getIdChiTietSanPham(), ctsp.getSoLuong() - chenhLech);
            } else {
                chiTietSanPhamRepo.updateQuantity(ctsp.getTaoBoi(), ctsp.getSoLuong() - chenhLech);
            }
        }else{
            if (slThem > ctsp.getSoLuong()){
                throw new RuntimeException("Không đủ hàng trong kho!");
            }
            hoaDonService.UpdateInvoice(idHoaDon);
        }

    }


    @Transactional
    public List<HoaDonChiTiet> xoaSp(Integer idHoaDon, Integer idHdct, Integer idChiTietSanPham) {
        // hóa đơn chi tiết để xóa
        HoaDonChiTiet hdct = hoaDonChiTietRepository.findById(idHdct).orElseThrow(() -> new RuntimeException("Không tìm thấy Hóa đơn chi tiết với id: " + idHdct));
        // ctsp để trả lại
        ChiTietSanPham ctsp = chiTietSanPhamRepo.findById(idChiTietSanPham).orElseThrow(() -> new RuntimeException("Không tìm thấy Chi tiết sản phẩm với id: " + idChiTietSanPham));
        HoaDon hoaDon = idHoaDon != null ? hoaDonRepository.findById(idHoaDon).orElse(null) : null;
        boolean isOnlineOrder = hoaDon != null && "Online".equalsIgnoreCase(hoaDon.getLoaiDon());
        // Cập nhật lại số lượng kho nếu đơn không phải Online
        if (!isOnlineOrder) {
            if (ctsp != null) {
                if (ctsp.getGiaDuocTinh() == null) {
                    chiTietSanPhamRepo.updateQuantity(ctsp.getIdChiTietSanPham(), ctsp.getSoLuong() + hdct.getSoLuong());
                } else {
                    chiTietSanPhamRepo.updateQuantity(ctsp.getTaoBoi(), ctsp.getSoLuong() + hdct.getSoLuong());
                }
            }
            hoaDonChiTietRepository.delete(hdct);
        }else{
            List<HoaDonChiTiet> isEmpty = hoaDonChiTietRepository.findAllByHoaDon_IdHoaDon(idHoaDon);
            if (isEmpty.size() > 1) {
                hoaDonChiTietRepository.delete(hdct);
            }else{
                hdct.setSoLuong(1);
                hoaDonChiTietRepository.save(hdct);
            }
            hoaDonService.UpdateInvoice(idHoaDon);
        }

        // Trả về danh sách hóa đơn chi tiết còn lại

        return hoaDonChiTietRepository.findAllByHoaDon_IdHoaDon(hdct.getHoaDon().getIdHoaDon());
    }


    public void capNhatSl(Integer idHoaDon, Integer idHdct, Integer idCtsp, int slThem, BigDecimal giaDuocTinh) {

        HoaDonChiTiet hoaDonChitiet = hoaDonChiTietRepository.findById(idHdct).orElseThrow();
        hoaDonChitiet.setSoLuong(hoaDonChitiet.getSoLuong() + slThem);
        hoaDonChitiet.setThanhTien(hoaDonChitiet.getDonGia().multiply(BigDecimal.valueOf(hoaDonChitiet.getSoLuong())));
        hoaDonChiTietRepository.save(hoaDonChitiet);

        if (idHoaDon == null) {
            ChiTietSanPham ctsp = chiTietSanPhamRepo.findById(idCtsp).orElseThrow();
            if (ctsp.getSoLuong() >= 0) {
                if (giaDuocTinh == null) {
                    chiTietSanPhamRepo.updateQuantity(ctsp.getIdChiTietSanPham(), ctsp.getSoLuong() - slThem);
                } else {
                    chiTietSanPhamRepo.updateQuantity(ctsp.getTaoBoi(), ctsp.getSoLuong() - slThem);
                }
            }
        }else{
            hoaDonService.UpdateInvoice(idHoaDon);
        }

    }


    public List<SpGiamGiaRequest> getSpGiamGia(Integer idChiTietSanPham) {
        return chiTietSanPhamRepo.getSanPhamGiamGia(idChiTietSanPham);
    }

}

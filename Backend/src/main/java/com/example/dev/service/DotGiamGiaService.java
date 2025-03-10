package com.example.dev.service;

import com.example.dev.DTO.dotgiamgia.DotGiamGiaRequestDTO;
import com.example.dev.DTO.dotgiamgia.GetSanPhamDTO;
import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.entity.DotGiamGia;
import com.example.dev.entity.DotGiamGiaChiTiet;
import com.example.dev.entity.attribute.SanPham;
import com.example.dev.repository.ChiTietSanPhamRepo;
import com.example.dev.repository.DotGiamGiaChiTietRepo;
import com.example.dev.repository.DotGiamGiaRepo;
import com.example.dev.repository.attribute.SanPhamRepo;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class DotGiamGiaService {
    @Autowired
    DotGiamGiaRepo dotGiamGiaRepo;

    @Autowired
    SanPhamRepo sanPhamRepo;

    @Autowired
    ChiTietSanPhamRepo chiTietSanPhamRepo;

    @Autowired
    DotGiamGiaChiTietRepo dotGiamGiaChiTietRepo;

//    public List<DotGiamGia> getDgg(){
//        return dotGiamGiaRepo.findAll(Sort.by(Sort.Direction.DESC, "ngayTao"));
//    }

    public Map<String, Object> getDgg(int skip, int limit, String tenDotGiamGia, String hinhThuc, Integer giaTri, LocalDateTime ngayBatDau, LocalDateTime ngayKetThuc, String trangThai) {
        Specification<DotGiamGia> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (tenDotGiamGia != null && !tenDotGiamGia.trim().isEmpty()) {
                predicates.add(cb.like(root.get("tenDotGiamGia"), "%" + tenDotGiamGia + "%"));
            }
            if (hinhThuc != null) {
                if ("all".equalsIgnoreCase(hinhThuc)) {
                    // Lấy cả "VND" và "%"
                    predicates.add(root.get("hinhThuc").in("VND", "%"));
                } else {
                    // Lọc theo giá trị cụ thể (VND hoặc %)
                    String hinhThucNew = (hinhThuc.equals("1")) ? "VND" : "%";
                    predicates.add(cb.equal(root.get("hinhThuc"), hinhThucNew));
                }
            }
            if (giaTri != null) {
                predicates.add(cb.equal(root.get("giaTri"), giaTri));
            }
            if (ngayBatDau != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("ngayBatDau"), ngayBatDau));
            }
            if (ngayKetThuc != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("ngayKetThuc"), ngayKetThuc));
            }
            if (trangThai != null) {
                LocalDateTime now = LocalDateTime.now();
                switch (trangThai) {
                    case "1": // Đang diễn ra
                        System.out.println("111111   " + root.get("ngayBatDau"));
                        System.out.println("111111   " + root.get("ngayKetThuc"));
                        System.out.println("111111   " + now);
                        predicates.add(cb.greaterThanOrEqualTo(root.get("ngayKetThuc"), now));
                        predicates.add(cb.lessThanOrEqualTo(root.get("ngayBatDau"), now));
                        break;

                    case "0": // Đã kết thúc
                        predicates.add(cb.lessThanOrEqualTo(root.get("ngayKetThuc"), now));
                        break;

                    case "2": // Sắp diễn ra
                        predicates.add(cb.greaterThanOrEqualTo(root.get("ngayBatDau"), now));
                        break;

                    default:
                        // Không làm gì -> Lấy tất cả dữ liệu
                        break;
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Pageable pageable = PageRequest.of(skip / limit, limit, Sort.by(Sort.Direction.DESC, "ngayTao"));
        Page<DotGiamGia> pageResult = dotGiamGiaRepo.findAll(spec, pageable);

        // Tạo Map chứa danh sách dữ liệu và tổng số bản ghi
        Map<String, Object> response = new HashMap<>();
        response.put("data", pageResult.getContent());
        response.put("total", pageResult.getTotalElements());

        return response;
    }

    public Long layMaDGG(){
        return dotGiamGiaRepo.LayMaDGG();
    }

    public DotGiamGia getDggById(String idDotGiamGia) {
        return dotGiamGiaRepo.findById(idDotGiamGia).orElse(null);
    }

    public DotGiamGia addDGG(DotGiamGiaRequestDTO requestDTO){
        DotGiamGia dotGiamGia = requestDTO.getDotGiamGia();
        List<Integer> idSanPhamChiTietListList = requestDTO.getIdSanPhamChiTietList();
        LocalDateTime dateTimeNgayBD = LocalDateTime.parse(dotGiamGia.getNgayBatDau().toString());
        LocalDateTime dateTimeNgayKT = LocalDateTime.parse(dotGiamGia.getNgayKetThuc().toString());
        // Lấy thời gian hiện tại
        LocalDateTime currentDateTime = LocalDateTime.now();
//        if (currentDateTime.isBefore(dateTimeNgayBD)){
//            dotGiamGia.setTrangThai(2); // Sắp diễn ra
//        } else if (currentDateTime.isAfter(dateTimeNgayKT)) {
//            dotGiamGia.setTrangThai(0); // Bị vô hiệu hóa
//        } else {
//            dotGiamGia.setTrangThai(1); // Đang trong đợt
//        }
        dotGiamGia.setTrangThai(Boolean.TRUE);
        dotGiamGia.setNgayTao(LocalDateTime.now());
        dotGiamGia.setNguoiTao("Nguyến Trí Tuệ");
        // Lưu đượt giảm giá
        DotGiamGia savedDotGiamGia = dotGiamGiaRepo.save(dotGiamGia);
        // Lưu đọt giảm gíá chi tiết
        if (idSanPhamChiTietListList != null && !idSanPhamChiTietListList.isEmpty()) {
            for (Integer idChiTietSanPham : idSanPhamChiTietListList) {
                ChiTietSanPham chiTietSanPham = new ChiTietSanPham();
                chiTietSanPham.setIdChiTietSanPham(idChiTietSanPham);
                DotGiamGiaChiTiet  dotGiamGiaChiTiet = new DotGiamGiaChiTiet();
                dotGiamGiaChiTiet.setChiTietSanPham(chiTietSanPham);
                dotGiamGiaChiTiet.setDotGiamGia(savedDotGiamGia);
                dotGiamGiaChiTiet.setTrangThai(true);
                dotGiamGiaChiTiet.setNgayTao(LocalDateTime.now());
                dotGiamGiaChiTiet.setNguoiTao("Tuệ");
                dotGiamGiaChiTiet.setNguoiSua("Tuệ");
                dotGiamGiaChiTietRepo.save(dotGiamGiaChiTiet);
            }
        }
        return null;
    }

    public DotGiamGia editDGG(DotGiamGiaRequestDTO requestDTO){
        DotGiamGia dotGiamGia = requestDTO.getDotGiamGia();
        dotGiamGia.setTenDotGiamGia(requestDTO.getDotGiamGia().getTenDotGiamGia());
        dotGiamGia.setHinhThuc(requestDTO.getDotGiamGia().getHinhThuc());
        dotGiamGia.setGiaTri(requestDTO.getDotGiamGia().getGiaTri());
        List<Integer> idSanPhamChiTietListList = requestDTO.getIdSanPhamChiTietList();
        LocalDateTime dateTimeNgayBD = LocalDateTime.parse(dotGiamGia.getNgayBatDau().toString());
        LocalDateTime dateTimeNgayKT = LocalDateTime.parse(dotGiamGia.getNgayKetThuc().toString());
        // Lấy thời gian hiện tại
        LocalDateTime currentDateTime = LocalDateTime.now();
//        if (currentDateTime.isBefore(dateTimeNgayBD)){
//            dotGiamGia.setTrangThai(2); // Sắp diễn ra
//        } else if (currentDateTime.isAfter(dateTimeNgayKT)) {
//            dotGiamGia.setTrangThai(0); // Bị vô hiệu hóa
//        } else {
//            dotGiamGia.setTrangThai(1); // Đang trong đợt
//        }
        dotGiamGia.setTrangThai(Boolean.TRUE);
        dotGiamGia.setNgayTao(LocalDateTime.now());
        dotGiamGia.setNguoiTao("Nguyến Trí Tuệ");
        // Lưu đượt giảm giá
        DotGiamGia savedDotGiamGia = dotGiamGiaRepo.save(dotGiamGia);
        // XÓA CÁC ĐỢT GIẢM GIÁ CHI TIẾT CŨ CỦA ĐỢT GIẢM GIÁ HIỆN TẠI
        dotGiamGiaChiTietRepo.deleteByDotGiamGia(savedDotGiamGia);
        // Lưu đọt giảm gíá chi tiết
        if (idSanPhamChiTietListList != null && !idSanPhamChiTietListList.isEmpty()) {
            for (Integer idChiTietSanPham : idSanPhamChiTietListList) {
                ChiTietSanPham chiTietSanPham = new ChiTietSanPham();
                chiTietSanPham.setIdChiTietSanPham(idChiTietSanPham);
                DotGiamGiaChiTiet  dotGiamGiaChiTiet = new DotGiamGiaChiTiet();
                dotGiamGiaChiTiet.setChiTietSanPham(chiTietSanPham);
                dotGiamGiaChiTiet.setDotGiamGia(savedDotGiamGia);
                dotGiamGiaChiTiet.setTrangThai(true);
                dotGiamGiaChiTiet.setNgayTao(LocalDateTime.now());
                dotGiamGiaChiTiet.setNguoiTao("Tuệ");
                dotGiamGiaChiTiet.setNguoiSua("Tuệ");
                dotGiamGiaChiTietRepo.save(dotGiamGiaChiTiet);
            }
        }
        return null;
    }

    public GetSanPhamDTO getSanPham(String tenSanPham, int skip, int limit) {
        int page = skip / limit; // Tính số trang dựa trên skip và limit
        PageRequest pageable = PageRequest.of(page, limit); // Tạo Pageable
        Page<SanPham> sanPhamPage;
        if (tenSanPham == null || tenSanPham.trim().isEmpty()) {
            // Nếu không có tên sản phẩm, lấy tất cả sản phẩm
            sanPhamPage = sanPhamRepo.findAll(pageable);
        } else {
            // Nếu có tên sản phẩm, tìm kiếm theo tên gần đúng
            sanPhamPage = sanPhamRepo.findByTenContaining(tenSanPham, pageable); // Truy vấn dữ liệu
        }
//        return sanPhamPage.getContent().stream()
//                .map(sp -> new SanPham(sp.getIdSanPham(), sp.getTenSanPham()))
//                .collect(Collectors.toList());

        return new GetSanPhamDTO(sanPhamPage.getContent(), sanPhamPage.getTotalElements());
    }

    public List<Integer> getListIdSPChiTiet(String idDotGiamGia) {
        return dotGiamGiaChiTietRepo.findIdSanPhamChiTietByIdDotGiamGia(idDotGiamGia);
    }

    public List<Integer> getListIDSP(List<Integer> idSanPhamChiTiet) {
        return dotGiamGiaChiTietRepo.findIdSanPhamChiTietByList(idSanPhamChiTiet);
    }

    public List<SanPham> getListSP(List<Integer> idSanPham) {
        return dotGiamGiaChiTietRepo.findSanPhamByListId(idSanPham);
    }

    public List<ChiTietSanPham> getListSPCT(List<Integer> idSanPhamChiTiet) {
        return dotGiamGiaChiTietRepo.findChiTietSanPhamByListId(idSanPhamChiTiet);
    }

    public List<SanPham> getSpAll(){
       return dotGiamGiaRepo.getSpAll();
    }

//    public List<ChiTietSanPham> getSanPhamChiTiet(List<Integer> idSanPham, int skip, int limit) {
    public Page<ChiTietSanPham> getSanPhamChiTiet(List<Integer> idSanPham, int skip, int limit) {
        int page = skip / limit;
        PageRequest pageable = PageRequest.of(page, limit);

//        Page<ChiTietSanPham> chiTietSanPhamPage = chiTietSanPhamRepo.findBySanPhamIdSanPhamIn(idSanPham, pageable);
//        return chiTietSanPhamPage.getContent();
        return chiTietSanPhamRepo.findBySanPhamIdSanPhamIn(idSanPham, pageable);
//        return (List<ChiTietSanPham>) chiTietSanPhamRepo.findByIdSanPhamIn(idSanPham, pageable);

        // Lấy danh sách chi tiết sản phẩm theo ID sản phẩm
//        Page<ChiTietSanPham> chiTietPage = chiTietSanPhamRepo.findBySanPhamIdSanPham(idSanPham, pageable);
//        return new GetSanPhamChiTietDTO(chiTietPage.getContent(), chiTietPage.getTotalElements());
    }

}

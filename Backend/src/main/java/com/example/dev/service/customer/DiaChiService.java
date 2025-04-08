package com.example.dev.service.customer;

import com.example.dev.DTO.request.DiaChi.Item;
import com.example.dev.DTO.request.DiaChi.ShipRequest;
import com.example.dev.entity.customer.DiaChi;
import com.example.dev.entity.invoice.HoaDon;
import com.example.dev.entity.invoice.HoaDonChiTiet;
import com.example.dev.repository.customer.DiaChiRepo;
import com.example.dev.repository.invoice.HoaDonRepository;
import com.example.dev.service.invoice.HoaDonChiTietService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaChiService {
    public static final Integer SHOP_ID = 5652920;
    public static final String TOKEN_GHN = "a9cd42d9-f28a-11ef-a268-9e63d516feb9";
    public static final Integer SERVICE_TYPE = 2;
    public static final Integer FROM_DISTRICT_ID = 1542;
    public static final String FROM_WARD_CODE = "1A0607";


    public static final Integer insurance_value = 0;
    public static final String coupon = "null";

    private final HoaDonChiTietService hoaDonChiTietService;
    private final HoaDonRepository hoaDonRepository;
    private final DiaChiRepo diaChiRepo;

    RestTemplate restTemplate = new RestTemplate();

    public String getProvince(Integer provinceId) {
        try {
            String url = "https://online-gateway.ghn.vn/shiip/public-api/master-data/province"; // API lấy tỉnh/thành
            // Headers
            HttpHeaders headers = getHttpHeaders();

            // Request
            HttpEntity<String> request = new HttpEntity<>(headers);

            // Gửi request
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

            if (provinceId != -1){
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode dataArray = rootNode.path("data");
                for (JsonNode province : dataArray) {
                    Integer findID = province.path("ProvinceID").asInt();
                    if (findID.equals(provinceId)) {
                        return province.path("ProvinceName").asText();
                    }
                }
            }
            return response.getBody();
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    public String getDistricts(Integer provinceId,Integer districtId) {
        try {
            // URL API lấy quận/huyện theo ProvinceID
            String url = "https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=" + provinceId;

            // Headers
            HttpHeaders headers = getHttpHeaders();

            // Request
            HttpEntity<String> request = new HttpEntity<>(headers);

            // Gửi request
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

            if(districtId != -1){
                String districtName = "";
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode dataArray = rootNode.path("data");
                for (JsonNode district : dataArray) {
                    Integer findID = district.path("DistrictID").asInt();
                    if (findID.equals(districtId)) {
                        return district.path("DistrictName").asText();
                    }
                }
                return districtName;
            }
            // Parse JSON
            return response.getBody();
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    public String getWards(Integer districtId,String wardCode) {
        try {
            // URL API lấy xã/phường theo DistrictID
            String url = "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + districtId;

            // Headers
            HttpHeaders headers = getHttpHeaders();

            // Request
            HttpEntity<String> request = new HttpEntity<>(headers);

            // Gửi request
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

            if(!wardCode.isEmpty()){
                String wardName = "";
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode dataArray = rootNode.path("data");
                for (JsonNode ward : dataArray) {
                    String wardCodeFind = ward.path("WardCode").asText(); // WardCode là ID xã/phường
                    if (wardCodeFind.equalsIgnoreCase(wardCode)) {
                        return ward.path("WardName").asText();
                    }
                }
            }
            // Parse JSON
            return response.getBody();

        } catch (Exception e) {
            return e.getMessage();
        }
    }

    private static HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("token", TOKEN_GHN);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public String shippingFee(int districtId, String wardCode, Integer idHoaDon) {
        List<HoaDonChiTiet> listItems = hoaDonChiTietService.findByIdHoaDon(idHoaDon);
        List<Item> items = new ArrayList<>();


        int length = 0;
        int width = 0;
        int height = 0;
        int weight = 0;

        for (HoaDonChiTiet item : listItems) {
            Item i = Item.builder().name(item.getChiTietSanPham().getSanPham().getTen()).quantity(item.getSoLuong()).length(20).width(20).height(12).weight(1000).build();
            items.add(i);
            length += i.getLength();
            width += i.getWidth();
            height += i.getHeight() * i.getQuantity();
            weight += i.getWeight() * i.getQuantity();
        }

        // Tạo request body
        ShipRequest request = ShipRequest.builder().serviceTypeId(SERVICE_TYPE).fromDistrictId(FROM_DISTRICT_ID).fromWardCode(FROM_WARD_CODE).toDistrictId(districtId).toWardCode(wardCode).length(length).width(width).height(height).weight(weight).insuranceValue(insurance_value)
//                .coupon(coupon)
                .items(items).build();

        String url = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";

        // Headers
        HttpHeaders headers = getHttpHeaders();
        headers.set("shop_id", String.valueOf(SHOP_ID));

        // Gửi request có body
        HttpEntity<ShipRequest> requestEntity = new HttpEntity<>(request, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            if (objectMapper.writeValueAsString(rootNode.path("code")).equalsIgnoreCase("200")){
                JsonNode dataNode = rootNode.path("data").path("total");
                return objectMapper.writeValueAsString(dataNode); // Chuyển về JSON String
            }
            return "";
        } catch (Exception e) {
            return "{\"error\":\"" + e.getMessage() + "\"}";
        }
    }

    public List<DiaChi> getAddressCustomer(Integer idKhachHang) {
        try {
            return diaChiRepo.findByKhachHang_IdKhachHang(idKhachHang);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void updateCustomerAddress(DiaChi diaChi, Integer idDiaChi,Integer idHoaDon) {
        List<DiaChi> listDiaChi = diaChiRepo.findByKhachHang_IdKhachHang(diaChi.getKhachHang().getIdKhachHang());
        for (DiaChi d : listDiaChi) {
            if (d.getId().equals(idDiaChi)) {
                d.setId(idDiaChi);
                d.setTenNguoiNhan(diaChi.getTenNguoiNhan());
                d.setSoDienThoai(diaChi.getSoDienThoai());
                d.setGhiChu(diaChi.getGhiChu());
                d.setMacDinh(true);
            }else{
                d.setMacDinh(false);
            }
        }
        diaChiRepo.saveAll(listDiaChi);
        updateShippingFee(diaChi, idHoaDon);
    }

    public void addNewAddress(
            DiaChi diaChi
            ,Integer idHoaDon
    ) {
        try {
            List<DiaChi> listDiaChi = diaChiRepo.findByKhachHang_IdKhachHang(diaChi.getKhachHang().getIdKhachHang());
            String provinceName = getProvince(diaChi.getThanhPho());
            String districtName = getDistricts(diaChi.getThanhPho(), diaChi.getQuanHuyen());
            String wardName = getWards(diaChi.getQuanHuyen(),diaChi.getXaPhuong());
            diaChi.setMacDinh(true);
            diaChi.setDiaChiChiTiet(diaChi.getDiaChiChiTiet() +"," +provinceName + "," + districtName + "," + wardName);
            DiaChi n = diaChiRepo.save(diaChi);
            for (DiaChi d : listDiaChi) {
                if (!d.getId().equals(n.getId())) {
                    d.setMacDinh(false);
                }
            }
            diaChiRepo.saveAll(listDiaChi);
            updateShippingFee(diaChi, idHoaDon);
        } catch (NumberFormatException e) {
            throw new RuntimeException(e);
        }
    }

    public void updateShippingFee(DiaChi diaChi, Integer idHoaDon) {
        HoaDon hd = hoaDonRepository.findById(idHoaDon).orElseThrow();
        BigDecimal newShippingFee = BigDecimal.valueOf(Long.parseLong(shippingFee(diaChi.getQuanHuyen(), diaChi.getXaPhuong(),hd.getIdHoaDon())));
        BigDecimal oldShippingFee =  hd.getPhiVanChuyen();

        BigDecimal chenhLech = newShippingFee.subtract(oldShippingFee).abs();

        if (newShippingFee.compareTo(oldShippingFee) < 0) {
            hd.setPhuPhi(BigDecimal.ZERO);
            hd.setHoanPhi(chenhLech);
        }else if(newShippingFee.compareTo(oldShippingFee) > 0) {
            hd.setPhuPhi(chenhLech);
            hd.setHoanPhi(BigDecimal.ZERO);
        }else{
            hd.setPhuPhi(BigDecimal.ZERO);
            hd.setHoanPhi(BigDecimal.ZERO);
        }
        hoaDonRepository.save(hd);
    }

}

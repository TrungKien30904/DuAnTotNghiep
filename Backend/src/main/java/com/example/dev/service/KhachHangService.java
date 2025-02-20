package com.example.dev.service;

import com.example.dev.entity.*;
import com.example.dev.entity.custom_entity.AddressModelCustom;
import com.example.dev.mapper.AddressMapper;
import com.example.dev.mapper.CustomerMapper;
import com.example.dev.mapper.SendMailMapper;
import com.example.dev.repository.*;
import com.example.dev.utils.IUtil;
import com.example.dev.utils.baseModel.BaseListResponse;
import com.example.dev.utils.baseModel.BaseResponse;
import com.example.dev.validator.KhachHangValidator;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.apache.jasper.JasperException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

@Service
public class KhachHangService {

    @Autowired
    private KhachHangRepo khachHangRepo;
    @Autowired
    private DiaChiRepo diaChiRepo;
    @Autowired
    private KhachHangValidator khachHangValidator;
    @Autowired
    private IUtil iUtil;
    @Autowired
    private ISendMailService sendMailService;
    @Autowired
    private ProvinceRepository provinceRepository;
    @Autowired
    private DistrictRepository districtRepository;
    @Autowired
    private WardRepository wardRepository;

    private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    public List<KhachHang> getAll() {
        return khachHangRepo.findAll();
    }

    @Transactional
    public BaseResponse<Integer> themKhachHang(String userJson, MultipartFile file) {
        BaseResponse<Integer> response = new BaseResponse<>();
        KhachHang khachHang = new KhachHang();
        CustomerMapper model = new CustomerMapper();
        try {
            ObjectMapper mapper = new ObjectMapper();
            model = mapper.readValue(userJson, CustomerMapper.class);
            khachHang.setMaKhachHang(model.getMaKhachHang());
            khachHang.setHoTen(model.getHoTen());
            khachHang.setEmail(model.getEmail());
            khachHang.setTrangThai(model.isTrangThai());
            khachHang.setGioiTinh(model.isGioiTinh());
            khachHang.setSoDienThoai(model.getSoDienThoai());
            String password = iUtil.generatePassword();
            khachHang.setMatKhau(password);
            khachHangValidator.validateKhachHang(khachHang, null);
        } catch (Exception e) {
            response.setFailResponse(e.getMessage(), null);
            return response;
        }

        Optional<KhachHang> existingPhone = khachHangRepo.findBySoDienThoai(khachHang.getSoDienThoai());
        if (existingPhone.isPresent()) {
            response.setFailResponse("Số điện thoại đã tồn tại", null);
            return response;
        }

        Optional<KhachHang> existingMa = khachHangRepo.findByMaKhachHang(khachHang.getMaKhachHang());
        if (existingMa.isPresent()) {
            response.setFailResponse("Mã khách hàng đã tồn tại", null);
            return response;
        }

        Optional<KhachHang> existingEmail = khachHangRepo.findByEmail(khachHang.getEmail());
        if (existingEmail.isPresent()) {
            response.setFailResponse("Email đã tồn tại", null);
            return response;
        }
        if(file.isEmpty()){
            response.setFailResponse("File image is empty", null);
            return response;
        }

        try{
            LocalDateTime localDateTime = LocalDateTime.now();
            String originalFilename = file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + localDateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()+ originalFilename);
            Files.copy(file.getInputStream(), path);
            khachHang.setHinhAnh(path.toString());
        }catch (Exception e){
            e.printStackTrace();
            response.setFailResponse(e.getMessage(), null);
            return response;
        }

        KhachHang modelSave = khachHangRepo.save(khachHang);
        if(modelSave.getIdKhachHang() != null) {
            DiaChi diaChi = new DiaChi();
            diaChi.setDiaChiChiTiet(model.getAddressDetails());
            diaChi.setThanhPho(String.valueOf(model.getProvinceId()));
            diaChi.setQuanHuyen(String.valueOf(model.getDistrictId()));
            diaChi.setXaPhuong(String.valueOf(model.getWardId()));
            diaChi.setSoDienThoai(model.getSoDienThoai());
            diaChi.setIdKhachHang(modelSave.getIdKhachHang());
            diaChi.setTenNguoiNhan(model.getHoTen());
            diaChi.setMacDinh(true);
            diaChi.setStage(1);
            diaChiRepo.saveAndFlush(diaChi);

            SendMailMapper sendMailMapper = new SendMailMapper();
            sendMailMapper.setToMail(khachHang.getEmail());
            sendMailMapper.setSubject("Notice: Register successfully");
            sendMailMapper.setContent("Welcome to CenciddiShop. Your account: " + khachHang.getEmail() + " , password: " + khachHang.getMatKhau() + ". Let login and try with special experience");
            int sendMailStatus = sendMailService.sendMail(sendMailMapper);
        }
        response.setSuccessResponse("Insert successful", modelSave.getIdKhachHang());
        return response;
    }

    @Transactional
    public BaseResponse<KhachHang> suaKhachHang(CustomerMapper model) {
        BaseResponse<KhachHang> baseResponse = new BaseResponse<>();

        KhachHang khachHang = new KhachHang();

        KhachHang existing = khachHangRepo.findByMaKhachHang(model.getMaKhachHang())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng"));
        khachHang = model.toKhachHang();

        try {
            khachHangValidator.validateKhachHang(khachHang, model.getId()); // Passing existing customer id for update
        } catch (Exception e) {
             baseResponse.setFailResponse(e.getMessage(), null);
             return baseResponse;
        }


        if(model.getImageBase64() != null && !model.getImageBase64().isEmpty()){
            try {
                LocalDateTime localDateTime = LocalDateTime.now();
                String outputFilePath = UPLOAD_DIR + localDateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli() + existing.getIdKhachHang() + "portrait.png";
                String base64String = model.getImageBase64().split("base64,")[1];
                byte[] imageBytes = Base64.getDecoder().decode(base64String);
                try (FileOutputStream fileOutputStream = new FileOutputStream(outputFilePath)) {
                    fileOutputStream.write(imageBytes);
                    existing.setHinhAnh(outputFilePath);
                    System.out.println("File saved successfully to " + outputFilePath);
                }
            } catch (IOException e) {
                System.err.println("Error while saving Base64 to file: " + e.getMessage());
                baseResponse.setFailResponse(e.getMessage(), null);
            }
        }

        existing.setHoTen(model.getHoTen());
        existing.setGioiTinh(model.isGioiTinh());
        existing.setSoDienThoai(model.getSoDienThoai());
        KhachHang modelSave =  khachHangRepo.saveAndFlush(existing);
        if(modelSave.getIdKhachHang() != null){
            baseResponse.setSuccessResponse("Information customer updated", modelSave);
        }
        if(modelSave.getIdKhachHang() != null) {
            List<DiaChi> diaChis = new ArrayList<>();
            // Check Exist Address
            if(!model.getAddressMappers().isEmpty()) {
                List<Integer> diaChiIds = model.getAddressMappers().stream().map(AddressMapper::getId).filter(eId -> eId != 0).toList();
                diaChiRepo.deleteAllById(diaChiIds);
                diaChiRepo.flush();
                diaChis = model.getAddressMappers().stream().filter(e -> e.getStage() == 1).map(e -> new DiaChi(null, e.getCustomerId() == 0 ? model.getId() : e.getCustomerId(), e.getNameReceive(), e.getPhoneNumber(), e.getProvinceId(),
                        e.getDistrictId(), e.getWardId(), e.getAddressDetail(), e.getNote(), e.isStatus(), 1)).toList();
                diaChiRepo.saveAllAndFlush(diaChis);
            }
        }

        return baseResponse;
    }
    @Transactional
    public BaseResponse<CustomerMapper> updateAddress(CustomerMapper model){
        BaseResponse<CustomerMapper> baseResponse = new BaseResponse<>();
        List<DiaChi> diaChis = new ArrayList<>();
        if(!model.getAddressMappers().isEmpty()) {
            List<Integer> diaChiIds = model.getAddressMappers().stream().map(AddressMapper::getId).filter(eId -> eId != 0).toList();
            diaChiRepo.deleteAllById(diaChiIds);
            diaChiRepo.flush();
            diaChis = model.getAddressMappers().stream().filter(e -> e.getStage() == 1).map(e -> new DiaChi(null, e.getCustomerId() == 0 ? model.getId() : e.getCustomerId(), e.getNameReceive(), e.getPhoneNumber(), e.getProvinceId(),
                    e.getDistrictId(), e.getWardId(), e.getAddressDetail(), e.getNote(), e.isStatus(), 1)).toList();
            diaChiRepo.saveAndFlush(diaChis.get(0));
        }
        baseResponse.setSuccessResponse("Update Success", model);
        return baseResponse;
    }

    @Transactional
    public void xoaKhachHang(Integer id) {
        khachHangRepo.deleteById(id);
    }

    public CustomerMapper detailKhachHang(Integer id) {
            Optional<KhachHang> model =  khachHangRepo.findById(id);
          CustomerMapper customerMapper = new CustomerMapper();
          if(model.isPresent()) {
              KhachHang modelPresent = model.get();
              customerMapper = new CustomerMapper();
              customerMapper.setId(modelPresent.getIdKhachHang());
              customerMapper.setMaKhachHang(modelPresent.getMaKhachHang());
              customerMapper.setSoDienThoai(modelPresent.getSoDienThoai());
              customerMapper.setTrangThai(modelPresent.getTrangThai());
              customerMapper.setGioiTinh(modelPresent.getGioiTinh());
              customerMapper.setHoTen(modelPresent.getHoTen());
              customerMapper.setEmail(modelPresent.getEmail());

              try{
                 if(modelPresent.getHinhAnh()  != null && !modelPresent.getHinhAnh().equals("")) {
                     Path path = Paths.get(modelPresent.getHinhAnh());
                     byte[] image = Files.readAllBytes(path);
                     if (!Files.exists(path)) {
                         throw new IOException("Image not found at path: " + path);
                     }
                     String imageBase64 =  Base64.getEncoder().encodeToString(image);
                     customerMapper.setImage("data:image/png;base64," +imageBase64);
                 }
              }
              catch (Exception e) {
                  e.printStackTrace();
                  System.out.println(e.getMessage());
              }

              List<DiaChi> diaChis = diaChiRepo.findDiaChiByIdKhachHang(modelPresent.getIdKhachHang());

              List<Integer> provinceIds = diaChis.stream().map(e -> Integer.parseInt(e.getThanhPho())).toList();
              List<Integer> districtIds = diaChis.stream().map(e -> Integer.parseInt(e.getQuanHuyen())).toList();
              List<Integer> wardIds = diaChis.stream().map(e -> Integer.parseInt(e.getXaPhuong())).toList();

              List<Province> provinces = provinceRepository.findAllById(provinceIds);
              List<District> districts = districtRepository.findAllById(districtIds);
              List<Ward> wards = wardRepository.findAllById(wardIds);


              if(!diaChis.isEmpty()){
                  List<AddressMapper> addressMappers = new ArrayList<>();
                  addressMappers = diaChis.stream().map(e -> new AddressMapper(e.getQuanHuyen(),
                                                                                      e.getId(),
                          e.getIdKhachHang(),
                          e.getTenNguoiNhan(),
                          e.getSoDienThoai(),
                          e.getThanhPho(),
                          e.getXaPhuong(),
                          e.getDiaChiChiTiet(),
                          e.getGhiChu(),
                          e.isMacDinh(),
                          provinces.stream().filter(p -> p.getId() == Integer.parseInt(e.getThanhPho())).findFirst().map(Province::getName).orElse(""),
                          districts.stream().filter(p -> p.getId() == Integer.parseInt(e.getQuanHuyen())).findFirst().map(District::getName).orElse(""),
                          wards.stream().filter(p -> p.getId() == Integer.parseInt(e.getXaPhuong())).findFirst().map(Ward::getName).orElse(""),
                          e.getStage())).collect(Collectors.toList());
                  customerMapper.setAddressMappers(addressMappers);
              }
          }
        return customerMapper;
    }

    public BaseListResponse<CustomerMapper> timKiem(String keyword, Boolean gioiTinh, Boolean trangThai, String soDienThoai, Pageable pageable) {

        Boolean finalGioiTinh = (gioiTinh != null) ? gioiTinh : null;
        Boolean finalTrangThai = (trangThai != null) ? trangThai : null;
        Page<KhachHang> models = khachHangRepo.timKiem(keyword, finalTrangThai, finalGioiTinh, soDienThoai, pageable);
        BaseListResponse<CustomerMapper> response = new BaseListResponse<>();
        List<KhachHang> customerList = models.getContent();
        List<Integer> customerIds = customerList.stream().map(KhachHang::getIdKhachHang).toList();
        List<AddressModelCustom> addressModelCustoms = new ArrayList<>();
        try{
            addressModelCustoms = diaChiRepo.getByCustomerId(customerIds);
        }
        catch (Exception e){
            e.printStackTrace();
        }
        List<CustomerMapper> customerMappers = new ArrayList<>();
        for(KhachHang e: customerList){
            CustomerMapper customerMapperModel = e.toKhachHang();
            addressModelCustoms.stream().filter(address -> address.getId() == e.getIdKhachHang()).findFirst().ifPresent(model -> customerMapperModel.setAddressDetail(model.getFullInfo()));
            customerMappers.add(customerMapperModel);
        }
        response.setTotalCount(models.getTotalPages());
        response.setSuccessResponse("Success", customerMappers);
        return response;
    }
}

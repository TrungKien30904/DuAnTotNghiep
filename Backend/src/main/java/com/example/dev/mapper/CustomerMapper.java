package com.example.dev.mapper;

import com.example.dev.entity.KhachHang;

import java.util.List;

public class CustomerMapper {

    private int id;
    private String maKhachHang;
    private String hoTen;
    private boolean gioiTinh;
    private String soDienThoai;
    private String email;
    private String matKhau;
    private String addressDetails;
    private int provinceId;
    private int districtId;
    private int wardId;
    private boolean trangThai;
    private List<AddressMapper> addressMappers;
    private String image;
    private String addressDetail;
    private String imageBase64;

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public CustomerMapper() {
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public CustomerMapper(boolean gioiTinh, int id, String maKhachHang, String hoTen, String soDienThoai, String email, String matKhau, String addressDetails, int provinceId, int districtId, int wardId, boolean trangThai, List<AddressMapper> addressMappers, String image) {
        this.gioiTinh = gioiTinh;
        this.id = id;
        this.maKhachHang = maKhachHang;
        this.hoTen = hoTen;
        this.soDienThoai = soDienThoai;
        this.email = email;
        this.matKhau = matKhau;
        this.addressDetails = addressDetails;
        this.provinceId = provinceId;
        this.districtId = districtId;
        this.wardId = wardId;
        this.trangThai = trangThai;
        this.addressMappers = addressMappers;
    }

    public List<AddressMapper> getAddressMappers() {
        return addressMappers;
    }

    public void setAddressMappers(List<AddressMapper> addressMappers) {
        this.addressMappers = addressMappers;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMaKhachHang() {
        return maKhachHang;
    }

    public void setMaKhachHang(String maKhachHang) {
        this.maKhachHang = maKhachHang;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public boolean isGioiTinh() {
        return gioiTinh;
    }

    public void setGioiTinh(boolean gioiTinh) {
        this.gioiTinh = gioiTinh;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }

    public String getAddressDetails() {
        return addressDetails;
    }

    public void setAddressDetails(String addressDetails) {
        this.addressDetails = addressDetails;
    }

    public int getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(int provinceId) {
        this.provinceId = provinceId;
    }

    public int getDistrictId() {
        return districtId;
    }

    public void setDistrictId(int districtId) {
        this.districtId = districtId;
    }

    public int getWardId() {
        return wardId;
    }

    public void setWardId(int wardId) {
        this.wardId = wardId;
    }

    public boolean isTrangThai() {
        return trangThai;
    }

    public void setTrangThai(boolean trangThai) {
        this.trangThai = trangThai;
    }

    public KhachHang toKhachHang() {
        KhachHang cus = new KhachHang();
        cus.setIdKhachHang(this.getId());
        cus.setHinhAnh(this.getImage());
        cus.setMatKhau(this.getMatKhau());
        cus.setEmail(this.getEmail());
        cus.setGioiTinh(this.isGioiTinh());
        cus.setMaKhachHang(this.getMaKhachHang());
        cus.setSoDienThoai(this.getSoDienThoai());
        cus.setTrangThai(this.isTrangThai());
        cus.setHoTen(this.getHoTen());
        cus.setEmail(this.getEmail());
        return cus;
    }

    public String getAddressDetail() {
        return addressDetail;
    }

    public void setAddressDetail(String addressDetail) {
        this.addressDetail = addressDetail;
    }
}

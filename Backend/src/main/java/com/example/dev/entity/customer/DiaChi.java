package com.example.dev.entity.customer;

import jakarta.persistence.*;

@Entity
@Table(name = "dia_chi")
public class DiaChi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dia_chi")
    private Integer id;

    @Column(name = "id_khach_hang", nullable = false)
    private Integer idKhachHang;

    @Column(name = "ten_nguoi_nhan", nullable = false, length = 255)
    private String tenNguoiNhan;

    @Column(name = "so_dien_thoai", nullable = false, length = 20)
    private String soDienThoai;

    @Column(name = "thanh_pho", nullable = false, length = 255)
    private String thanhPho;

    @Column(name = "quan_huyen", nullable = false, length = 255)
    private String quanHuyen;

    @Column(name = "xa_phuong", nullable = false, length = 255)
    private String xaPhuong;

    @Column(name = "dia_chi_chi_tiet", nullable = false, length = 255)
    private String diaChiChiTiet;

    @Column(name = "ghi_chu", columnDefinition = "NVARCHAR(MAX)")
    private String ghiChu;

    @Column(name = "mac_dinh", nullable = false)
    private boolean macDinh;
    @Column(name = "stage", nullable = true)
    private int stage;

    public DiaChi() {
    }

    public DiaChi(Integer id, Integer idKhachHang, String tenNguoiNhan, String soDienThoai,
                  String thanhPho, String quanHuyen, String xaPhuong,
                  String diaChiChiTiet, String ghiChu, boolean macDinh, int stage) {
        this.id = id;
        this.idKhachHang = idKhachHang;
        this.tenNguoiNhan = tenNguoiNhan;
        this.soDienThoai = soDienThoai;
        this.thanhPho = thanhPho;
        this.quanHuyen = quanHuyen;
        this.xaPhuong = xaPhuong;
        this.diaChiChiTiet = diaChiChiTiet;
        this.ghiChu = ghiChu;
        this.macDinh = macDinh;
        this.stage = stage;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdKhachHang() {
        return idKhachHang;
    }

    public void setIdKhachHang(Integer idKhachHang) {
        this.idKhachHang = idKhachHang;
    }

    public String getTenNguoiNhan() {
        return tenNguoiNhan;
    }

    public void setTenNguoiNhan(String tenNguoiNhan) {
        this.tenNguoiNhan = tenNguoiNhan;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public String getThanhPho() {
        return thanhPho;
    }

    public void setThanhPho(String thanhPho) {
        this.thanhPho = thanhPho;
    }

    public String getQuanHuyen() {
        return quanHuyen;
    }

    public void setQuanHuyen(String quanHuyen) {
        this.quanHuyen = quanHuyen;
    }

    public String getXaPhuong() {
        return xaPhuong;
    }

    public void setXaPhuong(String xaPhuong) {
        this.xaPhuong = xaPhuong;
    }

    public String getDiaChiChiTiet() {
        return diaChiChiTiet;
    }

    public void setDiaChiChiTiet(String diaChiChiTiet) {
        this.diaChiChiTiet = diaChiChiTiet;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public boolean isMacDinh() {
        return macDinh;
    }

    public void setMacDinh(boolean macDinh) {
        this.macDinh = macDinh;
    }

    public int getStage() {
        return stage;
    }

    public void setStage(int stage) {
        this.stage = stage;
    }

}

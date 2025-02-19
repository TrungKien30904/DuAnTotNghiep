package com.example.dev.entity;

import com.example.dev.mapper.CustomerMapper;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;


@Entity
@Table(name = "khach_hang")
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_khach_hang")
    private Integer idKhachHang;

    @Column(name = "ma_khach_hang", length = 50, unique = true)
    private String maKhachHang;

    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 255, message = "Họ tên không được vượt quá 255 ký tự")
    @Column(name = "ho_ten", nullable = false)
    private String hoTen;

    @NotNull(message = "Giới tính không được để trống")
    @Column(name = "gioi_tinh", nullable = false)
    private Boolean gioiTinh;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(max = 50, message = "Số điện thoại không được vượt quá 50 ký tự")
    @Pattern(regexp = "0[0-9]{9}", message = "Số điện thoại không hợp lệ")
    @Column(name = "so_dien_thoai", nullable = false)
    private String soDienThoai;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Size(max = 255, message = "Email không được vượt quá 255 ký tự")
    @Column(name = "email", nullable = false)
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    @Column(name = "mat_khau", nullable = false)
    private String matKhau;

    @NotNull(message = "Trạng thái không được để trống")
    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai;

    @Column(name = "hinh_anh")
    private String hinhAnh;

    public KhachHang() {
    }

    public KhachHang(Integer idKhachHang, String maKhachHang, String hoTen, Boolean gioiTinh, String soDienThoai, String email, String matKhau, Boolean trangThai, String hinhAnh) {
        this.idKhachHang = idKhachHang;
        this.maKhachHang = maKhachHang;
        this.hoTen = hoTen;
        this.gioiTinh = gioiTinh;
        this.soDienThoai = soDienThoai;
        this.email = email;
        this.matKhau = matKhau;
        this.trangThai = trangThai;
        this.hinhAnh = hinhAnh;
    }

    public Integer getIdKhachHang() {
        return idKhachHang;
    }

    public void setIdKhachHang(Integer idKhachHang) {
        this.idKhachHang = idKhachHang;
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

    public Boolean getGioiTinh() {
        return gioiTinh;
    }

    public void setGioiTinh(Boolean gioiTinh) {
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

    public Boolean getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(Boolean trangThai) {
        this.trangThai = trangThai;
    }

    public String getHinhAnh() {
        return hinhAnh;
    }

    public void setHinhAnh(String hinhAnh) {
        this.hinhAnh = hinhAnh;
    }
    public CustomerMapper toKhachHang() {
        CustomerMapper cus = new CustomerMapper();
        cus.setId(this.getIdKhachHang());
        cus.setImage(this.getHinhAnh());
        cus.setMatKhau(this.getMatKhau());
        cus.setEmail(this.getEmail());
        cus.setGioiTinh(this.getGioiTinh());
        cus.setMaKhachHang(this.getMaKhachHang());
        cus.setSoDienThoai(this.getSoDienThoai());
        cus.setTrangThai(this.getTrangThai());
        cus.setHoTen(this.getHoTen());
       return cus;
    }
}

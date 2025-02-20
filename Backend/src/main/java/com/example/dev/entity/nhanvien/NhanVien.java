package com.example.dev.entity.nhanvien;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "nhan_vien")
public class NhanVien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nhan_vien")
    private Integer idNhanVien;

    @Column(name = "ten")
    private String ten;
    @Column(name = "gioi_tinh")
    private String gioiTinh;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name="ngay_sinh")
    private LocalDate ngaySinh;
    @Column(name="so_dien_thoai")
    private String soDienThoai;
    @Email
    @Column(name="email")
    private String email;
    @Column(name="vai_tro")
    private String vaiTro;
    @Column(name="mat_khau")
    private String matKhau;
    @Column(name="trang_thai")
    private Boolean trangThai;
    @Column(name="hinh_anh")
    private String hinh_anh;
    @Column(name="cccd")
    private String cccd;
    @Column(name="diachi")
    private String diachi;
}
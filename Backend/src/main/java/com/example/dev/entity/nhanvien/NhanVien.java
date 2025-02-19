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
    private Integer idNhanVien;

    private String ten;
    private String gioiTinh;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate ngaySinh;
    private String soDienThoai;
    @Email
    private String email;
    private String vaiTro;
    private String matKhau;
    private Boolean trangThai;
    private String hinh_anh;
    private String cccd;
    private String diachi;
}
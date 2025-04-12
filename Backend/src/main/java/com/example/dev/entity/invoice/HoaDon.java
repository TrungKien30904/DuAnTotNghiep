package com.example.dev.entity.invoice;
import com.example.dev.entity.PhieuGiamGia;
import com.example.dev.entity.customer.KhachHang;
import com.example.dev.entity.nhanvien.NhanVien;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hoa_don")
public class HoaDon {
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idHoaDon;
    private String maHoaDon;

    @ManyToOne
    @JoinColumn(name = "id_khuyen_mai")
    private PhieuGiamGia phieuGiamGia;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;

    @ManyToOne
    @JoinColumn(name = "id_nhan_vien")
    private NhanVien nhanVien;
    private BigDecimal tongTien;
    private String tenNguoiNhan;
    private String soDienThoai;
    private String email;
    private LocalDateTime ngayGiaoHang;
    private BigDecimal phiVanChuyen;
    private BigDecimal phuPhi;
    private BigDecimal hoanPhi;
    private String trangThai;
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
    private String nguoiTao;
    private String nguoiSua;
    private String loaiDon;
    private String phuongThucNhanHang;
    private Integer tinhThanhPho;
    private Integer quanHuyen;
    private String xaPhuong;
    private String diaChiChiTiet;
    private String ghiChu;
    private BigDecimal giaDuocGiam;

}

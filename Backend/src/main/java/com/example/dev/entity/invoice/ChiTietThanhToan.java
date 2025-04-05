package com.example.dev.entity.invoice;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chi_tiet_thanh_toan")
@Builder
public class ChiTietThanhToan {
    @Id
    private String id;
    private String maDoiTac ;
    private String maGiaoDichDoiTac ;
    private String thongTinGiaoDich;
    private BigDecimal soTien;
    private String maGiaoDich;
    private String nganHang;
    private String thoiGianTao;
    @JoinColumn(name = "id_thanh_toan")
    @ManyToOne
    private ThanhToanHoaDon thanhToanHoaDon;
}

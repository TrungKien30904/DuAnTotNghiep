package com.example.dev.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "san_pham")
public class SanPham {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSanPham;


    private String tenSanPham;
    private Boolean trangThai = true;
    @Column(updatable = false)
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
    @Column(updatable = false)
    private String nguoiTao;
    private String nguoiSua;
}
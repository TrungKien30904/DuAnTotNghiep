package com.example.dev.entity.attribute;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

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
    @Column(unique = true)
    private String maSanPham;
    @NotNull
    @Column(name = "ten_san_pham")
    private String ten;
    private Boolean trangThai = true;
    @Column(updatable = false)
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
    @Column(updatable = false)
    private String nguoiTao;
    private String nguoiSua;
}
package com.example.dev.entity.attribute;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "danh_muc_san_pham")
public class DanhMucSanPham {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDanhMuc;
    @NotEmpty
    private String ten;
    private Boolean trangThai = true;
}
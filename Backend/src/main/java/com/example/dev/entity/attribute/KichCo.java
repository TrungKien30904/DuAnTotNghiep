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
@Table(name = "kich_co")
public class KichCo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idKichCo;
    @NotEmpty
    private String ten;
    private Boolean trangThai = true;
}

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
@Table(name = "de_giay")
public class DeGiay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDeGiay;
    @NotEmpty
    private String ten;
    private Boolean trangThai = true;
}

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
@Table(name = "mui_giay")
public class MuiGiay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idMuiGiay;
    @NotEmpty
    private String ten;
    private Boolean trangThai = true;

}

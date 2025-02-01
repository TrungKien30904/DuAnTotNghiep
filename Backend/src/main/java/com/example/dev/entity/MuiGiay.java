package com.example.dev.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

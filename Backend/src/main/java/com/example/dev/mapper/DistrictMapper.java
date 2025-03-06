package com.example.dev.mapper;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class DistrictMapper {

    private int id;
    private int provinceId;
    private String code;
    private String name;
}

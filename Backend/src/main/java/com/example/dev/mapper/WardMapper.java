package com.example.dev.mapper;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class WardMapper {

    private int id;
    private int districtId;
    private String code;
    private String name;
}

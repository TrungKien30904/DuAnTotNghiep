package com.example.dev.model;

import com.example.dev.mapper.WardMapper;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class WardModel {
    private String name;
    private Integer code;
    private String division_type;
    private String codename;
    private String district_code;
    public WardMapper toWardMapper(){
        WardMapper mapper = new WardMapper();
        mapper.setId(code);
        mapper.setName(name);
        mapper.setDistrictId(Integer.parseInt(district_code));
        mapper.setCode(codename);
        return mapper;
    }
}

package com.example.dev.model;

import com.example.dev.mapper.ProvinceMapper;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProvinceModel {
    private String name;
    private Integer code;
    private String division_type;
    private String codename;
    private String phone_code;
    private List<DistrictModel> districts;

    public ProvinceMapper toProvinceMapper(){
        ProvinceMapper mapper = new ProvinceMapper();
        mapper.setId(code);
        mapper.setName(name);
        mapper.setCode(codename);
        return mapper;
    }
}

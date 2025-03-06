package com.example.dev.model;

import com.example.dev.mapper.DistrictMapper;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class DistrictModel {
    private String name;
    private Integer code;
    private String division_type;
    private String codename;
    private String province_code;
    private List<WardModel> wards;
    public DistrictMapper toDistrictMapper(){
        DistrictMapper mapper = new DistrictMapper();
        mapper.setCode(codename);
        mapper.setId(code);
        mapper.setName(name);
        mapper.setProvinceId(Integer.parseInt(province_code));
        return mapper;
    }
}

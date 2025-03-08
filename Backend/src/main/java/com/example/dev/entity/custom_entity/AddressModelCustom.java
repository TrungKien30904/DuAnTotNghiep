package com.example.dev.entity.custom_entity;
import lombok.*;
import org.springframework.util.StringUtils;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class AddressModelCustom {
    private int id;
    private String fullName;
    private int provinceId;
    private String provinceName;
    private int districtId;
    private String districtName;
    private int wardId;
    private String wardName;
    private String addressDetail;
    public String getFullInfo(){
        return (this.addressDetail == null || this.addressDetail.isEmpty()) ? "" : (this.addressDetail + " - ")
                                                                                   + ((this.wardName == null || this.wardName.isEmpty()) ? "" : (this.wardName + " - "))
                                                                                   + ((this.districtName == null || this.districtName.isEmpty()) ? "" : (this.districtName + " - "))
                                                                                   + ((this.provinceName == null || this.provinceName.isEmpty()) ? "" : (this.provinceName));
    }
}

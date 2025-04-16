package com.example.dev.util.baseModel;

import com.example.dev.constant.BaseConstant;
import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BaseResponse <T>{
    private int code;
    private boolean isSuccess;
    private String message;
    private T data;

    public void setFailResponse(String message, T data){
        this.message = message;
        this.data = data;
        this.isSuccess = false;
        this.code =  BaseConstant.CustomResponseCode.ERROR.getCode();
    }

    public void setSuccessResponse(String message, T data){
        this.message = message;
        this.data = data;
        this.isSuccess = true;
        this.code = BaseConstant.CustomResponseCode.SUCCESS.getCode();
    }
}

package com.example.dev.util.baseModel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
public class BaseListResponse<T>{

    @Getter
    private int code;
    private boolean isSuccess;
    @Getter
    private String message;
    @Getter
    private List<T> data;
    @Getter
    private int totalCount;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public boolean isSuccess() {
        return isSuccess;
    }

    public void setSuccess(boolean success) {
        isSuccess = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public void setFailResponse(String message, List<T> data){
        this.message = message;
        this.data = data;
        this.isSuccess = false;
        this.code = -1;
    }

    public void setSuccessResponse(String message, List<T> data){
        this.message = message;
        this.data = data;
        this.isSuccess = true;
        this.code = 200;
    }

}

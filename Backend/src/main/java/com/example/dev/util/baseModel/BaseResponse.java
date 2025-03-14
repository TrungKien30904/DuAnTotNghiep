package com.example.dev.util.baseModel;

import lombok.*;

@Builder
public class BaseResponse <T>{
    private int code;
    private boolean isSuccess;
    private String message;
    private T data;

    public BaseResponse(int code, boolean isSuccess, String message, T data) {
        this.code = code;
        this.isSuccess = isSuccess;
        this.message = message;
        this.data = data;
    }

    public BaseResponse() {
    }

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

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public void setFailResponse(String message, T data){
        this.message = message;
        this.data = data;
        this.isSuccess = false;
        this.code = -1;
    }

    public void setSuccessResponse(String message, T data){
        this.message = message;
        this.data = data;
        this.isSuccess = true;
        this.code = 200;
    }
}

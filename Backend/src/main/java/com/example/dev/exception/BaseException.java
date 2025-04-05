package com.example.dev.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class BaseException extends RuntimeException {
    private int code;
    private String message;
    private String[] arguments;

    public BaseException(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
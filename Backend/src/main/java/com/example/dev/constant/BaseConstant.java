package com.example.dev.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
public class BaseConstant {

    @Getter
    @AllArgsConstructor
    public enum Action{
        CREATE("CREATE"), UPDATE("UPDATE"), DELETE("DELETE");
        private final String value;
    }

    @Getter
    @AllArgsConstructor
    public enum CustomResponseCode{
        SUCCESS(200, "success"),ERROR(500, "error");
        private final int code;
        private final String message;
    }
}

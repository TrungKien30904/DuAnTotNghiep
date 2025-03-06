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
}

package com.example.dev.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Diff {
    private String fieldName;   // Tên trường thay đổi
    private Object oldValue;    // Giá trị cũ của trường
    private Object newValue;
}
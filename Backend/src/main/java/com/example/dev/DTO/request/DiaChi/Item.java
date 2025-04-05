package com.example.dev.DTO.request.DiaChi;

import jakarta.persistence.Entity;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Item {
    private String name;
    private int quantity;
    private int length;
    private int width;
    private int height;
    private int weight;
}

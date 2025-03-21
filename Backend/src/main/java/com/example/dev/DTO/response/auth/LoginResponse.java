package com.example.dev.DTO.response.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String refreshToken;
}

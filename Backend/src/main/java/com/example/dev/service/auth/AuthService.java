package com.example.dev.service.auth;

import com.example.dev.DTO.response.auth.LoginResponse;
import org.springframework.security.core.Authentication;

public interface AuthService {
    LoginResponse login(String username, String password, boolean isCustomer);

    LoginResponse getToken(Authentication authentication);
}

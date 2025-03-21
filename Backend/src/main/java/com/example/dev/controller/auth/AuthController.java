package com.example.dev.controller.auth;

import com.example.dev.DTO.request.auth.LoginRequest;
import com.example.dev.DTO.response.auth.LoginResponse;
import com.example.dev.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest.getUsername(), loginRequest.getPassword(),loginRequest.getIsCustomer()));
    }

    @PostMapping("/get-token")
    public ResponseEntity<?> getToken(Authentication authentication) {
        return ResponseEntity.ok(authService.getToken(authentication));
    }
}

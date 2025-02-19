package com.example.dev.service.nhanvien;

import java.util.Base64;

public class EmailAuthenticator {
    private String username;
    private String password;

    public EmailAuthenticator(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getEncodedCredentials() {
        String credentials = username + ":" + password;
        return Base64.getEncoder().encodeToString(credentials.getBytes());
    }
}
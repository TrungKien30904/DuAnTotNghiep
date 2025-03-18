package com.example.dev.security;

import com.example.dev.DTO.UserLogin.UserLogin;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class JWTService {
//    @Value("JWT_SECRET_KEY")
    private final String secretKey = "kadfnkacytqwpejcnjvlasdfnfewia1238cnjajaslmvnabcowdgu39236fjai123lakldmcldnci10kdsnchamvoweoe";

//    @Value("ISSUER")
    private String issuer = "cenndii";

    public String generateToken(UserLogin userLogin) {
        //    @Value("TOKEN_EXPIRED_TIME")
        long jwtExpiration = 3600000;
        return buildToken(userLogin, jwtExpiration);
    }

    public String generateRefreshToken(UserLogin userLogin) {
        //    @Value("REFRESH_TOKEN_EXPIRED_TIME")
        long refreshTokenExpiration = 10800000;
        return buildToken(userLogin, refreshTokenExpiration);
    }

    public String buildToken(UserLogin userLogin, long expiredTime) {
        byte[] secretKeyBytes = Decoders.BASE64.decode(secretKey);
        SecretKey key = Keys.hmacShaKeyFor(secretKeyBytes);
        Map<String, Object> claims = buildClaims(userLogin);
        return Jwts.builder()
                .setIssuedAt(new Date())
                .setClaims(claims)
                .setSubject(userLogin.getUsername())
                .setIssuer(issuer)
                .signWith(key, SignatureAlgorithm.HS512)
                .setExpiration(new Date(System.currentTimeMillis() + expiredTime))
                .compact();
    }

    public Map<String, Object> buildClaims(UserLogin userLogin) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userName", userLogin.getUsername());
        claims.put("phoneNum", userLogin.getPhoneNum());
        claims.put("permissions", userLogin.getPermissions());
        return claims;
    }

    public UserLogin getUserLogin(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        Claims claims = extractClaims(token);
        if (claims == null) {
            return null;
        }

        // Ép kiểu chính xác về List<String>
        List<String> permissions = claims.get("permissions", List.class);
        return UserLogin.builder()
                .userName(claims.getSubject())
                .permissions(permissions != null ? permissions : new ArrayList<>()) // Đề phòng null
                .build();
    }


    public Claims extractClaims(String token) {
        try {
            if (token == null || token.isEmpty()) {
                return null;
            }
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }catch (ExpiredJwtException ex) {
            throw new ExpiredJwtException(ex.getHeader(), ex.getClaims(), "Token đã hết hạn!");
        } catch (Exception ex) {
            throw new RuntimeException("Lỗi khi parse token: " + ex.getMessage());
        }
    }


}

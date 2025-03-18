package com.example.dev.security;

import com.example.dev.DTO.UserLogin.UserLogin;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {
    private final static String AUTH_HEADER = "Authorization";
    private final static String AUTH_PREFIX = "Bearer ";

    private final JWTService jwtService;



    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    )throws ServletException, IOException {
        try {
            String token = getTokenFromRequest(request);
            if (StringUtils.hasText(token)) {
                UserLogin userLogin = jwtService.getUserLogin(token);
                if (userLogin != null) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userLogin, null, userLogin.getAuthorities());
                    authentication.setDetails(userLogin);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
            filterChain.doFilter(request, response);
        }catch (Exception e) {
            throw new ServletException(e);
        }
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTH_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(AUTH_PREFIX)) {
            return bearerToken.substring(AUTH_PREFIX.length());
        }
        return null;
    }
}

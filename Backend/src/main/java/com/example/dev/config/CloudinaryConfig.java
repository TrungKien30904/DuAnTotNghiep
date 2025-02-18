package com.example.dev.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary(){
        final Map<String,String> cldConfig = new HashMap<>();
        cldConfig.put("cloud_name","dabnimezp");
        cldConfig.put("api_key","262779675266726");
        cldConfig.put("api_secret","YTjOMVpZdXVaIQSFkgsRD0w0rbU");
        return new Cloudinary(cldConfig);
    }
}

package com.example.dev.util.utilsImpl;

import com.example.dev.util.IRestService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@Service
public class RestServiceImpl implements IRestService {

    @Override
    public String callRestUrl(String url, Integer parameter) {
        try{
            RestTemplate restTemplate = new RestTemplate();
            Map<String, String> params = Collections.singletonMap("id", String.valueOf(parameter));
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class, params);
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
            return objectMapper.writeValueAsString(response.getBody());
        }
        catch (Exception e){
            return null;
        }
    }
}

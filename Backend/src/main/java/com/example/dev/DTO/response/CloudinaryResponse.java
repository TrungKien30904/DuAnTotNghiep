package com.example.dev.DTO.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CloudinaryResponse {
    private String publicId;

    private String url;
}

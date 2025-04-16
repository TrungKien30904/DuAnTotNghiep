package com.example.dev.DTO.request.SearchRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchRequest {
    private String keyword;
    private int page;
    private int size;
    private String sortBy;
    private String sortOrder;
}

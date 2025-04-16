package com.example.dev.DTO.response.SearchResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.poi.ss.formula.functions.T;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchResponse {
    private List<?> results;
    private int totalPage;
    private int page;
    private int size;
    private Boolean hasNext;
    private Boolean hasPrevious;
}

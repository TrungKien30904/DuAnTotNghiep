package com.example.dev.util.Page;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;

public class GeneratePageable {
    public static Pageable createPageable(int page, int size, String sortBy, String sortOrder) {
        Pageable pageable = null;
        if (page >= 0){
            pageable = PageRequest.of(page, size);
            if (StringUtils.hasText(sortBy)) {
                if (StringUtils.hasText(sortOrder) && sortOrder.equalsIgnoreCase("asc")) {
                    pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
                }else{
                    pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
                }
            }
        }
        return pageable;
    }
}

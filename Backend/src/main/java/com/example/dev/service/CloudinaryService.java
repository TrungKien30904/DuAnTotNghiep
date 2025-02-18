package com.example.dev.service;

import com.cloudinary.Cloudinary;
import com.example.dev.DTO.response.CloudinaryResponse;
import com.example.dev.exception.FuncErrorException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;

    @Transactional
    public CloudinaryResponse uploadFile(final MultipartFile file, final String fileName, String colorName,Integer idSanPham) {
        try {
            final Map result = this.cloudinary.uploader()
                    .upload(file.getBytes(),
                            Map.of("public_id",
                                    "cenndiii_shop/"+idSanPham+"/"+colorName.substring(1,7)+"/"
                                            + fileName));
            final String url      = (String) result.get("secure_url");
            final String publicId = (String) result.get("public_id");
            return CloudinaryResponse.builder().publicId(publicId).url(url)
                    .build();

        } catch (final Exception e) {
            System.out.println(e.getMessage());
            throw new FuncErrorException("Không thể thêm ảnh !");
        }
    }

    public void deleteImage(final String publicId) {
        try {
            this.cloudinary.uploader().destroy(publicId, Map.of());
        }catch (final Exception e) {
            throw new FuncErrorException("Không thể xoa ảnh !");
        }
    }
}

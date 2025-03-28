package com.example.dev.service;

import com.example.dev.entity.ChiTietSanPham;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import java.util.Hashtable;
import java.util.Base64;

public class QRCodeUtil {
    public static String generateQRCode(String  ctsp) {
//        String content = "id=" + ctsp;

        // Mã hóa Base64
        return Base64.getEncoder().encodeToString(ctsp.getBytes());
    }

    private static String generateQRCodeContent(String content) {
        try {
            Hashtable<EncodeHintType, String> hintMap = new Hashtable<>();
            hintMap.put(EncodeHintType.CHARACTER_SET, "UTF-8");

            MultiFormatWriter writer = new MultiFormatWriter();
            BitMatrix matrix = writer.encode(content, BarcodeFormat.QR_CODE, 200, 200, hintMap);

            StringBuilder sb = new StringBuilder();
            for (int y = 0; y < matrix.getHeight(); y++) {
                for (int x = 0; x < matrix.getWidth(); x++) {
                    sb.append(matrix.get(x, y) ? "1" : "0");
                }
            }
            return sb.toString(); // Trả về mã QR dưới dạng chuỗi mã nhị phân (hoặc có thể lưu dưới dạng hình ảnh)
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

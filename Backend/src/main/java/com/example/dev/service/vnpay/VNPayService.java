package com.example.dev.service.vnpay;

import com.example.dev.config.vnpay.VNPayConfig;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.codec.binary.Hex;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VNPayService {

    public String createPaymentUrl(Integer orderId, BigDecimal amount, HttpServletRequest req ) {
        try {

            Map<String, String> params = new HashMap<>();
            String vnp_IpAddr = VNPayConfig.getIpAddress(req);
            String orderType ="other" ;
            String vnp_TxnRef=orderId.toString();
            String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
            long amount1 = (amount != null) ? amount.multiply(BigDecimal.valueOf(100)).longValue() : 0L;

            params.put("vnp_Version", VNPayConfig.vnp_Version);
            params.put("vnp_Command",VNPayConfig.vnp_Command);
            params.put("vnp_TmnCode", vnp_TmnCode);
            params.put("vnp_Amount", String.valueOf(amount1)); // Sửa cách làm tròn
            params.put("vnp_CurrCode", "VND");
            String bankCode = req.getParameter("bankCode");
            if (bankCode != null && !bankCode.isEmpty()) {
                params.put("vnp_BankCode", "NCB");
            }
            params.put("vnp_TxnRef", vnp_TxnRef);
            params.put("vnp_OrderInfo", "Thanh toán đơn hàng: " + orderId.toString());
            params.put("vnp_Locale", "vn");
            params.put("vnp_OrderType", orderType);
            params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
            params.put("vnp_IpAddr", vnp_IpAddr); // Lấy địa chỉ IP của khách hàng

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            params.put("vnp_CreateDate", vnp_CreateDate);

            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            params.put("vnp_ExpireDate", vnp_ExpireDate);
            // Sắp xếp tham số và tạo chuỗi hash
            List<String> fieldNames = new ArrayList<>(params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            for (String fieldName : fieldNames) {
                String fieldValue = params.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString())).append('&');
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8.toString())).append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString())).append('&');
                }
            }

            // Xóa ký tự `&` cuối cùng
            if (hashData.length() > 0) {
                hashData.setLength(hashData.length() - 1);
            }
            if (query.length() > 0) {
                query.setLength(query.length() - 1);
            }

            // Print hashData for debugging
            System.out.println("hashData: " + hashData.toString());

            // Tạo SecureHash
            String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashData.toString());
            query.append("&vnp_SecureHash=").append(vnp_SecureHash);

            // Print query for debugging
            System.out.println("query: " + query.toString());

            // Tạo URL thanh toán
            String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + query.toString();

            return paymentUrl;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


}

package com.example.dev.service.payments;

import com.example.dev.config.vnpay.VNPayConfig;
import com.example.dev.entity.invoice.ChiTietThanhToan;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.example.dev.security.JWTFilter.IP_ADDRESS;

@Slf4j
@Service
public class VNPayService {
    private static final String VNP_API_URL = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
    private static final String VNP_PAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private static final String VNP_RETURN_URL = "http:/localhost:3000/admin/payment-status";
    private static final String VNP_TMN_CODE = "MB2AP42D";
    private static final String SECRET_KEY = "TRVEDBVSDYYRGJI87IWXCJ0NRZZW4ODK";
    private static final String VNP_VERSION = "2.1.0";
    public static ChiTietThanhToan chiTietThanhToan;
    public String createPaymentUrl(long amount, String bankCode, String language, String vnp_TxnRef, String vnp_IpAddr) {
        String vnp_Command = "pay";
        String orderType = "other";
        amount *= 100; // Chỉ nhân đúng 1 lần

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VNP_VERSION);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", VNP_TMN_CODE);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", (language != null && !language.isEmpty()) ? language : "vn");
        vnp_Params.put("vnp_ReturnUrl", VNP_RETURN_URL);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // Xử lý thời gian
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15);
        vnp_Params.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        // Sắp xếp params theo key (bắt buộc)
        SortedMap<String, String> sortedParams = new TreeMap<>(vnp_Params);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (value != null && !value.isEmpty()) {
                hashData.append(key).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII)) // Encode đúng chuẩn
                        .append('&');

                query.append(key).append('=').append(URLEncoder.encode(value, StandardCharsets.UTF_8)) // Query vẫn giữ UTF-8
                        .append('&');
            }
        }

// Xóa ký tự & cuối chuỗi nếu có dữ liệu
        if (!hashData.isEmpty()) {
            hashData.setLength(hashData.length() - 1);
        }
        if (!query.isEmpty()) {
            query.setLength(query.length() - 1);
        }

        // Tạo chữ ký HMAC SHA512
        String vnp_SecureHash = hmacSHA512(SECRET_KEY, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        return VNP_PAY_URL + "?" + query;
    }


    public String queryTransaction(String orderId, String transDate, String createDate, String vnp_TxnRef) {
        String vnp_RequestId = System.currentTimeMillis() + "" + (int) (Math.random() * 1000);

        String vnp_Command = "querydr";
        String orderInfor = "Thanh toan don hang:" + orderId;
        JsonObject vnp_Params = new JsonObject();
        vnp_Params.addProperty("vnp_RequestId", vnp_RequestId);
        vnp_Params.addProperty("vnp_Version", VNP_VERSION);
        vnp_Params.addProperty("vnp_Command", vnp_Command);
        vnp_Params.addProperty("vnp_TmnCode", VNP_TMN_CODE);
        vnp_Params.addProperty("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.addProperty("vnp_OrderInfo", orderInfor);
        vnp_Params.addProperty("vnp_TransactionDate", transDate);
        vnp_Params.addProperty("vnp_CreateDate", createDate);
        vnp_Params.addProperty("vnp_IpAddr", IP_ADDRESS);

        // vnp_RequestId + “|” + vnp_Version + “|” + vnp_Command + “|” + vnp_TmnCode + “|” + vnp_TxnRef + “|” + vnp_TransactionDate + “|” + vnp_CreateDate + “|” + vnp_IpAddr + “|” + vnp_OrderInfo;

        String hashData = String.join("|", vnp_RequestId, VNP_VERSION, vnp_Command, VNP_TMN_CODE, vnp_TxnRef, transDate, createDate, IP_ADDRESS, orderInfor);
        String vnp_SecureHash = hmacSHA512(SECRET_KEY, hashData);
        vnp_Params.addProperty("vnp_SecureHash", vnp_SecureHash);

        return vnp_Params.toString();
    }

    public String sendQueryToVnpay(String jsonBody) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> requestEntity = new HttpEntity<>(jsonBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(VNP_API_URL, HttpMethod.POST, requestEntity, String.class);

        return response.getBody();
    }

    public String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }


    public String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }

    public String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }

//    public boolean VNPayReturnData(Map<String, String> params) {
//        if (responseCode.equals("00") && transactionStatus.equals("00")) {
//            chiTietThanhToan =  ChiTietThanhToan.builder()
//                    .id(tmnCode)
//                    .soTien(BigDecimal.valueOf(amount))
//                    .nganHang(bankCode)
//                    .maDoiTac(txnRef)
//                    .maGiaoDich(transactionNo)
//                    .thoiGianTao(payDate)
//                    .build();
//            return true;
//        }
//        System.out.println("tong tien: "+amount);
//        System.out.println("id: "+tmnCode);
//        return false;
//    }

    public boolean VNPayReturnData(Map<String, String> params) {
        String responseCode = params.get("vnp_ResponseCode");
        String transactionStatus = params.get("vnp_TransactionStatus");

        // Kiểm tra nếu giao dịch thành công
        if (!"00".equals(responseCode) || !"00".equals(transactionStatus)) {
            log.warn("Giao dịch thất bại! Mã lỗi: {}", responseCode);
            return false;
        }
        try {
            BigDecimal amount = new BigDecimal(params.get("vnp_Amount")).divide(BigDecimal.valueOf(100));
            chiTietThanhToan = ChiTietThanhToan.builder()
                    .id(params.get("vnp_TmnCode"))
                    .soTien(amount) // Chia 100 nếu VNPay trả về x100
                    .nganHang(params.get("vnp_BankCode"))
                    .maDoiTac(params.get("vnp_TxnRef"))
                    .maGiaoDich(params.get("vnp_TransactionNo"))
                    .thoiGianTao(params.get("vnp_PayDate"))
                    .build();

            log.info("Giao dịch thành công! Mã giao dịch: {}", params.get("vnp_TransactionNo"));
            return true;
        } catch (Exception e) {
            log.error("Lỗi khi xử lý giao dịch VNPay: ", e);
            return false;
        }
    }

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

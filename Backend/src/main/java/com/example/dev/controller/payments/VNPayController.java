package com.example.dev.controller.payments;


import com.example.dev.config.vnpay.VNPayConfig;
import com.example.dev.service.payments.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.example.dev.security.JWTFilter.IP_ADDRESS;

@RestController
@RequestMapping("/api/payment")
public class VNPayController {
    @Autowired
    private VNPayService vnpayService;

    @GetMapping("/create")
    public ResponseEntity<?> createPayment(@RequestParam long amount, @RequestParam(required = false) String bankCode, @RequestParam(required = false) String language) {

        String vnp_TxnRef = vnpayService.getRandomNumber(8);
        String vnp_IpAddr = IP_ADDRESS;
        String vnp_PaymentUrl = vnpayService.createPaymentUrl(amount, bankCode, language, vnp_TxnRef, vnp_IpAddr);
        return ResponseEntity.ok(vnp_PaymentUrl);
    }

    @PostMapping("/query")
    public ResponseEntity<?> queryTransaction(@RequestParam String orderId, @RequestParam String transDate,@RequestParam String createDate,@RequestParam String vnp_TxnRef) {
        String requestJson = vnpayService.queryTransaction(orderId, transDate,createDate,vnp_TxnRef);
        return ResponseEntity.ok(vnpayService.sendQueryToVnpay(requestJson));
    }

    @GetMapping("/VNPay-return")
    public ResponseEntity<Boolean> VNPayReturn(@RequestParam Map<String, String> params ) {
        return ResponseEntity.ok(vnpayService.VNPayReturnData(params));
    }




}

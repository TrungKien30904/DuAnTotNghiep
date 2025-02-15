package com.example.dev.service;

import com.example.dev.mapper.SendMailMapper;
import org.springframework.stereotype.Service;


public interface ISendMailService {
    int sendMail(SendMailMapper sendMailMapper);
    int sendMailWithAttachment(SendMailMapper sendMailMapper);
}

package com.example.dev.service.serviceImpl;

import com.example.dev.entity.MailLogsEntity;
import com.example.dev.mapper.SendMailMapper;
import com.example.dev.repository.ISendMailRepository;
import com.example.dev.service.ISendMailService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.sql.Date;

@Service
public class SendMailServiceImpl implements ISendMailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromMail;

    @Autowired
    private ISendMailRepository sendMailRepository;

    @Override
    public int sendMail(SendMailMapper sendMailMapper) {
        MailLogsEntity entity = new MailLogsEntity();
        entity.setContent(sendMailMapper.getContent());
        entity.setSubject(sendMailMapper.getSubject());
        entity.setFromMail(fromMail);
        entity.setToMail(sendMailMapper.getToMail());
        entity.setCreatedBy(null);
        entity.setCreatedDate(new Date(System.currentTimeMillis()));
        int status = -1;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromMail);
            message.setSubject(sendMailMapper.getSubject());
            message.setTo(sendMailMapper.getToMail());
            message.setText(sendMailMapper.getContent());
            mailSender.send(message);
            entity.setStatus(1);
            entity.setMessage("Send mail success");
            status = 1;
        } catch (Exception e) {
            e.printStackTrace();
            entity.setMessage(e.getMessage());
            entity.setStatus(0);
        }
        sendMailRepository.save(entity);
        return status;
    }

    @Override
    public int sendMailWithAttachment(SendMailMapper sendMailMapper) {
        try {
            MimeMessage mimeMailMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper;
            mimeMessageHelper = new MimeMessageHelper(mimeMailMessage, true);
            mimeMessageHelper.setFrom(fromMail);
            mimeMessageHelper.setTo(sendMailMapper.getToMail());
            mimeMessageHelper.setText(sendMailMapper.getContent());
            mimeMessageHelper.setSubject(sendMailMapper.getSubject());
            FileSystemResource file = new FileSystemResource(new File("null", String.valueOf(0)));
            mimeMessageHelper.addAttachment(file.getFilename(), file);
            mailSender.send(mimeMailMessage);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }
}

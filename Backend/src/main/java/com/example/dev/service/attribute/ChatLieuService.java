package com.example.dev.service.attribute;

import com.example.dev.entity.attribute.ChatLieu;
import com.example.dev.repository.attribute.ChatLieuRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatLieuService {
    @Autowired
    ChatLieuRepo chatLieuRepo;

    public List<ChatLieu> getChatLieu(){
        return chatLieuRepo.findAll();
    }

    public List<ChatLieu> getChatLieuBan(){
        return chatLieuRepo.findAllByTrangThaiIsTrue();
    }

    public ChatLieu themChatLieu(ChatLieu cl){
        chatLieuRepo.save(cl);
        return cl;
    }

    public void suaChatLieu(ChatLieu cl){
        chatLieuRepo.save(cl);
    }
}

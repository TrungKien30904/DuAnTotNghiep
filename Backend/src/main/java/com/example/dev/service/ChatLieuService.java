package com.example.dev.service;

import com.example.dev.entity.attribute.ChatLieu;
import com.example.dev.repository.ChatLieuRepo;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<ChatLieu> suaChatLieu(ChatLieu cl,Integer id){
        cl.setIdChatLieu(id);
        chatLieuRepo.save(cl);
        return getChatLieu();
    }
}

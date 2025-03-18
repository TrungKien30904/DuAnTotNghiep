package com.example.dev.service.attribute;

import com.example.dev.entity.attribute.ChatLieu;
import com.example.dev.repository.atriibute.ChatLieuRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatLieuService {
    @Autowired
    private ChatLieuRepo chatLieuRepo;

    public List<ChatLieu> getChatLieu() {
        return chatLieuRepo.findAll(Sort.by(Sort.Direction.DESC, "idChatLieu"));
    }

    public List<ChatLieu> getChatLieus(String ten, Boolean trangThai) {
        if (ten != null && !ten.isEmpty() && trangThai != null) {
            return chatLieuRepo.findByTenAndTrangThai(ten, trangThai);
        } else if (ten != null && !ten.isEmpty()) {
            return chatLieuRepo.findByTen(ten);
        } else if (trangThai != null) {
            return chatLieuRepo.findByTrangThai(trangThai);
        }
        return getChatLieu();
    }

    public ChatLieu themChatLieu(ChatLieu chatLieu) {
        return chatLieuRepo.save(chatLieu);
    }

    public List<ChatLieu> suaChatLieu(ChatLieu chatLieu, Integer id) {
        chatLieu.setIdChatLieu(id);
        chatLieuRepo.save(chatLieu);
        return getChatLieu();
    }

    public boolean existsByName(String ten) {
        return chatLieuRepo.existsByTen(ten);
    }

    public ChatLieu findById(Integer id) {
        return chatLieuRepo.findById(id).orElse(null);
    }
}

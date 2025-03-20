package com.example.dev.controller.attribute;

import com.example.dev.entity.attribute.ChatLieu;
import com.example.dev.service.attribute.ChatLieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/chat-lieu")

public class ChatLieuController {
    @Autowired
    ChatLieuService chatLieuService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> hienThi(){
        return ResponseEntity.ok(chatLieuService.getChatLieu());
    }


    @GetMapping("/hien-thi/true")
    public ResponseEntity<?> hienThiDangBan(){
        return ResponseEntity.ok(chatLieuService.getChatLieuBan());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/them")
    public ResponseEntity<?> themChatLieu(@RequestBody ChatLieu cl){
        return ResponseEntity.ok(chatLieuService.themChatLieu(cl));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaChatLieu(@RequestBody ChatLieu cl, @PathVariable Integer id){
        return ResponseEntity.ok(chatLieuService.suaChatLieu(cl,id));
    }
}

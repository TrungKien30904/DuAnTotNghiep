package com.example.dev.controller.attributes;

import com.example.dev.entity.attribute.ChatLieu;
import com.example.dev.service.attribute.ChatLieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/chat-lieu")
public class ChatLieuController {
    @Autowired
    private ChatLieuService chatLieuService;

    @GetMapping("/hien-thi")
    public ResponseEntity<?> getChatLieus(
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) Boolean trangThai) {
        return ResponseEntity.ok(chatLieuService.getChatLieus(ten, trangThai));
    }

    @PostMapping("/them")
    public ResponseEntity<?> themChatLieu(@RequestBody ChatLieu chatLieu) {
        Map<String, String> errors = new HashMap<>();
        if (chatLieuService.existsByName(chatLieu.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }
        return ResponseEntity.ok(chatLieuService.themChatLieu(chatLieu));
    }

    @PostMapping("/sua/{id}")
    public ResponseEntity<?> suaChatLieu(@RequestBody ChatLieu chatLieu, @PathVariable Integer id) {
        Map<String, String> errors = new HashMap<>();

        // Lấy Chất Liệu hiện tại từ cơ sở dữ liệu
        ChatLieu existingChatLieu = chatLieuService.findById(id);

        // Kiểm tra xem tên mới có trùng với tên hiện tại không
        if (!existingChatLieu.getTen().equals(chatLieu.getTen()) && chatLieuService.existsByName(chatLieu.getTen())) {
            errors.put("ten", "Tên đã tồn tại");
            return ResponseEntity.badRequest().body(errors); // Trả về lỗi với mã 400
        }

        // Cập nhật Chất Liệu
        return ResponseEntity.ok(chatLieuService.suaChatLieu(chatLieu, id));
    }
}

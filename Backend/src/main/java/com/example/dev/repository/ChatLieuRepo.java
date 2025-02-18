package com.example.dev.repository;

import com.example.dev.entity.attribute.ChatLieu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatLieuRepo extends JpaRepository<ChatLieu,Integer> {
    List<ChatLieu> findAllByTrangThaiIsTrue();
}

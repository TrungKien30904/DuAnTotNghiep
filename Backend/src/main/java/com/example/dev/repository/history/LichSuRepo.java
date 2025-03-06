package com.example.dev.repository.history;

import com.example.dev.entity.history.History;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LichSuRepo extends JpaRepository<History, Integer> {
}

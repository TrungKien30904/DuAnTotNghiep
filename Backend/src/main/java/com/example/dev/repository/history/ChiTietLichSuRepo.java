package com.example.dev.repository.history;

import com.example.dev.entity.history.HistoryDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChiTietLichSuRepo extends JpaRepository<HistoryDetails,Integer> {
}

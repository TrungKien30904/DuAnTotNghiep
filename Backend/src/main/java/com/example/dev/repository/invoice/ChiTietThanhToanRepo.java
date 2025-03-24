package com.example.dev.repository.invoice;

import com.example.dev.entity.invoice.ChiTietThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChiTietThanhToanRepo extends JpaRepository<ChiTietThanhToan,String> {
}

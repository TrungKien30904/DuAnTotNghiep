package com.example.dev.entity.history;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lich_su")
@Builder
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idLichSu;
    private String bang;
    private String hanhDong;
    private Integer id;
    private String nguoiSua;
    private LocalDateTime ngaySua;
}

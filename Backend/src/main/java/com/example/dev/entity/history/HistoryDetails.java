package com.example.dev.entity.history;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "chi_tiet_lich_su")
public class HistoryDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_lich_su")
    private History history;
    private String tenCot;
    private String giaTriCu;
    private String giaTriMoi;
}

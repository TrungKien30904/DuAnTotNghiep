package com.example.dev.service.history;

import com.example.dev.DTO.Diff;
import com.example.dev.entity.history.History;
import com.example.dev.entity.history.HistoryDetails;
import com.example.dev.entity.invoice.LichSuHoaDon;
import com.example.dev.repository.history.ChiTietLichSuRepo;
import com.example.dev.repository.history.LichSuRepo;
import com.example.dev.util.DiffBuilderUtil;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryImpl implements HistoryServce{
    private final LichSuRepo lichSuRepo;
    private final ChiTietLichSuRepo chiTietLichSuRepo;

    @Transactional
    @Override
    public <T> void saveHistory(T oldEntity, T newEntity, String action, Integer objectId, String username) {
        History history = History.builder()
                .id(objectId)
                .bang(newEntity != null ? newEntity.getClass().getSimpleName() : oldEntity.getClass().getSimpleName())
                .hanhDong(action)
                .ngaySua(LocalDateTime.now())
                .nguoiSua(username)
                .build();

        History savedHistory = lichSuRepo.save(history);

        if ("UPDATE".equals(action) && oldEntity != null && newEntity != null) {
            List<Diff> differences = DiffBuilderUtil.compareEntities(oldEntity, newEntity);
            for (Diff diff : differences) {
                HistoryDetails logDetail = HistoryDetails.builder()
                        .id(savedHistory.getId())  // Lấy ID từ history đã lưu
                        .tenCot(diff.getFieldName())
                        .giaTriCu(diff.getOldValue() != null ? diff.getOldValue().toString() : null)
                        .giaTriMoi(diff.getNewValue() != null ? diff.getNewValue().toString() : null)
                        .build();
                chiTietLichSuRepo.save(logDetail);
            }
        }
    }

}

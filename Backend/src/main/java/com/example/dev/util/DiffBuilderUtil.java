package com.example.dev.util;

import com.example.dev.DTO.Diff;
import com.example.dev.entity.TrackChange;
import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Field;
import java.util.*;

@Slf4j
public class DiffBuilderUtil {
    public static Map<String, Object> getTrackedFields(Object entity) {
        Map<String, Object> trackedFields = new HashMap<>();
        if (entity == null) {
            return trackedFields;
        }

        Field[] fields = entity.getClass().getDeclaredFields();

        for (Field field : fields) {
            if (field.isAnnotationPresent(TrackChange.class)) {
                field.setAccessible(true);
                try {
                    TrackChange annotation = field.getAnnotation(TrackChange.class);
                    trackedFields.put(annotation.columnName(), field.get(entity));
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }

        return trackedFields;
    }

    public static <T> List<Diff> compareEntities(T oldEntity, T newEntity) {
        List<Diff> diffs = new ArrayList<>();
        Map<String, Object> oldFields = getTrackedFields(oldEntity);
        Map<String, Object> newFields = getTrackedFields(newEntity);

        oldFields.forEach((columnName, oldValue) -> {
            Object newValue = newFields.get(columnName);
            if (!Objects.equals(oldValue, newValue)) {
                diffs.add(new Diff(columnName, oldValue, newValue));
            }
        });

        return diffs;
    }
}

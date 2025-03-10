package com.example.dev.service.history;


public interface HistoryServce {
    public <T> void saveHistory(T oldEntity, T newEntity, String action, Integer objectId, String username);
}

package com.example.dev.repository;

import com.example.dev.entity.MailLogsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISendMailRepository extends JpaRepository<MailLogsEntity, Integer> {
}

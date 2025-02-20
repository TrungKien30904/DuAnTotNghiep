package com.example.dev.entity;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "mails_logs")
public class MailLogsEntity {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String toMail;
    private String fromMail;
    @Column(name = "content")
    private String content;
    @Column(name = "subject")
    private String subject;
    private  Integer createdBy;
    private Date createdDate;
    @Column(name = "status")
    private Integer status;
    @Column(name = "message")
    private String message;

    public MailLogsEntity(int id, String toMail, String fromMail, String content, String subject, Integer createdBy, Date createdDate, Integer status, String message) {
        this.id = id;
        this.toMail = toMail;
        this.fromMail = fromMail;
        this.content = content;
        this.subject = subject;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.status = status;
        this.message = message;
    }

    public MailLogsEntity() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getToMail() {
        return toMail;
    }

    public void setToMail(String toMail) {
        this.toMail = toMail;
    }

    public String getFromMail() {
        return fromMail;
    }

    public void setFromMail(String fromMail) {
        this.fromMail = fromMail;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

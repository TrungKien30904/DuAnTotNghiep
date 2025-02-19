package com.example.dev.mapper;

public class SendMailMapper {

    private String toMail;
    private String fromMail;
    private String content;
    private String subject;

    public SendMailMapper() {
    }

    public SendMailMapper(String toMail, String fromMail, String content, String subject) {
        this.toMail = toMail;
        this.fromMail = fromMail;
        this.content = content;
        this.subject = subject;
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
}

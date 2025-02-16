package com.example.dev.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class CustomExceptions {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class ExistCodeException extends RuntimeException {
        public ExistCodeException(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class CustomBadRequest extends RuntimeException {
        public CustomBadRequest(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    public static class CustomBadSecurity extends RuntimeException {
        public CustomBadSecurity(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class CustomThrowMessage extends RuntimeException {
        public CustomThrowMessage(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class GHNException extends RuntimeException {
        public GHNException(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class CustomNotFoundException extends RuntimeException {
        public CustomNotFoundException(String message) {
            super(message);
        }
    }

}

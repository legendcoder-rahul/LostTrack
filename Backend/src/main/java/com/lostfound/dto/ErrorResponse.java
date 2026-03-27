package com.lostfound.dto;

public class ErrorResponse {
    private String error;
    private String message;

    public ErrorResponse(String message) {
        this.error = "Bad Request";
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

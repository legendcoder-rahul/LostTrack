package com.lostfound.dto;

/**
 * Response DTO for claim-related operations
 */
public class ClaimResponseDTO {
    private Long itemId;
    private String message;
    private String status;
    private Integer remainingAttempts;

    public ClaimResponseDTO() {
    }

    public ClaimResponseDTO(Long itemId, String message, String status) {
        this.itemId = itemId;
        this.message = message;
        this.status = status;
    }

    public ClaimResponseDTO(Long itemId, String message, String status, Integer remainingAttempts) {
        this.itemId = itemId;
        this.message = message;
        this.status = status;
        this.remainingAttempts = remainingAttempts;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getRemainingAttempts() {
        return remainingAttempts;
    }

    public void setRemainingAttempts(Integer remainingAttempts) {
        this.remainingAttempts = remainingAttempts;
    }
}

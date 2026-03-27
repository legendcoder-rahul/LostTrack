package com.lostfound.dto;

/**
 * Request DTO for verifying OTP
 */
public class VerifyOTPRequest {
    private Long itemId;
    private String otp;

    public VerifyOTPRequest() {
    }

    public VerifyOTPRequest(Long itemId, String otp) {
        this.itemId = itemId;
        this.otp = otp;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}

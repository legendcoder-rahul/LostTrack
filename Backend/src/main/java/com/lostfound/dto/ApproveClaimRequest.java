package com.lostfound.dto;

/**
 * Request DTO for approving or rejecting a claim
 */
public class ApproveClaimRequest {
    private Long itemId;
    private boolean approved;

    public ApproveClaimRequest() {
    }

    public ApproveClaimRequest(Long itemId, boolean approved) {
        this.itemId = itemId;
        this.approved = approved;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }
}

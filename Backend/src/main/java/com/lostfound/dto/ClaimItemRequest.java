package com.lostfound.dto;

/**
 * Request DTO for claiming an item
 */
public class ClaimItemRequest {
    private Long itemId;

    public ClaimItemRequest() {
    }

    public ClaimItemRequest(Long itemId) {
        this.itemId = itemId;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }
}

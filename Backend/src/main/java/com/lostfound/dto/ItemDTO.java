package com.lostfound.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lostfound.entity.ItemStatus;
import java.time.LocalDateTime;

public class ItemDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private ItemStatus status;
    private String imageData;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime reportedDate;
    
    private LocalDateTime createdAt;
    private String contactInfo;

    // Claim verification fields
    private Long ownerId; // ID of the person who found the item
    private String ownerName;
    private Long claimantId; // ID of the person claiming the item
    private String claimantName;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime otpExpiry;
    
    private Integer otpAttemptCount;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime claimApprovedDate;

    public ItemDTO() {
    }

    public ItemDTO(Long id, String title, String description, String location, ItemStatus status, String imageData, LocalDateTime reportedDate, LocalDateTime createdAt, String contactInfo) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.status = status;
        this.imageData = imageData;
        this.reportedDate = reportedDate;
        this.createdAt = createdAt;
        this.contactInfo = contactInfo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }

    public String getImageData() {
        return imageData;
    }

    public void setImageData(String imageData) {
        this.imageData = imageData;
    }

    public LocalDateTime getReportedDate() {
        return reportedDate;
    }

    public void setReportedDate(LocalDateTime reportedDate) {
        this.reportedDate = reportedDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public Long getClaimantId() {
        return claimantId;
    }

    public void setClaimantId(Long claimantId) {
        this.claimantId = claimantId;
    }

    public String getClaimantName() {
        return claimantName;
    }

    public void setClaimantName(String claimantName) {
        this.claimantName = claimantName;
    }

    public LocalDateTime getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(LocalDateTime otpExpiry) {
        this.otpExpiry = otpExpiry;
    }

    public Integer getOtpAttemptCount() {
        return otpAttemptCount;
    }

    public void setOtpAttemptCount(Integer otpAttemptCount) {
        this.otpAttemptCount = otpAttemptCount;
    }

    public LocalDateTime getClaimApprovedDate() {
        return claimApprovedDate;
    }

    public void setClaimApprovedDate(LocalDateTime claimApprovedDate) {
        this.claimApprovedDate = claimApprovedDate;
    }
}

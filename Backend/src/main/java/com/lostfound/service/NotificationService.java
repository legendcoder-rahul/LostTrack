package com.lostfound.service;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Service for sending notifications (Email/SMS)
 * Currently logs notifications; can be extended to send actual emails/SMS
 */
@Service
public class NotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    /**
     * Send OTP via email or SMS
     * In production, this would be integrated with email/SMS gateway
     */
    public void sendOTPNotification(String userEmail, String userPhone, String otp) {
        // Log OTP for development purposes
        // In production, use JavaMailSender or Twilio/AWS SNS for actual delivery
        logger.info("=== OTP NOTIFICATION ===");
        logger.info("Email: {}", userEmail);
        logger.info("Phone: {}", userPhone);
        logger.info("OTP: {}", otp);
        logger.info("OTP expires in 5 minutes");
        logger.info("========================");
    }

    /**
     * Notify item owner about a new claim request
     */
    public void sendClaimRequestNotification(String ownerEmail, String claimantName, String itemTitle) {
        logger.info("=== CLAIM REQUEST NOTIFICATION ===");
        logger.info("Owner Email: {}", ownerEmail);
        logger.info("Claimant: {}", claimantName);
        logger.info("Item: {}", itemTitle);
        logger.info("Action: Please review and approve or reject the claim");
        logger.info("===================================");
    }

    /**
     * Notify claimant about claim approval
     */
    public void sendClaimApprovedNotification(String claimantEmail, String itemTitle) {
        logger.info("=== CLAIM APPROVED NOTIFICATION ===");
        logger.info("Claimant Email: {}", claimantEmail);
        logger.info("Item: {}", itemTitle);
        logger.info("Action: OTP will be shared by the owner during meetup");
        logger.info("====================================");
    }

    /**
     * Notify claimant about claim rejection
     */
    public void sendClaimRejectedNotification(String claimantEmail, String itemTitle) {
        logger.info("=== CLAIM REJECTED NOTIFICATION ===");
        logger.info("Claimant Email: {}", claimantEmail);
        logger.info("Item: {}", itemTitle);
        logger.info("Action: Claim has been rejected. Item is available for other claims.");
        logger.info("====================================");
    }

    /**
     * Notify claimant about successful item return
     */
    public void sendItemReturnedNotification(String claimantEmail, String itemTitle) {
        logger.info("=== ITEM RETURNED SUCCESSFULLY ===");
        logger.info("Claimant Email: {}", claimantEmail);
        logger.info("Item: {}", itemTitle);
        logger.info("Status: Your claim has been completed successfully!");
        logger.info("===================================");
    }

    /**
     * Notify owner about successful item handover
     */
    public void sendItemHandoverNotification(String ownerEmail, String itemTitle, String claimantName) {
        logger.info("=== ITEM HANDOVER COMPLETED ===");
        logger.info("Owner Email: {}", ownerEmail);
        logger.info("Item: {}", itemTitle);
        logger.info("Handed over to: {}", claimantName);
        logger.info("================================");
    }
}

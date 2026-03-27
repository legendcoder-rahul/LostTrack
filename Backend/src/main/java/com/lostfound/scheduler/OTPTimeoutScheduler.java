package com.lostfound.scheduler;

import com.lostfound.entity.Item;
import com.lostfound.entity.ItemStatus;
import com.lostfound.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduler for handling OTP timeout and other time-based operations
 */
@Component
public class OTPTimeoutScheduler {
    
    private static final Logger logger = LoggerFactory.getLogger(OTPTimeoutScheduler.class);
    
    @Autowired
    private ItemRepository itemRepository;
    
    /**
     * Check for expired OTPs every 5 minutes
     * If OTP is expired, reset the claim and mark item as FOUND
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void handleExpiredOTPs() {
        try {
            logger.info("Running OTP expiry check...");
            
            // Get all items with OTP_PENDING status
            List<Item> otpPendingItems = itemRepository.findByStatus(ItemStatus.OTP_PENDING);
            
            LocalDateTime now = LocalDateTime.now();
            int expiredCount = 0;
            
            for (Item item : otpPendingItems) {
                if (item.getOtpExpiry() != null && now.isAfter(item.getOtpExpiry())) {
                    // OTP expired, reset the claim
                    logger.info("OTP expired for item ID: {}. Resetting claim status.", item.getId());
                    
                    item.setStatus(ItemStatus.FOUND);
                    item.setClaimantId(null);
                    item.setOtp(null);
                    item.setOtpExpiry(null);
                    item.setOtpAttemptCount(0);
                    item.setClaimApprovedDate(null);
                    
                    itemRepository.save(item);
                    expiredCount++;
                }
            }
            
            if (expiredCount > 0) {
                logger.info("Reset {} expired OTP claims.", expiredCount);
            }
        } catch (Exception e) {
            logger.error("Error in OTP expiry check", e);
        }
    }
    
    /**
     * Check for 24-hour timeout on claim approvals
     * If claim was approved more than 24 hours ago and not verified, reset it
     */
    @Scheduled(fixedRate = 600000) // 10 minutes
    public void handleClaimTimeout() {
        try {
            logger.info("Running claim approval timeout check...");
            
            // Get all items with OTP_PENDING status
            List<Item> otpPendingItems = itemRepository.findByStatus(ItemStatus.OTP_PENDING);
            
            LocalDateTime now = LocalDateTime.now();
            int timeoutCount = 0;
            
            for (Item item : otpPendingItems) {
                if (item.getClaimApprovedDate() != null) {
                    // Check if 24 hours have passed since approval
                    if (now.isAfter(item.getClaimApprovedDate().plusHours(24))) {
                        logger.info("Claim approval timeout for item ID: {}. Resetting claim status.", item.getId());
                        
                        item.setStatus(ItemStatus.FOUND);
                        item.setClaimantId(null);
                        item.setOtp(null);
                        item.setOtpExpiry(null);
                        item.setOtpAttemptCount(0);
                        item.setClaimApprovedDate(null);
                        
                        itemRepository.save(item);
                        timeoutCount++;
                    }
                }
            }
            
            if (timeoutCount > 0) {
                logger.info("Reset {} claim approvals due to 24-hour timeout.", timeoutCount);
            }
        } catch (Exception e) {
            logger.error("Error in claim approval timeout check", e);
        }
    }
}

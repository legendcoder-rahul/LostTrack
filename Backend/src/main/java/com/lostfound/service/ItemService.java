package com.lostfound.service;

import com.lostfound.dto.ItemDTO;
import com.lostfound.entity.Item;
import com.lostfound.entity.ItemStatus;
import com.lostfound.entity.User;
import com.lostfound.repository.ItemRepository;
import com.lostfound.repository.UserRepository;
import com.lostfound.util.OTPUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public ItemDTO createItem(ItemDTO itemDTO, Long userId) {
        // Validate required fields
        if (itemDTO.getTitle() == null || itemDTO.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Title is required");
        }
        if (itemDTO.getLocation() == null || itemDTO.getLocation().trim().isEmpty()) {
            throw new RuntimeException("Location is required");
        }
        if (itemDTO.getContactInfo() == null || itemDTO.getContactInfo().trim().isEmpty()) {
            throw new RuntimeException("Contact information is required");
        }
        if (itemDTO.getStatus() == null) {
            throw new RuntimeException("Status is required");
        }
        
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Item item = new Item();
        item.setTitle(itemDTO.getTitle());
        item.setDescription(itemDTO.getDescription());
        item.setLocation(itemDTO.getLocation());
        item.setStatus(itemDTO.getStatus());
        item.setImageData(itemDTO.getImageData());
        item.setReportedDate(itemDTO.getReportedDate() != null ? itemDTO.getReportedDate() : LocalDateTime.now());
        item.setContactInfo(itemDTO.getContactInfo());
        item.setUser(user.get());

        Item savedItem = itemRepository.save(item);
        return convertToDTO(savedItem);
    }

    public List<ItemDTO> getAllItems() {
        return itemRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ItemDTO> getItemsByStatus(String status) {
        try {
            ItemStatus itemStatus = ItemStatus.valueOf(status.toUpperCase());
            return itemRepository.findByStatusOrderByCreatedAtDesc(itemStatus)
                    .stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    public Optional<ItemDTO> getItemById(Long id) {
        return itemRepository.findById(id).map(this::convertToDTO);
    }

    public ItemDTO updateItem(Long id, ItemDTO itemDTO) {
        Optional<Item> existing = itemRepository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Item not found");
        }

        Item item = existing.get();
        item.setTitle(itemDTO.getTitle());
        item.setDescription(itemDTO.getDescription());
        item.setLocation(itemDTO.getLocation());
        item.setStatus(itemDTO.getStatus());
        if (itemDTO.getImageData() != null) {
            item.setImageData(itemDTO.getImageData());
        }
        item.setContactInfo(itemDTO.getContactInfo());

        Item updated = itemRepository.save(item);
        return convertToDTO(updated);
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    public List<ItemDTO> searchByTitle(String title) {
        return itemRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ItemDTO> searchByLocation(String location) {
        return itemRepository.findByLocationContainingIgnoreCase(location)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ItemDTO convertToDTO(Item item) {
        ItemDTO dto = new ItemDTO(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getLocation(),
                item.getStatus(),
                item.getImageData(),
                item.getReportedDate(),
                item.getCreatedAt(),
                item.getContactInfo()
        );
        
        // Add owner info
        if (item.getUser() != null) {
            dto.setOwnerId(item.getUser().getId());
            dto.setOwnerName(item.getUser().getName());
        }
        
        // Add claim info
        dto.setClaimantId(item.getClaimantId());
        dto.setOtpExpiry(item.getOtpExpiry());
        dto.setOtpAttemptCount(item.getOtpAttemptCount());
        dto.setClaimApprovedDate(item.getClaimApprovedDate());
        
        return dto;
    }

    // ==================== CLAIM VERIFICATION METHODS ====================

    /**
     * User claims an item
     * Changes status from FOUND to CLAIM_REQUESTED
     */
    public ItemDTO claimItem(Long itemId, Long claimantId) {
        System.out.println("DEBUG: claimItem() called - itemId: " + itemId + ", claimantId: " + claimantId);
        Optional<Item> itemOpt = itemRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            throw new RuntimeException("Item not found");
        }

        Item item = itemOpt.get();
        System.out.println("DEBUG: Found item - id: " + item.getId() + ", title: " + item.getTitle() + ", current status: " + item.getStatus() + ", owner userId: " + item.getUser().getId());
        
        // Verify item owner is not claiming their own item
        if (item.getUser().getId().equals(claimantId)) {
            System.out.println("DEBUG: Cannot claim - user is the owner of the item");
            throw new RuntimeException("Cannot claim your own item");
        }

        // Verify item is in FOUND status
        if (!item.getStatus().equals(ItemStatus.FOUND)) {
            System.out.println("DEBUG: Cannot claim - item status is not FOUND, current status: " + item.getStatus());
            throw new RuntimeException("Item is not available for claim. Current status: " + item.getStatus());
        }

        // Update item status and set claimant
        item.setStatus(ItemStatus.CLAIM_REQUESTED);
        item.setClaimantId(claimantId);
        item.setOtpAttemptCount(0);
        
        Item updated = itemRepository.save(item);
        System.out.println("DEBUG: Item saved successfully - new status: " + updated.getStatus() + ", claimantId: " + updated.getClaimantId());
        
        // Send notification to owner
        notificationService.sendClaimRequestNotification(
                item.getUser().getEmail(),
                userRepository.findById(claimantId).get().getName(),
                item.getTitle()
        );
        
        return convertToDTO(updated);
    }

    /**
     * Get claim requests for an item owner
     * Returns all items with status CLAIM_REQUESTED
     */
    public List<ItemDTO> getClaimRequestsForOwner(Long ownerId) {
        System.out.println("DEBUG: ItemService.getClaimRequestsForOwner() called with ownerId: " + ownerId);
        List<Item> items = itemRepository.findByStatusAndUserIdOrderByCreatedAtDesc(ItemStatus.CLAIM_REQUESTED, ownerId);
        System.out.println("DEBUG: Found " + items.size() + " items with CLAIM_REQUESTED status for owner " + ownerId);
        items.forEach(item -> System.out.println("  - Item: id=" + item.getId() + ", title=" + item.getTitle() + ", userId=" + item.getUser().getId() + ", claimantId=" + item.getClaimantId()));
        return items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Owner approves claim request
     * Generates OTP and sends it to owner
     */
    public ItemDTO approveClaim(Long itemId, Long ownerId) {
        Optional<Item> itemOpt = itemRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            throw new RuntimeException("Item not found");
        }

        Item item = itemOpt.get();
        
        // Verify item owner
        if (!item.getUser().getId().equals(ownerId)) {
            throw new RuntimeException("Only item owner can approve claims");
        }

        // Verify item is in CLAIM_REQUESTED status
        if (!item.getStatus().equals(ItemStatus.CLAIM_REQUESTED)) {
            throw new RuntimeException("Claim is not pending approval");
        }

        // Generate OTP
        String otp = OTPUtil.generateOTP();
        String hashedOTP = OTPUtil.hashOTP(otp);
        
        // Set OTP expiry (5 minutes from now)
        LocalDateTime otpExpiry = LocalDateTime.now().plusMinutes(5);
        
        // Update item
        item.setStatus(ItemStatus.OTP_PENDING);
        item.setOtp(hashedOTP);
        item.setOtpExpiry(otpExpiry);
        item.setOtpAttemptCount(0);
        item.setClaimApprovedDate(LocalDateTime.now());
        
        Item updated = itemRepository.save(item);
        
        // Send OTP to owner
        notificationService.sendOTPNotification(
                item.getUser().getEmail(),
                item.getUser().getPhone(),
                otp
        );
        
        // Notify claimant
        Optional<User> claimantOpt = userRepository.findById(item.getClaimantId());
        if (claimantOpt.isPresent()) {
            notificationService.sendClaimApprovedNotification(
                    claimantOpt.get().getEmail(),
                    item.getTitle()
            );
        }
        
        return convertToDTO(updated);
    }

    /**
     * Owner rejects claim request
     * Resets status back to FOUND for other users to claim
     */
    public ItemDTO rejectClaim(Long itemId, Long ownerId) {
        Optional<Item> itemOpt = itemRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            throw new RuntimeException("Item not found");
        }

        Item item = itemOpt.get();
        
        // Verify item owner
        if (!item.getUser().getId().equals(ownerId)) {
            throw new RuntimeException("Only item owner can reject claims");
        }

        // Verify item is in CLAIM_REQUESTED or OTP_PENDING status
        if (!item.getStatus().equals(ItemStatus.CLAIM_REQUESTED) && 
            !item.getStatus().equals(ItemStatus.OTP_PENDING)) {
            throw new RuntimeException("Cannot reject claim at this status");
        }

        // Get claimant info before resetting
        Long claimantId = item.getClaimantId();
        
        // Reset item
        item.setStatus(ItemStatus.FOUND);
        item.setClaimantId(null);
        item.setOtp(null);
        item.setOtpExpiry(null);
        item.setOtpAttemptCount(0);
        item.setClaimApprovedDate(null);
        
        Item updated = itemRepository.save(item);
        
        // Notify claimant
        if (claimantId != null) {
            Optional<User> claimantOpt = userRepository.findById(claimantId);
            if (claimantOpt.isPresent()) {
                notificationService.sendClaimRejectedNotification(
                        claimantOpt.get().getEmail(),
                        item.getTitle()
                );
            }
        }
        
        return convertToDTO(updated);
    }

    /**
     * Claimant verifies OTP and completes the claim
     */
    public ItemDTO verifyOTP(Long itemId, Long claimantId, String providedOTP) {
        Optional<Item> itemOpt = itemRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            throw new RuntimeException("Item not found");
        }

        Item item = itemOpt.get();
        
        // Verify claimant
        if (!item.getClaimantId().equals(claimantId)) {
            throw new RuntimeException("Only the claimant can verify OTP");
        }

        // Verify status
        if (!item.getStatus().equals(ItemStatus.OTP_PENDING)) {
            throw new RuntimeException("OTP verification is not pending for this item");
        }

        // Check OTP expiry
        if (LocalDateTime.now().isAfter(item.getOtpExpiry())) {
            throw new RuntimeException("OTP has expired");
        }

        // Check attempt count
        int attempts = item.getOtpAttemptCount();
        if (attempts >= 3) {
            // Reset to FOUND after 3 failed attempts
            item.setStatus(ItemStatus.FOUND);
            item.setClaimantId(null);
            item.setOtp(null);
            item.setOtpExpiry(null);
            item.setOtpAttemptCount(0);
            item.setClaimApprovedDate(null);
            itemRepository.save(item);
            throw new RuntimeException("Maximum OTP attempts exceeded. Claim has been cancelled.");
        }

        // Verify OTP
        if (!OTPUtil.verifyOTP(providedOTP, item.getOtp())) {
            item.setOtpAttemptCount(attempts + 1);
            itemRepository.save(item);
            int remainingAttempts = 3 - (attempts + 1);
            throw new RuntimeException("Invalid OTP. Remaining attempts: " + remainingAttempts);
        }

        // OTP verified successfully
        item.setStatus(ItemStatus.COMPLETED);
        item.setOtp(null); // Clear OTP after successful verification
        item.setOtpExpiry(null);
        item.setOtpAttemptCount(0);
        
        Item updated = itemRepository.save(item);
        
        // Send notifications
        Optional<User> claimantOpt = userRepository.findById(claimantId);
        if (claimantOpt.isPresent()) {
            notificationService.sendItemReturnedNotification(
                    claimantOpt.get().getEmail(),
                    item.getTitle()
            );
        }
        
        notificationService.sendItemHandoverNotification(
                item.getUser().getEmail(),
                item.getTitle(),
                claimantOpt.map(User::getName).orElse("Unknown")
        );
        
        return convertToDTO(updated);
    }

    /**
     * Get claim history for a claimant
     */
    public List<ItemDTO> getMyClaimHistory(Long claimantId) {
        List<ItemDTO> claimedItems = itemRepository.findByClaimantIdAndStatusOrderByCreatedAtDesc(claimantId, ItemStatus.COMPLETED)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        // Also include pending claims
        List<ItemDTO> pendingClaims = itemRepository.findByClaimantIdAndStatusOrderByCreatedAtDesc(claimantId, ItemStatus.CLAIM_REQUESTED)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        List<ItemDTO> otpPendingClaims = itemRepository.findByClaimantIdAndStatusOrderByCreatedAtDesc(claimantId, ItemStatus.OTP_PENDING)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        claimedItems.addAll(pendingClaims);
        claimedItems.addAll(otpPendingClaims);
        
        return claimedItems;
    }
}

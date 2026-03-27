package com.lostfound.controller;

import com.lostfound.dto.ItemDTO;
import com.lostfound.dto.ErrorResponse;
import com.lostfound.dto.ApproveClaimRequest;
import com.lostfound.dto.VerifyOTPRequest;
import com.lostfound.dto.ClaimResponseDTO;
import com.lostfound.service.ItemService;
import com.lostfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/items")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ItemController {
    @Autowired
    private ItemService itemService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ItemDTO>> getAllItems() {
        List<ItemDTO> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ItemDTO>> getItemsByStatus(@PathVariable String status) {
        try {
            List<ItemDTO> items = itemService.getItemsByStatus(status);
            return ResponseEntity.ok(items);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> getItemById(@PathVariable Long id) {
        Optional<ItemDTO> item = itemService.getItemById(id);
        return item.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody ItemDTO itemDTO) {
        try {
            // For now, using userId = 1 (should come from authenticated user)
            ItemDTO created = itemService.createItem(itemDTO, 1L);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemDTO> updateItem(@PathVariable Long id, @RequestBody ItemDTO itemDTO) {
        try {
            ItemDTO updated = itemService.updateItem(id, itemDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItem(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search/title")
    public ResponseEntity<List<ItemDTO>> searchByTitle(@RequestParam String q) {
        List<ItemDTO> items = itemService.searchByTitle(q);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/search/location")
    public ResponseEntity<List<ItemDTO>> searchByLocation(@RequestParam String q) {
        List<ItemDTO> items = itemService.searchByLocation(q);
        return ResponseEntity.ok(items);
    }

    // ==================== CLAIM VERIFICATION ENDPOINTS ====================

    /**
     * User claims an item
     */
    @PostMapping("/{id}/claim")
    public ResponseEntity<?> claimItem(@PathVariable Long id) {
        try {
            String userEmail = getAuthenticatedUserEmail();
            if (userEmail == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("User not authenticated"));
            }

            Long claimantId = getUserIdByEmail(userEmail);
            if (claimantId == null) {
                return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
            }

            ItemDTO result = itemService.claimItem(id, claimantId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ClaimResponseDTO(id, e.getMessage(), "ERROR"));
        }
    }

    /**
     * Get claim requests for the authenticated user (item owner)
     */
    @GetMapping("/owner/claims")
    public ResponseEntity<?> getMyClaimRequests() {
        try {
            String userEmail = getAuthenticatedUserEmail();
            if (userEmail == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("User not authenticated"));
            }

            Long ownerId = getUserIdByEmail(userEmail);
            if (ownerId == null) {
                return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
            }

            List<ItemDTO> claims = itemService.getClaimRequestsForOwner(ownerId);
            return ResponseEntity.ok(claims);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Item owner approves a claim request
     */
    @PostMapping("/{id}/approve-claim")
    public ResponseEntity<?> approveClaim(@PathVariable Long id) {
        try {
            String userEmail = getAuthenticatedUserEmail();
            if (userEmail == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("User not authenticated"));
            }

            Long ownerId = getUserIdByEmail(userEmail);
            if (ownerId == null) {
                return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
            }

            ItemDTO result = itemService.approveClaim(id, ownerId);
            return ResponseEntity.ok(new ClaimResponseDTO(id, "Claim approved. OTP has been sent.", "OTP_PENDING"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ClaimResponseDTO(id, e.getMessage(), "ERROR"));
        }
    }

    /**
     * Item owner rejects a claim request
     */
    @PostMapping("/{id}/reject-claim")
    public ResponseEntity<?> rejectClaim(@PathVariable Long id) {
        try {
            String userEmail = getAuthenticatedUserEmail();
            if (userEmail == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("User not authenticated"));
            }

            Long ownerId = getUserIdByEmail(userEmail);
            if (ownerId == null) {
                return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
            }

            ItemDTO result = itemService.rejectClaim(id, ownerId);
            return ResponseEntity.ok(new ClaimResponseDTO(id, "Claim rejected. Item is available for other claims.", "FOUND"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ClaimResponseDTO(id, e.getMessage(), "ERROR"));
        }
    }

    /**
     * Claimant verifies OTP
     */
    @PostMapping("/{id}/verify-otp")
    public ResponseEntity<?> verifyOTP(@PathVariable Long id, @RequestBody VerifyOTPRequest request) {
        try {
            String userEmail = getAuthenticatedUserEmail();
            if (userEmail == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("User not authenticated"));
            }

            Long claimantId = getUserIdByEmail(userEmail);
            if (claimantId == null) {
                return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
            }

            ItemDTO result = itemService.verifyOTP(id, claimantId, request.getOtp());
            return ResponseEntity.ok(new ClaimResponseDTO(id, "OTP verified successfully. Item has been marked as returned.", "COMPLETED"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ClaimResponseDTO(id, e.getMessage(), "ERROR"));
        }
    }

    /**
     * Get claim history for the authenticated user
     */
    @GetMapping("/claimant/history")
    public ResponseEntity<?> getMyClaimHistory() {
        try {
            String userEmail = getAuthenticatedUserEmail();
            if (userEmail == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("User not authenticated"));
            }

            Long claimantId = getUserIdByEmail(userEmail);
            if (claimantId == null) {
                return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
            }

            List<ItemDTO> claims = itemService.getMyClaimHistory(claimantId);
            return ResponseEntity.ok(claims);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Get authenticated user email from security context
     */
    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() != null) {
            String email = authentication.getPrincipal().toString();
            System.out.println("DEBUG: Authenticated user email: " + email);
            return email;
        }
        System.out.println("DEBUG: No authentication found in security context");
        return null;
    }

    /**
     * Get user ID by email
     */
    private Long getUserIdByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            System.out.println("DEBUG: Email is null or empty");
            return null;
        }
        var user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            System.out.println("DEBUG: User found with email: " + email + ", ID: " + user.get().getId());
            return user.get().getId();
        } else {
            System.out.println("DEBUG: User NOT found with email: " + email);
            System.out.println("DEBUG: Available users in DB: ");
            userRepository.findAll().forEach(u -> System.out.println("  - " + u.getEmail()));
            return null;
        }
    }
}

# Quick Reference Guide - Claim Verification System

## API Endpoints Summary

### Claim Operations

```
Claim an item
POST /api/items/{itemId}/claim
Auth: Required (JWT)
Response: ItemDTO (status: CLAIM_REQUESTED)

Get pending claims for owner
GET /api/items/owner/claims
Auth: Required (JWT)
Response: List<ItemDTO> (status: CLAIM_REQUESTED)

Approve a claim
POST /api/items/{itemId}/approve-claim
Auth: Required (JWT)
Response: ClaimResponseDTO { itemId, message, status: "OTP_PENDING" }

Reject a claim
POST /api/items/{itemId}/reject-claim
Auth: Required (JWT)
Response: ClaimResponseDTO { itemId, message, status: "FOUND" }

Verify OTP
POST /api/items/{itemId}/verify-otp
Auth: Required (JWT)
Body: { itemId, otp: "123456" }
Response: ClaimResponseDTO { itemId, message, status: "COMPLETED" }

Get my claim history
GET /api/items/claimant/history
Auth: Required (JWT)
Response: List<ItemDTO> (all claims for current user)
```

## Status Transition Map

```
┌─────────┐
│  FOUND  │ ← Item owner reports found item
└────┬────┘
     │ (User clicks "Claim Item")
     ▼
┌──────────────────┐
│ CLAIM_REQUESTED  │ ← Claim request created
└────┬────────┬────┘
     │        │
     │        └─────────────────────────────┐
     │ (Owner clicks "Reject")              │
     │                                      ▼
     │                              ┌─────────────┐
     │                              │    FOUND    │ ← Back to available
     │                              └─────────────┘
     │
     │ (Owner clicks "Approve")
     ▼
┌──────────────┐
│ OTP_PENDING  │ ← OTP generated and sent
└────┬────┬───┘
     │    │
     │    └─────────────────────────────────┐
     │ (OTP expires after 24h)              │
     │                                      ▼
     │                              ┌─────────────┐
     │                              │    FOUND    │
     │                              └─────────────┘
     │
     │ (Claimant enters correct OTP)
     ▼
┌───────────┐
│ COMPLETED │ ← Claim verified, item returned
└───────────┘
```

## Component Reference

### Frontend Components

**ClaimItemModal**
```jsx
import ClaimItemModal from '../components/ClaimItemModal'

<ClaimItemModal
  item={itemObject}
  isOpen={boolean}
  onClose={() => {}}
  onSuccess={() => {}}
/>
```

**OTPVerification**
```jsx
import OTPVerification from '../components/OTPVerification'

<OTPVerification
  item={itemObject}
  isOpen={boolean}
  onClose={() => {}}
  onSuccess={() => {}}
/>
```

**ClaimsBoard**
```jsx
import ClaimsBoard from '../components/ClaimsBoard'

<ClaimsBoard /> // Self-contained component, no props needed
```

### Backend Services

**ItemService Methods**
```java
// Claim an item
ItemDTO claimItem(Long itemId, Long claimantId)

// Get pending claims
List<ItemDTO> getClaimRequestsForOwner(Long ownerId)

// Approve claim (generates OTP)
ItemDTO approveClaim(Long itemId, Long ownerId)

// Reject claim
ItemDTO rejectClaim(Long itemId, Long ownerId)

// Verify OTP
ItemDTO verifyOTP(Long itemId, Long claimantId, String otp)

// Get claim history
List<ItemDTO> getMyClaimHistory(Long claimantId)
```

## Security Checklist

- [x] OTP hashed with SHA-256 before storage
- [x] OTP expires after 5 minutes
- [x] Max 3 OTP verification attempts
- [x] Only claimant can verify OTP
- [x] Only owner can approve/reject
- [x] Users cannot claim own items
- [x] JWT required for sensitive endpoints
- [x] Auto-timeout after 24 hours
- [x] Scheduled cleanup of expired OTPs

## Database Schema Changes

```sql
-- Add new columns to items table
ALTER TABLE items ADD COLUMN claimant_id BIGINT;
ALTER TABLE items ADD COLUMN otp VARCHAR(128);
ALTER TABLE items ADD COLUMN otp_expiry DATETIME;
ALTER TABLE items ADD COLUMN otp_attempt_count INT DEFAULT 0;
ALTER TABLE items ADD COLUMN claim_approved_date DATETIME;

-- Create indexes for performance
CREATE INDEX idx_claimant_id ON items(claimant_id);
CREATE INDEX idx_otp_pending ON items(status) WHERE status = 'OTP_PENDING';
```

## Error Codes & Messages

| Error | HTTP Code | Message |
|-------|-----------|---------|
| Item not found | 404 | Item not found |
| User not authenticated | 401 | User not authenticated |
| Item not available | 400 | Item is not available for claim |
| Cannot claim own item | 400 | Cannot claim your own item |
| Claim not pending | 400 | Claim is not pending approval |
| OTP expired | 400 | OTP has expired |
| Invalid OTP | 400 | Invalid OTP (shows remaining attempts) |
| Max attempts exceeded | 400 | Maximum OTP attempts exceeded. Claim cancelled |
| Only owner can approve | 403 | Only item owner can approve claims |
| Only claimant can verify | 403 | Only the claimant can verify OTP |

## Configuration

### application.properties
```properties
# Enable scheduling for timeout checks
spring.task.scheduling.pool.size=2

# JWT
app.jwtSecret=<your-secret-key>
app.jwtExpirationMs=86400000

# Email (optional)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=<your-email>
spring.mail.password=<your-app-password>
```

### Frontend Environment (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Testing Workflows

### Scenario 1: Successful Claim
1. User A registers and reports item as FOUND
2. User B claims item → CLAIM_REQUESTED
3. User A approves → OTP_PENDING (OTP sent)
4. User B enters OTP → COMPLETED ✅

### Scenario 2: Rejected Claim
1. User A reports item as FOUND
2. User B claims → CLAIM_REQUESTED
3. User A rejects → Back to FOUND
4. User C can now claim

### Scenario 3: OTP Timeout
1. User A approves claim → OTP_PENDING
2. Scheduler runs after 5 minutes
3. OTP expired → resets to FOUND
4. Claimant must start over

### Scenario 4: Multiple Failed OTPs
1. Claimant enters wrong OTP
2. Attempt count increments
3. After 3 failed attempts
4. Claim automatically cancelled → FOUND

## Performance Considerations

- **OTP Timeout Scheduler**: Runs every 5 minutes
- **Claim Timeout Scheduler**: Runs every 10 minutes
- **Recommended**: Use database indexes on status, claimant_id, otp_expiry
- **Session**: Auto-refresh claim list every 10 seconds in frontend

## Deployment Checklist

- [ ] Database migration applied
- [ ] Spring Boot @EnableScheduling active
- [ ] JWT secret configured
- [ ] CORS properly configured
- [ ] Email/SMS service setup (or note that logs are used)
- [ ] Frontend environment variables set
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured
- [ ] Monitoring/logging setup
- [ ] Backup strategy in place

## Support & Troubleshooting

**OTP not received?**
- Check NotificationService logs
- Verify user email is correct
- Configure email service if needed

**Claim not showing in dashboard?**
- Refresh page (claim list auto-refreshes every 10s)
- Check item status in database
- Verify JWT token is valid

**OTP verification fails?**
- Check system time synchronization
- Verify OTP hasn't expired (5 min window)
- Count remaining attempts

**Quick Debug Steps**
1. Check browser console for API errors
2. Check Spring Boot logs for backend errors
3. Verify database records match UI state
4. Clear browser cache and retry

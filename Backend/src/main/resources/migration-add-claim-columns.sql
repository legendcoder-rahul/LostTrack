-- Migration Script: Add Claim Verification Columns to Items Table
-- Run this SQL on your MySQL database

USE lost_found_db;

-- Add new columns for claim verification
ALTER TABLE items ADD COLUMN claimant_id BIGINT COMMENT 'ID of the person claiming the item';
ALTER TABLE items ADD COLUMN otp VARCHAR(255) COMMENT 'Hashed OTP code';
ALTER TABLE items ADD COLUMN otp_expiry DATETIME COMMENT 'OTP expiration timestamp';
ALTER TABLE items ADD COLUMN otp_attempt_count INT DEFAULT 0 COMMENT 'Number of OTP verification attempts';
ALTER TABLE items ADD COLUMN claim_approved_date DATETIME COMMENT 'When the owner approved the claim';

-- Create index for better query performance
CREATE INDEX idx_claimant_id ON items(claimant_id);
CREATE INDEX idx_status_otp ON items(status);
CREATE INDEX idx_otp_expiry ON items(otp_expiry);

-- Add foreign key constraint (optional - uncomment if using referential integrity)
-- ALTER TABLE items ADD CONSTRAINT fk_items_claimant 
-- FOREIGN KEY (claimant_id) REFERENCES users(id) ON DELETE SET NULL;

COMMIT;

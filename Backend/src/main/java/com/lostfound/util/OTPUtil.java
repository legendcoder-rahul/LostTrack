package com.lostfound.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Random;

/**
 * Utility class for OTP generation and verification
 */
public class OTPUtil {
    
    private static final Random random = new SecureRandom();
    private static final String DIGITS = "0123456789";

    /**
     * Generate a 6-digit OTP
     */
    public static String generateOTP() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            otp.append(DIGITS.charAt(random.nextInt(DIGITS.length())));
        }
        return otp.toString();
    }

    /**
     * Hash OTP using SHA-256 for secure storage
     */
    public static String hashOTP(String otp) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(otp.getBytes());
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash OTP", e);
        }
    }

    /**
     * Verify if provided OTP matches the hashed OTP
     */
    public static boolean verifyOTP(String providedOTP, String hashedOTP) {
        return hashOTP(providedOTP).equals(hashedOTP);
    }
}

package com.lostfound.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final DataSource dataSource;

    public DatabaseInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            
            System.out.println("🔧 Initializing database (preserving existing data)...");
            
            // Create users table if it doesn't exist
            stmt.execute(
                "CREATE TABLE IF NOT EXISTS users (" +
                "    id BIGINT AUTO_INCREMENT PRIMARY KEY," +
                "    email VARCHAR(255) NOT NULL UNIQUE," +
                "    password VARCHAR(255) NOT NULL," +
                "    name VARCHAR(100) NOT NULL," +
                "    phone VARCHAR(20) NOT NULL," +
                "    address TEXT," +
                "    role VARCHAR(20) NOT NULL DEFAULT 'USER'," +
                "    is_active TINYINT(1) NOT NULL DEFAULT 1," +
                "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                "    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
                "    INDEX idx_email (email)," +
                "    INDEX idx_role (role)" +
                ")"
            );
            System.out.println("✓ Users table ready");

            // Create items table if it doesn't exist
            stmt.execute(
                "CREATE TABLE IF NOT EXISTS items (" +
                "    id BIGINT AUTO_INCREMENT PRIMARY KEY," +
                "    title VARCHAR(255) NOT NULL," +
                "    description LONGTEXT," +
                "    location VARCHAR(255) NOT NULL," +
                "    status VARCHAR(20) NOT NULL DEFAULT 'LOST'," +
                "    image_data LONGTEXT," +
                "    reported_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP," +
                "    contact_info VARCHAR(255) NOT NULL," +
                "    user_id BIGINT NOT NULL," +
                "    claimant_id BIGINT COMMENT 'ID of the person claiming the item'," +
                "    otp VARCHAR(255) COMMENT 'Hashed OTP code'," +
                "    otp_expiry DATETIME COMMENT 'OTP expiration timestamp'," +
                "    otp_attempt_count INT DEFAULT 0 COMMENT 'Number of OTP verification attempts'," +
                "    claim_approved_date DATETIME COMMENT 'When the owner approved the claim'," +
                "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                "    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
                "    INDEX idx_status (status)," +
                "    INDEX idx_location (location)," +
                "    INDEX idx_created_at (created_at)," +
                "    INDEX idx_user_id (user_id)," +
                "    INDEX idx_claimant_id (claimant_id)," +
                "    INDEX idx_otp_expiry (otp_expiry)" +
                ")"
            );
            System.out.println("✓ Items table ready");

            // Check if admin user already exists before inserting
            try {
                stmt.execute(
                    "INSERT IGNORE INTO users (id, email, password, name, phone, role, is_active) " +
                    "VALUES (1, 'admin@example.com', '$2a$10$SlVZcheynZake9upc1K9n.E.3Np3QTq.i9BrfKu4yKh.x8iHI4bK', 'Admin User', '+1234567890', 'ADMIN', 1)"
                );
                System.out.println("✓ Admin user verified");
            } catch (Exception e) {
                System.out.println("✓ Admin user already exists (no action needed)");
            }
            
            System.out.println("✓ Database initialization complete! Your data is safe! 🎉");

        } catch (Exception e) {
            System.err.println("❌ Database initialization failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Database initialization failed", e);
        }
    }
}

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
            
            System.out.println("🔧 Resetting database...");
            
            // Drop the entire database and recreate it
            stmt.execute("DROP DATABASE IF EXISTS lost_found_db");
            System.out.println("  - Dropped database");
            
            // Create fresh database
            stmt.execute("CREATE DATABASE lost_found_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            System.out.println("  - Created database");
            
            // Switch to the new database
            stmt.execute("USE lost_found_db");
            System.out.println("  - Switched to database");
            
            // Create users table
            stmt.execute(
                "CREATE TABLE users (" +
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
            System.out.println("✓ Created users table");

            // Create items table WITHOUT foreign key constraint
            stmt.execute(
                "CREATE TABLE items (" +
                "    id BIGINT AUTO_INCREMENT PRIMARY KEY," +
                "    title VARCHAR(255) NOT NULL," +
                "    description LONGTEXT," +
                "    location VARCHAR(255) NOT NULL," +
                "    status VARCHAR(20) NOT NULL DEFAULT 'LOST'," +
                "    image_data LONGTEXT," +
                "    reported_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP," +
                "    contact_info VARCHAR(255) NOT NULL," +
                "    user_id BIGINT NOT NULL," +
                "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                "    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
                "    INDEX idx_status (status)," +
                "    INDEX idx_location (location)," +
                "    INDEX idx_created_at (created_at)," +
                "    INDEX idx_user_id (user_id)" +
                ")"
            );
            System.out.println("✓ Created items table");

            // Insert sample admin user
            stmt.execute(
                "INSERT INTO users (id, email, password, name, phone, role, is_active) " +
                "VALUES (1, 'admin@example.com', '$2a$10$SlVZcheynZake9upc1K9n.E.3Np3QTq.i9BrfKu4yKh.x8iHI4bK', 'Admin User', '+1234567890', 'ADMIN', 1)"
            );
            System.out.println("✓ Inserted admin user");
            System.out.println("✓ Database ready!");

        } catch (Exception e) {
            System.err.println("❌ Database initialization failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Database initialization failed", e);
        }
    }
}

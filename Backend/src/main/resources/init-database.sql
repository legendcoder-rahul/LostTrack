-- Initialize database schema for Lost & Found system

-- Drop existing tables if they exist
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS=1;

-- Create Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Create Items Table
CREATE TABLE items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'LOST',
    image_data LONGTEXT,
    reported_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    contact_info VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_location (location),
    INDEX idx_created_at (created_at),
    CONSTRAINT fk_items_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample admin user
INSERT INTO users (id, email, password, name, phone, role, is_active) 
VALUES (1, 'admin@example.com', '$2a$10$SlVZcheynZake9upc1K9n.E.3Np3QTq.i9BrfKu4yKh.x8iHI4bK', 'Admin User', '+1234567890', 'ADMIN', 1);

-- Insert sample items
INSERT INTO items (title, description, location, status, reported_date, contact_info, user_id) VALUES
('Vintage Chanel Handbag', 'Black leather handbag with gold chain strap', 'Central Station', 'LOST', NOW(), 'user@example.com', 1),
('MacBook Pro 14"', 'Silver MacBook Pro 14-inch 2023 model with M3 chip', 'Public Library', 'FOUND', NOW(), 'finder@example.com', 1),
('Brown Leather Wallet', 'Brown leather bifold wallet with initials K.S.', 'Downtown Mall', 'LOST', NOW(), 'lost.wallet@mail.com', 1),
('Keys with Red Keychain', 'Set of 5 keys with red plastic keychain and luggage tag', 'Riverside Park Trail', 'FOUND', NOW(), 'goodfinder@mail.com', 1),
('Apple Watch Series 7', 'Space Gray Apple Watch Series 7, 41mm with sport band', 'Sports Complex Gym', 'LOST', NOW(), 'watch.owner@mail.com', 1),
('Blue Runner Sneakers', 'Nike Air Zoom Pegasus, size 10, blue and white', 'Metro Station Entrance', 'FOUND', NOW(), 'sports.finder@mail.com', 1);

-- This script inserts sample data after schema creation

-- Add sample user if not exists
INSERT IGNORE INTO users (id, email, password, name, phone, address, role, is_active)
VALUES (1, 'admin@example.com', '$2a$10$SlVZcheynZake9upc1K9n.E.3Np3QTq.i9BrfKu4yKh.x8iHI4bK', 'Admin User', '+1234567890', 'Admin Address', 'ADMIN', 1);

-- Add sample items
INSERT IGNORE INTO items (id, title, description, location, status, image_data, reported_date, contact_info, user_id, created_at, updated_at)
VALUES
(1, 'Vintage Chanel Handbag', 'Black leather handbag with gold chain strap', 'Central Station', 'LOST', NULL, NOW(), 'user@example.com', 1, NOW(), NOW()),
(2, 'MacBook Pro 14"', 'Silver MacBook Pro 14-inch 2023 model with M3 chip', 'Public Library', 'FOUND', NULL, NOW(), 'finder@example.com', 1, NOW(), NOW()),
(3, 'Brown Leather Wallet', 'Brown leather bifold wallet with initials K.S.', 'Downtown Mall', 'LOST', NULL, NOW(), 'lost.wallet@mail.com', 1, NOW(), NOW()),
(4, 'Keys with Red Keychain', 'Set of 5 keys with red plastic keychain and luggage tag', 'Riverside Park Trail', 'FOUND', NULL, NOW(), 'goodfinder@mail.com', 1, NOW(), NOW()),
(5, 'Apple Watch Series 7', 'Space Gray Apple Watch Series 7, 41mm with sport band', 'Sports Complex Gym', 'LOST', NULL, NOW(), 'watch.owner@mail.com', 1, NOW(), NOW()),
(6, 'Blue Runner Sneakers', 'Nike Air Zoom Pegasus, size 10, blue and white', 'Metro Station Entrance', 'FOUND', NULL, NOW(), 'sports.finder@mail.com', 1, NOW(), NOW());

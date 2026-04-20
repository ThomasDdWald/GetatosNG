-- GeTaToS Safari - Simple seed for new Prisma schema

-- ADMIN USER (password: admin123)
INSERT INTO admin_users (email, password_hash, full_name, role, created_at, updated_at) 
VALUES ('admin@getatos-safari.com', '$2a$10$rVqKcCqK.j.kZxE8VxY8vu0kJ0vE7Q0H', 'Admin User', 'admin', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- TOURS
INSERT INTO tours (tour_type, duration_days, difficulty, price_en, price_de, currency_en, currency_de, max_group_size, is_featured, is_active, title_en, title_de, slug_en, slug_de, description_en, description_de, short_description_en, short_description_de, created_at, updated_at) VALUES 
('safari', 5, 'easy', 2800, 2500, 'USD', 'EUR', 6, true, true, 'Serengeti Safari - Great Migration', 'Serengeti Safari - Große Tierwanderung', 'serengeti-safari-great-migration', 'serengeti-safari-grosse-tierwanderung', 'Experience the famous Great Migration in Serengeti.', 'Erleben Sie die berühmte Große Tierwanderung.', 'Experience the Great Migration', 'Erleben Sie die Große Tierwanderung', NOW(), NOW());

-- SITE SETTINGS (kein created_at, nur updated_at)
INSERT INTO site_settings (setting_key, setting_value, category, updated_at) VALUES
('booking_enabled', 'true', 'general', NOW()),
('currency', 'USD', 'general', NOW()),
('company_name', 'GeTaToS Safari', 'general', NOW()),
('company_email', 'info@getatos-safari.com', 'general', NOW());

-- SOCIAL MEDIA
INSERT INTO social_media (platform, url, display_order, is_active, created_at, updated_at) VALUES
('facebook', 'https://facebook.com/getatos', 1, true, NOW(), NOW()),
('instagram', 'https://instagram.com/getatos', 2, true, NOW(), NOW());
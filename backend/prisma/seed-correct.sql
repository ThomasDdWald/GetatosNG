-- GeTaToS Safari - Korrektes Seed basierend auf Prisma Schema
-- Run: psql -h localhost -p 5433 -U getatos_admin -d getatos_safari -f seed-correct.sql

-- ADMIN USER (password: admin123)
INSERT INTO admin_users (email, password_hash, full_name, role) 
VALUES ('admin@getatos-safari.com', '$2a$10$rVqKcCqK.j.kZxE8VxY8vu0kJ0vE7Q0H', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- TOURS (mit allen Pflichtfeldern)
INSERT INTO tours (tour_type, duration_days, difficulty, price_en, price_de, currency_en, currency_de, max_group_size, is_featured, is_active, title_en, title_de, slug_en, slug_de, description_en, description_de, short_description_en, short_description_de) VALUES
('safari', 5, 'easy', 2800, 2500, 'USD', 'EUR', 6, true, true, 'Serengeti Safari - Great Migration', 'Serengeti Safari - Große Tierwanderung', 'serengeti-safari-great-migration', 'serengeti-safari-grosse-tierwanderung', 'Experience the famous Great Migration in Serengeti. See thousands of wildebeest and zebras crossing the plains.', 'Erleben Sie die berühmte Große Tierwanderung in der Serengeti.', 'Experience the Great Migration', 'Erleben Sie die Große Tierwanderung'),
('safari', 7, 'medium', 3500, 3200, 'USD', 'EUR', 8, true, true, 'Masai Mara & Serengeti Adventure', 'Masai Mara & Serengeti Abenteuer', 'masai-mara-serengeti-adventure', 'masai-mara-serengeti-abenteuer', 'Combined safari across both famous parks. Witness the Big Five and the migration.', 'Kombinierte Safari durch beide berühmten Parks. Erleben Sie die Big Five.'),
('safari', 3, 'easy', 1500, 1350, 'USD', 'EUR', 4, false, true, 'Tarangire National Park', 'Tarangire Nationalpark', 'tarangire-national-park', 'tarangire-nationalpark', 'Day trips to Tarangire known for its large elephant herds.', 'Tagesausflüge in den Tarangire mit seinen großen Elefantenherden.');

-- TESTIMONIALS (guest_name statt name)
INSERT INTO testimonials (tour_id, guest_name, guest_country, rating, comment, is_approved, is_featured) VALUES
(1, 'Hans Mueller', 'Germany', 5, 'Amazing safari experience!', true, true),
(2, 'Sarah Johnson', 'UK', 5, 'Best trip ever!', true, true);

-- SITE SETTINGS
INSERT INTO site_settings (setting_key, setting_value, category) VALUES
('booking_enabled', 'true', 'general'),
('currency', 'USD', 'general'),
('company_name', 'GeTaToS Safari', 'general'),
('company_email', 'info@getatos-safari.com', 'general'),
('company_phone', '+255712345678', 'general'),
('company_address', 'Arusha, Tanzania', 'general');

-- SOCIAL MEDIA
INSERT INTO social_media (platform, url, display_order, is_active) VALUES
('facebook', 'https://facebook.com/getatos', 1, true),
('instagram', 'https://instagram.com/getatos', 2, true);

-- GALLERY
INSERT INTO gallery_images (caption_en, caption_de, url, display_order, is_active) VALUES
('Lion in Serengeti', 'Löwe in der Serengeti', 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800', 1, true),
('Elephants', 'Elefanten', 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800', 2, true);

SELECT 'Seeding completed!' as status;
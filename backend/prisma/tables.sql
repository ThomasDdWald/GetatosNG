-- Sample data for Cloud SQL (run AFTER tables-create.sql!)
-- NOTE: Admin password is 'admin123' - change in production!

-- Admin User (email: admin@getatos-safari.com, password: admin123)
INSERT INTO admin_users (email, password_hash, full_name, role) 
VALUES ('admin@getatos-safari.com', '$2a$10$rVqKcCqK.j.kZxE8VxY8vu0kJ0vE7Q0H', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Tours
INSERT INTO tours (
  tour_type, duration_days, difficulty, price_en, price_de, currency_en, currency_de,
  max_group_size, is_featured, is_active,
  title_en, title_de, title_es, title_fr, title_zh,
  description_en, description_de, short_description_en, short_description_de,
  slug_en, slug_de
) VALUES 
('safari', 5, 'easy', 2800, 2500, 'USD', 'EUR', 6, true, true,
  'Serengeti Safari - Great Migration', 'Serengeti Safari - Große Tierwanderung', 'Safari Serengeti', 'Safari Serengeti', '塞伦盖蒂',
  'Experience the famous Great Migration in Serengeti.', 'Erleben Sie die berühmte Große Tierwanderung.',
  'Experience the Great Migration', 'Erleben Sie die Große Tierwanderung',
  'serengeti-safari-great-migration', 'serengeti-safari-grosse-tierwanderung');

-- Testimonials  
INSERT INTO testimonials (name, country, rating, text_en, text_de, is_published)
VALUES 
('Hans Mueller', 'Germany', 5, 'Amazing safari!', 'Tolle Safari!', true);

-- Site Settings
INSERT INTO site_settings (setting_key, setting_value, category) VALUES
('booking_enabled', 'true', 'general'),
('currency', 'USD', 'general');

-- Social Media
INSERT INTO social_media (platform, url, display_order) VALUES
('facebook', 'https://facebook.com/getatos', 1),
('instagram', 'https://instagram.com/getatos', 2);

-- FAQ Categories
INSERT INTO faq_categories (name_en, name_de, display_order) VALUES
('General', 'Allgemein', 1);

-- FAQs
INSERT INTO faqs (question_en, question_de, answer_en, answer_de, category) VALUES
('What is the best time?', 'Wann ist die beste Zeit?', 'June to October.', 'Juni bis Oktober.', 'general');
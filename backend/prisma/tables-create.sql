-- Create tables for Cloud SQL (run this first!)
-- Based on Prisma schema

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tours
CREATE TABLE IF NOT EXISTS tours (
    id SERIAL PRIMARY KEY,
    slug_de VARCHAR(255),
    slug_en VARCHAR(255),
    slug_es VARCHAR(255),
    slug_fr VARCHAR(255),
    slug_zh VARCHAR(255),
    tour_type VARCHAR(50) NOT NULL,
    duration_days INTEGER NOT NULL,
    difficulty VARCHAR(50),
    price_en DECIMAL(10,2),
    price_de DECIMAL(10,2),
    price_es DECIMAL(10,2),
    price_fr DECIMAL(10,2),
    price_zh DECIMAL(10,2),
    currency_en VARCHAR(10),
    currency_de VARCHAR(10),
    currency_es VARCHAR(10),
    currency_fr VARCHAR(10),
    currency_zh VARCHAR(10),
    max_group_size INTEGER,
    highlights_en JSONB,
    highlights_de JSONB,
    highlights_es JSONB,
    highlights_fr JSONB,
    highlights_zh JSONB,
    included_en JSONB,
    included_de JSONB,
    included_es JSONB,
    included_fr JSONB,
    included_zh JSONB,
    not_included_en JSONB,
    not_included_de JSONB,
    not_included_es JSONB,
    not_included_fr JSONB,
    not_included_zh JSONB,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    title_en TEXT,
    title_de TEXT,
    title_es TEXT,
    title_fr TEXT,
    title_zh TEXT,
    description_en TEXT,
    description_de TEXT,
    description_es TEXT,
    description_fr TEXT,
    description_zh TEXT,
    short_description_en TEXT,
    short_description_de TEXT,
    short_description_es TEXT,
    short_description_fr TEXT,
    short_description_zh TEXT,
    itinerary_en JSONB,
    itinerary_de JSONB,
    itinerary_es JSONB,
    itinerary_fr JSONB,
    itinerary_zh JSONB,
    image_url VARCHAR(500),
    gallery JSONB,
    min_age INTEGER,
    accommodation_en TEXT,
    accommodation_de TEXT,
    accommodation_es TEXT,
    accommodation_fr TEXT,
    accommodation_zh TEXT,
    category VARCHAR(100),
    location_en TEXT,
    location_de TEXT,
    location_es TEXT,
    location_fr TEXT,
    location_zh TEXT
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_country VARCHAR(100),
    travel_date TIMESTAMP,
    party_size INTEGER NOT NULL,
    total_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    special_requests TEXT,
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog Posts  
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE,
    title_en TEXT,
    title_de TEXT,
    title_es TEXT,
    title_fr TEXT,
    title_zh TEXT,
    content_en TEXT,
    content_de TEXT,
    content_es TEXT,
    content_fr TEXT,
    content_zh TEXT,
    excerpt_en TEXT,
    excerpt_de TEXT,
    excerpt_es TEXT,
    excerpt_fr TEXT,
    excerpt_zh TEXT,
    image_url VARCHAR(500),
    author VARCHAR(255),
    published_at TIMESTAMP,
    is_published BOOLEAN DEFAULT false,
    seo_title_en VARCHAR(255),
    seo_title_de VARCHAR(255),
    seo_title_es VARCHAR(255),
    seo_title_fr VARCHAR(255),
    seo_title_zh VARCHAR(255),
    seo_description_en TEXT,
    seo_description_de TEXT,
    seo_description_es TEXT,
    seo_description_fr TEXT,
    seo_description_zh TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    rating INTEGER,
    text_en TEXT,
    text_de TEXT,
    text_es TEXT,
    text_fr TEXT,
    text_zh TEXT,
    image_url VARCHAR(500),
    is_published BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter
CREATE TABLE IF NOT EXISTS newsletter (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP DEFAULT NOW(),
    unsubscribed_at TIMESTAMP
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    caption_en TEXT,
    caption_de TEXT,
    caption_es TEXT,
    caption_fr TEXT,
    caption_zh TEXT,
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Translations
CREATE TABLE IF NOT EXISTS translations (
    id SERIAL PRIMARY KEY,
    language VARCHAR(10) NOT NULL,
    key VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(language, key)
);

-- Contact
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    category VARCHAR(100),
    language VARCHAR(10),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Social Media
CREATE TABLE IF NOT EXISTS social_media (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Company Info
CREATE TABLE IF NOT EXISTS company_info (
    id SERIAL PRIMARY KEY,
    info_key VARCHAR(255) UNIQUE NOT NULL,
    info_value TEXT,
    category VARCHAR(100),
    language VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- FAQs
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question_en TEXT NOT NULL,
    question_de TEXT,
    question_es TEXT,
    question_fr TEXT,
    question_zh TEXT,
    answer_en TEXT NOT NULL,
    answer_de TEXT,
    answer_es TEXT,
    answer_fr TEXT,
    answer_zh TEXT,
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- FAQ Categories
CREATE TABLE IF NOT EXISTS faq_categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_de VARCHAR(255),
    name_es VARCHAR(255),
    name_fr VARCHAR(255),
    name_zh VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
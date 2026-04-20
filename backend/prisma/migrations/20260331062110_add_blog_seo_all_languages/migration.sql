-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tours" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "short_description" TEXT,
    "tour_type" TEXT NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "difficulty" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price_de" DOUBLE PRECISION,
    "price_en" DOUBLE PRECISION,
    "price_es" DOUBLE PRECISION,
    "price_fr" DOUBLE PRECISION,
    "price_zh" DOUBLE PRECISION,
    "currency_de" TEXT,
    "currency_en" TEXT,
    "currency_es" TEXT,
    "currency_fr" TEXT,
    "currency_zh" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "max_group_size" INTEGER,
    "highlights" TEXT[],
    "included" TEXT[],
    "not_included" TEXT[],
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title_de" TEXT,
    "title_es" TEXT,
    "title_fr" TEXT,
    "title_zh" TEXT,
    "description_de" TEXT,
    "description_es" TEXT,
    "description_fr" TEXT,
    "description_zh" TEXT,
    "short_description_de" TEXT,
    "short_description_es" TEXT,
    "short_description_fr" TEXT,
    "short_description_zh" TEXT,
    "slug_de" TEXT,
    "slug_es" TEXT,
    "slug_fr" TEXT,
    "slug_zh" TEXT,
    "start_lat" DOUBLE PRECISION,
    "start_lng" DOUBLE PRECISION,
    "start_name" TEXT,
    "end_lat" DOUBLE PRECISION,
    "end_lng" DOUBLE PRECISION,
    "end_name" TEXT,
    "waypoints" TEXT,

    CONSTRAINT "tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_images" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tour_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerary" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "day_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "accommodation" TEXT,
    "meals" TEXT,
    "title_de" TEXT,
    "title_es" TEXT,
    "title_fr" TEXT,
    "title_zh" TEXT,
    "description_de" TEXT,
    "description_es" TEXT,
    "description_fr" TEXT,
    "description_zh" TEXT,

    CONSTRAINT "itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "nationality" TEXT,
    "travel_date" TIMESTAMP(3),
    "number_of_guests" INTEGER NOT NULL DEFAULT 1,
    "additional_guests" TEXT,
    "special_requests" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "total_price" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'EUR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "excerpt" TEXT,
    "featured_image" TEXT,
    "author" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title_de" TEXT,
    "title_es" TEXT,
    "title_fr" TEXT,
    "title_zh" TEXT,
    "content_de" TEXT,
    "content_es" TEXT,
    "content_fr" TEXT,
    "content_zh" TEXT,
    "excerpt_de" TEXT,
    "excerpt_es" TEXT,
    "excerpt_fr" TEXT,
    "excerpt_zh" TEXT,
    "slug_de" TEXT,
    "slug_es" TEXT,
    "slug_fr" TEXT,
    "slug_zh" TEXT,
    "category_de" TEXT,
    "category_en" TEXT,
    "category_es" TEXT,
    "category_fr" TEXT,
    "category_zh" TEXT,
    "meta_title_de" TEXT,
    "meta_title_en" TEXT,
    "meta_title_es" TEXT,
    "meta_title_fr" TEXT,
    "meta_title_zh" TEXT,
    "meta_description_de" TEXT,
    "meta_description_en" TEXT,
    "meta_description_es" TEXT,
    "meta_description_fr" TEXT,
    "meta_description_zh" TEXT,
    "h1_de" TEXT,
    "h1_en" TEXT,
    "h1_es" TEXT,
    "h1_fr" TEXT,
    "h1_zh" TEXT,
    "featured_image_alt_de" TEXT,
    "featured_image_alt_en" TEXT,
    "featured_image_alt_es" TEXT,
    "featured_image_alt_fr" TEXT,
    "featured_image_alt_zh" TEXT,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER,
    "guest_name" TEXT NOT NULL,
    "guest_country" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscribers" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "subscribed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed_at" TIMESTAMP(3),

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" SERIAL NOT NULL,
    "language_code" TEXT NOT NULL,
    "page_key" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" SERIAL NOT NULL,
    "setting_key" TEXT NOT NULL,
    "setting_value" TEXT,
    "setting_type" TEXT,
    "category" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_info" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "category" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media" (
    "id" SERIAL NOT NULL,
    "platform" TEXT NOT NULL,
    "username" TEXT,
    "url" TEXT,
    "icon" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_config" (
    "id" SERIAL NOT NULL,
    "page_key" TEXT NOT NULL,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "og_image" TEXT,
    "canonical_url" TEXT,
    "no_index" BOOLEAN NOT NULL DEFAULT false,
    "no_follow" BOOLEAN NOT NULL DEFAULT false,
    "schema_markup" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_images" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "title_de" TEXT,
    "title_es" TEXT,
    "title_fr" TEXT,
    "title_zh" TEXT,
    "description" TEXT,
    "description_de" TEXT,
    "description_es" TEXT,
    "description_fr" TEXT,
    "description_zh" TEXT,
    "url" TEXT NOT NULL,
    "slug" TEXT,
    "category" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms_and_conditions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terms_and_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "language" TEXT NOT NULL DEFAULT 'en',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tours_slug_key" ON "tours"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "translations_language_code_page_key_key_key" ON "translations"("language_code", "page_key", "key");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_setting_key_key" ON "site_settings"("setting_key");

-- CreateIndex
CREATE UNIQUE INDEX "company_info_key_key" ON "company_info"("key");

-- CreateIndex
CREATE UNIQUE INDEX "seo_config_page_key_key" ON "seo_config"("page_key");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_images_slug_key" ON "gallery_images"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "terms_and_conditions_language_version_key" ON "terms_and_conditions"("language", "version");

-- AddForeignKey
ALTER TABLE "tour_images" ADD CONSTRAINT "tour_images_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary" ADD CONSTRAINT "itinerary_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE SET NULL ON UPDATE CASCADE;

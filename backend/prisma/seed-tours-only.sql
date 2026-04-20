-- ============================================================================
-- GeTaToS Safari - Touren & Blog mit Übersetzungen
-- Führen Sie dieses Script aus, um Touren und Blog-Beiträge in die Datenbank einzufügen
-- ============================================================================

-- ============================================
-- TOURS - Safari, Kilimanjaro & Beach Touren
-- ============================================

-- Tour 1: Serengeti Safari
INSERT INTO tours (
  title, slug, description, short_description, tour_type, duration_days, difficulty, price, price_de, price_en, currency, currency_de, currency_en,
  max_group_size, highlights, included, not_included, is_featured, is_active,
  title_de, title_es, title_fr, title_zh,
  description_de, description_es, description_fr, description_zh,
  short_description_de, short_description_es, short_description_fr, short_description_zh,
  slug_de, slug_es, slug_fr, slug_zh,
  start_lat, start_lng, start_name, end_lat, end_lng, end_name,
  created_at, updated_at
) VALUES (
  'Serengeti Safari - Große Tierwanderung',
  'serengeti-safari-grosse-tierwanderung',
  'Erleben Sie die berühmte Große Tierwanderung in der Serengeti. Millionen von Gnus, Zebras und Antilopen ziehen durch die endlosen Ebenen Afrikas. Diese Safari führt Sie zu den spektakulärsten Tierbeobachtungsplätzen.',
  'Erleben Sie die Große Tierwanderung in der Serengeti',
  'safari', 5, 'easy', 2500, 2500, 2800, 'EUR', 'EUR', 'USD',
  6,
  ARRAY['Tierwanderung beobachten', 'Big Five sehen', 'Heiße Ballonfahrt optional', 'Maasai Dorf Besuch', 'Ngorongoro Krater'],
  ARRAY['4x4 Safari-Fahrzeug mit Pop-up Dach', 'Erfahrener englischsprachiger Guide', 'Alle Mahlzeiten inklusive', 'Übernachtung in Lodges', 'Nationalparkgebühren'],
  ARRAY['Internationale Flüge', 'Reiseversicherung', 'Trinkgelder', 'Alkoholische Getränke'],
  true, true,
  'Serengeti Safari - Große Tierwanderung', 'Safari Serengeti - Gran Migración', 'Safari Serengeti - Grande Migration', '塞伦盖蒂Safari - 大迁徙',
  'Erleben Sie die berühmte Große Tierwanderung in der Serengeti. Millionen von Gnus, Zebras und Antilopen ziehen durch die endlosen Ebenen Afrikas.', 'Experimente la famosa Gran Migración en el Serengeti. Millones de ñus, cebras y antílopes recorren las vastas llanuras de África.', 'Vivez la célèbre Grande Migration dans le Serengeti. Des millions de gnous, zèbres et antilopes traversent les vastes plaines d''Afrique.', '体验塞伦盖蒂著名的大迁徙。数以百万计的牛羚、斑马和羚羊穿越非洲广袤的平原。',
  'Erleben Sie die Große Tierwanderung in der Serengeti', 'Experimente la Gran Migración en el Serengeti', 'Vivez la Grande Migration dans le Serengeti', '体验塞伦盖蒂的大迁徙',
  'serengeti-safari-grosse-tierwanderung', 'safari-serengeti-gran-migracion', 'safari-serengeti-grande-migration', 'serengeti-safari-da-qian-yi',
  -2.3333, 34.8333, 'Arusha', -2.3333, 34.8333, 'Arusha',
  NOW(), NOW()
);

-- Tour 2: Kilimanjaro Summit
INSERT INTO tours (
  title, slug, description, short_description, tour_type, duration_days, difficulty, price, price_de, price_en, currency, currency_de, currency_en,
  max_group_size, highlights, included, not_included, is_featured, is_active,
  title_de, title_es, title_fr, title_zh,
  description_de, description_es, description_fr, description_zh,
  short_description_de, short_description_es, short_description_fr, short_description_zh,
  slug_de, slug_es, slug_fr, slug_zh,
  start_lat, start_lng, start_name, end_lat, end_lng, end_name,
  created_at, updated_at
) VALUES (
  'Kilimanjaro Besteigung - Summit auf den Dach Afrikas',
  'kilimanjaro-besteigung-summit',
  'Besteigen Sie den höchsten Berg Afrikas. Der Kilimanjaro mit seinen 5.895 Metern ist ein einzigartiges Abenteuer. Erleben Sie die verschiedenen Klimazonen von Regenwald bis Gletscher und genießen Sie den Sonnenaufgang vom Uhuru Peak.',
  'Besteigen Sie den höchsten Berg Afrikas',
  'kilimanjaro', 8, 'challenging', 3500, 3500, 3800, 'EUR', 'EUR', 'USD',
  12,
  ARRAY['Uhuru Peak Besteigung', '5 Klimazonen erleben', 'Sonnenaufgang am Gipfel', 'Mawenzi Aussicht', 'Professionelle Bergführer'],
  ARRAY['Erfahrene Kilimanjaro-Guides', 'Träger für Gepäck', 'Alle Mahlzeiten während der Trekking', 'Übernachtung in Hütten', 'Höhenmedizin und Sauerstoff'],
  ARRAY['Internationale Flüge', 'Reiseversicherung', 'Bergsteigungsausrüstung', 'Trinkgelder'],
  true, true,
  'Kilimanjaro Besteigung - Summit auf den Dach Afrikas', 'Ascensión al Kilimanjaro - Cumbre', 'Ascension au Kilimanjaro - Sommet', '乞力马扎罗登山 - 峰顶',
  'Besteigen Sie den höchsten Berg Afrikas. Der Kilimanjaro mit seinen 5.895 Metern ist ein einzigartiges Abenteuer.', 'Ascienda al punto más alto de África. El Kilimanjaro con sus 5.895 metros es una aventura única.', 'Atteignez le plus haut sommet d''Afrique. Le Kilimanjaro à 5 895 mètres est une aventure unique.', '攀登非洲最高峰。乞力马扎罗海拔5895米，是一次独特的冒险。',
  'Besteigen Sie den höchsten Berg Afrikas', 'Ascienda al punto más alto de África', 'Atteignez le plus haut sommet d''Afrique', '攀登非洲最高峰',
  'kilimanjaro-besteigung-summit', 'ascension-kilimanjaro-cumbre', 'ascension-kilimanjaro-sommet', 'qilimajialuo-dengshan-fengding',
  -3.0674, 37.3556, 'Moshi', -3.0674, 37.3556, 'Moshi',
  NOW(), NOW()
);

-- Tour 3: Zanzibar Strandurlaub
INSERT INTO tours (
  title, slug, description, short_description, tour_type, duration_days, difficulty, price, price_de, price_en, currency, currency_de, currency_en,
  max_group_size, highlights, included, not_included, is_featured, is_active,
  title_de, title_es, title_fr, title_zh,
  description_de, description_es, description_fr, description_zh,
  short_description_de, short_description_es, short_description_fr, short_description_zh,
  slug_de, slug_es, slug_fr, slug_zh,
  start_lat, start_lng, start_name, end_lat, end_lng, end_name,
  created_at, updated_at
) VALUES (
  'Zanzibar Strandparadies - Trauminsel im Indischen Ozean',
  'zanzibar-strandparadies',
  'Entspannen Sie an den wunderschönen Stränden von Sansibar. Kristallklares Wasser, weiße Sandstrände und eine reiche Kultur erwarten Sie. Besuchen Sie die historische Stone Town und genießen Sie das Paradies.',
  'Entspannen Sie im Paradies von Sansibar',
  'beach', 6, 'easy', 1800, 1800, 2000, 'EUR', 'EUR', 'USD',
  10,
  ARRAY['Weiße Sandstrände', 'Tauchen und Schnorcheln', 'Stone Town Besichtigung', 'Gewürz-Tour', 'Sonnenuntergang-Dhow-Fahrt'],
  ARRAY['Strandresort mit Halbpension', 'Flughafentransfers', 'Tägliche Reinigung', 'Strandhandtücher', 'Nicht-motorisierte Wassersportarten'],
  ARRAY['Internationale Flüge', 'Reiseversicherung', 'Alkoholische Getränke', 'Optionale Ausflüge'],
  true, true,
  'Zanzibar Strandparadies - Trauminsel im Indischen Ozean', 'Paraíso de Playa Zanzibar - Isla de sueños', 'Paradis plage Zanzibar - Île de rêve', '桑给巴尔海滩天堂 - 梦想之岛',
  'Entspannen Sie an den wunderschönen Stränden von Sansibar. Kristallklares Wasser, weiße Sandstrände und eine reiche Kultur erwarten Sie.', 'Relájese en las hermosas playas de Zanzibar. Agua cristalina, playas de arena blanca y una rica cultura le esperan.', 'Détendez-vous sur les belles plages de Zanzibar. Eau cristalline, plages de sable blanc et une culture riche vous attendent.', '在桑给巴尔美丽的海滩上放松身心。清澈的海水、白色的沙滩和丰富的文化等待着您。',
  'Entspannen Sie im Paradies von Sansibar', 'Relájese en el paraíso de Zanzibar', 'Détendez-vous au paradis de Zanzibar', '在桑给巴尔天堂放松身心',
  'zanzibar-strandparadies', 'paraiso-playa-zanzibar', 'paradis-plage-zanzibar', 'sangjibaer-haitan-leyuan',
  -6.1659, 39.2026, 'Zanzibar', -6.1659, 39.2026, 'Zanzibar',
  NOW(), NOW()
);

-- Tour 4: Tarangire & Ngorongoro
INSERT INTO tours (
  title, slug, description, short_description, tour_type, duration_days, difficulty, price, price_de, price_en, currency, currency_de, currency_en,
  max_group_size, highlights, included, not_included, is_featured, is_active,
  title_de, title_es, title_fr, title_zh,
  description_de, description_es, description_fr, description_zh,
  short_description_de, short_description_es, short_description_fr, short_description_zh,
  slug_de, slug_es, slug_fr, slug_zh,
  created_at, updated_at
) VALUES (
  'Tarangire & Ngorongoro - Elefantenparadies und Krater',
  'tarangire-ngorongoro-safari',
  'Erleben Sie die spektakuläre Tierwelt des Tarangire Nationalparks, bekannt für seine großen Elefantenherden, und den einzigartigen Ngorongoro Krater, den größten unbeschädigten Vulkankrater der Welt.',
  'Elefantenherden und der einzigartige Ngorongoro Krater',
  'safari', 4, 'easy', 1800, 1800, 2000, 'EUR', 'EUR', 'USD',
  6,
  ARRAY['Große Elefantenherden', 'Ngorongoro Krater', 'Big Five', 'Flamingo-See', 'Maasai-Dorf'],
  ARRAY['4x4 Safari-Fahrzeug', 'Erfahrener Guide', 'Vollpension', 'Lodge-Unterkunft', 'Nationalparkgebühren'],
  ARRAY['Internationale Flüge', 'Reiseversicherung', 'Trinkgelder', 'Alkohol'],
  true, true,
  'Tarangire & Ngorongoro - Elefantenparadies und Krater', 'Tarangire y Ngorongoro - Paraíso de elefantes y cráter', 'Tarangire et Ngorongoro - Paradis des éléphants et cratère', '塔兰吉雷和恩戈罗恩戈罗 - 大象天堂和火山口',
  'Erleben Sie die spektakuläre Tierwelt des Tarangire Nationalparks.', 'Experimente la fauna impresionante del Parque Nacional Tarangire.', 'Vivez la faune spectaculaire du Parc National de Tarangire.', '体验塔兰吉雷国家公园壮观的野生动物。',
  'Elefantenherden und der einzigartige Ngorongoro Krater', 'Rebaños de elefantes y el impresionante cráter de Ngorongoro', 'Troupeaux d''éléphants et le cratère impressionnant de Ngorongoro', '大象群和令人印象深刻的恩戈罗恩戈罗火山口',
  'tarangire-ngorongoro-safari', 'tarangire-ngorongoro-safari', 'tarangire-ngorongoro-safari', 'tarangire-ngorongoro-safari',
  NOW(), NOW()
);

-- Tour 5: Kombi Safari & Strand
INSERT INTO tours (
  title, slug, description, short_description, tour_type, duration_days, difficulty, price, price_de, price_en, currency, currency_de, currency_en,
  max_group_size, highlights, included, not_included, is_featured, is_active,
  title_de, title_es, title_fr, title_zh,
  description_de, description_es, description_fr, description_zh,
  short_description_de, short_description_es, short_description_fr, short_description_zh,
  slug_de, slug_es, slug_fr, slug_zh,
  created_at, updated_at
) VALUES (
  'Safari & Strand Tansania - Das Beste aus zwei Welten',
  'safari-strand-kombi-tansania',
  'Kombinieren Sie eine spannende Safari in der Serengeti mit entspannten Tagen am Strand von Sansibar. Erleben Sie die große Tierwanderung und lassen Sie sich dann am Indischen Ozean verwöhnen.',
  'Safari und Strandurlaub kombiniert',
  'combined', 10, 'moderate', 4200, 4200, 4500, 'EUR', 'EUR', 'USD',
  6,
  ARRAY['Serengeti Safari', 'Ngorongoro Krater', 'Sansibar Strand', 'Stone Town', 'Dhow Sonnenuntergang'],
  ARRAY['4x4 Safari-Fahrzeug', 'Inlandsflug Sansibar', 'Vollpension Safari', 'Halbpension Strand', 'Alle Transfers'],
  ARRAY['Internationale Flüge', 'Reiseversicherung', 'Trinkgelder', 'Visum'],
  true, true,
  'Safari & Strand Tansania - Das Beste aus zwei Welten', 'Safari y Playa Tanzania - Lo mejor de dos mundos', 'Safari et Plage Tanzanie - Le meilleur des deux mondes', '坦桑尼亚Safari和海滩 - 两全其美',
  'Kombinieren Sie Safari und Strandurlaub.', 'Combine safari y playa.', 'Combinez safari et plage.', '结合Safari和海滩度假。',
  'Safari und Strandurlaub kombiniert', 'Safari y playa combinados', 'Safari et plage combinés', 'Safari和海滩结合',
  'safari-strand-kombi-tansania', 'safari-playa-tanzania', 'safari-plage-tanzanie', 'tansaniya-safari-haitan',
  NOW(), NOW()
);

-- ============================================
-- TOUR IMAGES
-- ============================================

-- Serengeti Safari Images
INSERT INTO tour_images (tour_id, url, alt_text, is_cover, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', 'Serengeti Tierwanderung', true, 0),
(1, 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', 'Elefanten in der Serengeti', false, 1),
(1, 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=800', 'Löwe in der Savanne', false, 2),
(1, 'https://images.unsplash.com/photo-1549366021-9f761d040c34?w=800', 'Gnu Migration', false, 3);

-- Kilimanjaro Images
INSERT INTO tour_images (tour_id, url, alt_text, is_cover, display_order) VALUES
(2, 'https://images.unsplash.com/photo-1596438027678-521d1d1bf999?w=800', 'Kilimanjaro Gipfel', true, 0),
(2, 'https://images.unsplash.com/photo-1605218457336-88e5d129d4e4?w=800', 'Bergsteiger am Kilimanjaro', false, 1),
(2, 'https://images.unsplash.com/photo-1520962889616-a568ae4badfc?w=800', 'Mawenzi Peak', false, 2),
(2, 'https://images.unsplash.com/photo-1575444753366-715e5b5a5631?w=800', 'Sonnenaufgang am Gipfel', false, 3);

-- Zanzibar Images
INSERT INTO tour_images (tour_id, url, alt_text, is_cover, display_order) VALUES
(3, 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800', 'Zanzibar Strand', true, 0),
(3, 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800', 'Überwasser-Bungalow', false, 1),
(3, 'https://images.unsplash.com/photo-1578450674326-715e5b5a5631?w=800', 'Stone Town', false, 2),
(3, 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800', 'Tauchen im Indischen Ozean', false, 3);

-- Tarangire & Ngorongoro Images
INSERT INTO tour_images (tour_id, url, alt_text, is_cover, display_order) VALUES
(4, 'https://images.unsplash.com/photo-1549366021-9f761d040c34?w=800', 'Elefanten Tarangire', true, 0),
(4, 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', 'Ngorongoro Krater', false, 1);

-- Safari & Strand Kombi Images
INSERT INTO tour_images (tour_id, url, alt_text, is_cover, display_order) VALUES
(5, 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', 'Safari Kombi', true, 0),
(5, 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800', 'Strand Kombi', false, 1);

-- ============================================
-- ITINERARIES
-- ============================================

-- Serengeti Safari Itinerary (Tour ID 1)
INSERT INTO itinerary (tour_id, day_number, title, description, accommodation, meals,
  title_de, title_es, title_fr, title_zh,
  description_de, description_es, description_fr, description_zh) VALUES
(1, 1, 'Abfahrt von Arusha', 'Morgens Abfahrt von Arusha zum Tarangire Nationalpark. Nachmittags Tierbeobachtung.', 'Tarangire Lodge', 'Mittagessen, Abendessen',
  'Salida de Arusha', 'Départ d''Arusha', '从阿鲁沙出发',
  'Morgens Abfahrt von Arusha zum Tarangire Nationalpark. Nachmittags Tierbeobachtung.',
  'Salida matutina de Arusha hacia el Parque Nacional Tarangire. Observación de animales por la tarde.',
  'Départ matinal d''Arusha vers le Parc National de Tarangire. Observation des animaux l''après-midi.',
  '早上从阿鲁沙出发前往塔兰吉雷国家公园。下午观察动物。'),

(1, 2, 'Tarangire nach Ngorongoro', 'Morgens weitere Tierbeobachtung im Tarangire. Nachmittags Fahrt zum Ngorongoro Krater.', 'Ngorongoro Lodge', 'Frühstück, Mittagessen, Abendessen',
  'Tarangire a Ngorongoro', 'Tarangire vers Ngorongoro', '塔兰吉雷到恩戈罗恩戈罗',
  'Morgens weitere Tierbeobachtung im Tarangire. Nachmittags Fahrt zum Ngorongoro Krater.',
  'Más observación de animales por la mañana en Tarangire. Por la tarde traslado al cráter de Ngorongoro.',
  'Plus d''observation des animaux le matin à Tarangire. L''après-midi, transfert vers le cratère de Ngorongoro',
  '早上在塔兰吉雷进一步观察动物。下午前往恩戈罗恩戈罗火山口。'),

(1, 3, 'Ngorongoro Krater', 'Ganztägige Safari im Ngorongoro Krater. Tierbeobachtung am Kraterboden.', 'Ngorongoro Lodge', 'Frühstück, Mittagessen, Abendessen',
  'Cratera del Ngorongoro', 'Cratère du Ngorongoro', '恩戈罗恩戈罗火山口',
  'Ganztägige Safari im Ngorongoro Krater. Tierbeobachtung am Kraterboden.',
  'Safari de día completo en el cráter de Ngorongoro. Observación de animales en el fondo del cráter.',
  'Safari d''une journée entière dans le cratère de Ngorongoro. Observation des animaux au fond du cratère.',
  '全天在恩戈罗恩戈罗火山口进行Safari。观察火山口底部的动物。'),

(1, 4, 'Serengeti', 'Fahrt in die Serengeti. Nachmittags erste Tierbeobachtung.', 'Serengeti Camp', 'Frühstück, Mittagessen, Abendessen',
  'Serengeti', 'Serengeti', '塞伦盖蒂',
  'Fahrt in die Serengeti. Nachmittags erste Tierbeobachtung.',
  'Traslado a la Serengeti. Primera observación de animales por la tarde.',
  'Transfert vers la Serengeti. Première observation des animaux l''après-midi.',
  '前往塞伦盖蒂。下午首次观察动物。'),

(1, 5, 'Serengeti - Rückfahrt', 'Morgens letzte Tierbeobachtung. Rückfahrt nach Arusha.', '-', 'Frühstück, Mittagessen',
  'Serengeti - Regreso', 'Serengeti - Retour', '塞伦盖蒂 - 返回',
  'Morgens letzte Tierbeobachtung. Rückfahrt nach Arusha.',
  'Última observación de animales por la mañana. Regreso a Arusha.',
  'Dernière observation des animaux le matin. Retour à Arusha.',
  '早上最后一次动物观察。返回阿鲁沙。');

-- Kilimanjaro Itinerary (Tour ID 2) - Marangu Route
INSERT INTO itinerary (tour_id, day_number, title, description, accommodation, meals,
  title_de, title_es, title_fr, title_zh,
  description_de, description_es, description_fr, description_zh) VALUES
(2, 1, 'Moshi - Marangu Gate', 'Ankunft in Moshi. Fahrt zum Marangu Gate. Wanderung bis Mandara Hütte.', 'Mandara Hütte', 'Mittagessen, Abendessen',
  'Moshi - Marangu Tor', 'Moshi - Porte Marangu', '莫希 - 马兰古门',
  'Ankunft in Moshi. Fahrt zum Marangu Gate. Wanderung bis Mandara Hütte.',
  'Llegada a Moshi. Traslado al puerta Marangu. Caminata hasta el refugio Mandara.',
  'Arrivée à Moshi. Transfert à la porte de Marangu. Randonnée jusqu''au refuge Mandara.',
  '抵达莫希。前往马兰古门。步行至曼达拉小屋。'),

(2, 2, 'Mandara - Horombo', 'Wanderung von Mandara nach Horombo durch den Regenwald.', 'Horombo Hütte', 'Frühstück, Mittagessen, Abendessen',
  'Mandara - Horombo', 'Mandara - Horombo', '曼达拉 - 霍隆博',
  'Wanderung von Mandara nach Horombo durch den Regenwald.',
  'Caminata de Mandara a Horombo a través del bosque tropical.',
  'Randonnée de Mandara à Horombo à travers la forêt tropicale.',
  '穿越热带雨林从曼达拉步行至霍隆博。'),

(2, 3, 'Horombo Akklimatisierung', 'Akklimatisierungstag auf 3.700m. Wanderung zum Zebra Felsen.', 'Horombo Hütte', 'Frühstück, Mittagessen, Abendessen',
  'Aclimatización Horombo', 'Acclimatisation Horombo', '霍隆博适应',
  'Akklimatisierungstag auf 3.700m. Wanderung zum Zebra Felsen.',
  'Día de aclimatización a 3.700m. Caminata hasta la Roca Cebra.',
  'Jour d''acclimatisation à 3.700m. Randonnée jusqu''au rocher Zébre.',
  '在3700米处适应一天。步行至斑马岩。'),

(2, 4, 'Horombo - Kibo', 'Wanderung zur Kibo Hütte am Fuße des Gipfels.', 'Kibo Hütte', 'Frühstück, Mittagessen, Abendessen',
  'Horombo - Kibo', 'Horombo - Kibo', '霍隆博 - 基博',
  'Wanderung zur Kibo Hütte am Fuße des Gipfels.',
  'Caminata al refugio Kibo al pie de la cumbre.',
  'Randonnée au refuge Kibo au pied du sommet.',
  '步行至峰顶脚下的基博小屋。'),

(2, 5, 'Gipfeltag - Uhuru Peak', 'Mitternachtlicher Aufstieg zum Gipfel. Sonnenaufgang am Uhuru Peak.', 'Kibo Hütte', 'Frühstück, Mittagessen, Abendessen',
  'Día de cumbre - Uhuru Peak', 'Jour de sommet - Uhuru Peak', '峰顶日 - 乌胡鲁峰',
  'Mitternachtlicher Aufstieg zum Gipfel. Sonnenaufgang am Uhuru Peak.',
  'Ascenso nocturn al cumbre. Amanecer en el Uhuru Peak.',
  'Ascension nocturne vers le sommet. Lever du soleil au Uhuru Peak.',
  '午夜攀登至峰顶。乌胡鲁峰日出。'),

(2, 6, 'Kibo - Moshi', 'Abstieg nach Horombo und weiter nach Moshi. Feiern des Erfolgs.', '-', 'Frühstück, Mittagessen',
  'Kibo - Moshi', 'Kibo - Moshi', '基博 - 莫希',
  'Abstieg nach Horombo und weiter nach Moshi. Feiern des Erfolgs.',
  'Descenso a Horombo y luego a Moshi. Celebración del éxito.',
  'Descente vers Horombo puis vers Moshi. Célébration du succès.',
  '下降到霍隆博，然后前往莫希。庆祝成功。');

-- Zanzibar Itinerary (Tour ID 3)
INSERT INTO itinerary (tour_id, day_number, title, description, accommodation, meals,
  title_de, title_es, title_fr, title_zh,
  description_de, description_es, description_fr, description_zh) VALUES
(3, 1, 'Ankunft Sansibar', 'Ankunft am Flughafen Sansibar. Transfer zum Resort.', 'Strand Resort', 'Abendessen',
  'Llegada Zanzíbar', 'Arrivée Zanzibar', '抵达桑给巴尔',
  'Ankunft am Flughafen Sansibar. Transfer zum Resort.',
  'Llegada al aeropuerto de Zanzíbar. Traslado al resort.',
  'Arrivée à l''aéroport de Zanzibar. Transfert au complexe.',
  '抵达桑给巴尔机场。转机至度假村。'),

(3, 2, 'Stone Town & Gewürz-Tour', 'Besichtigung der historischen Stone Town. Gewürz-Tour.', 'Strand Resort', 'Frühstück, Abendessen',
  'Stone Town y Tour de especias', 'Stone Town et visite des épices', '石头城和香料之旅',
  'Besichtigung der historischen Stone Town. Gewürz-Tour.',
  'Visita a la histórica Stone Town. Tour de especias.',
  'Visite de la Stone Town historique. Visite des épices.',
  '参观历史悠久的石头城。香料之旅。'),

(3, 3, 'Strandtag', 'Tag zur freien Verfügung. Baden, Schnorcheln, Entspannen.', 'Strand Resort', 'Frühstück, Abendessen',
  'Día de playa', 'Jour à la plage', '海滩日',
  'Tag zur freien Verfügung. Baden, Schnorcheln, Entspannen.',
  'Día libre. Baño, snorkeling, relax.',
  'Jour libre. Bain, plongée en apnée, détente.',
  '自由时间。游泳、浮潜、放松。'),

(3, 4, 'Dhow Sonnenuntergang', 'Bootstour bei Sonnenuntergang auf traditioneller Dhow.', 'Strand Resort', 'Frühstück, Abendessen',
  'Atardecer en Dhow', 'Coucher de soleil en Dhow', '多哈日落',
  'Bootstour bei Sonnenuntergang auf traditioneller Dhow.',
  'Paseo en barco al atardecer en Dhow tradicional.',
  'Balade en bateau au coucher du soleil en Dhow traditionnel.',
  '乘坐传统多哈船在日落时进行船游。'),

(3, 5, 'Freier Tag', 'Letzter Tag zur Entspannung am Strand.', 'Strand Resort', 'Frühstück, Abendessen',
  'Día libre', 'Jour libre', '自由日',
  'Letzter Tag zur Entspannung am Strand.',
  'Último día para relajarse en la playa.',
  'Dernier jour pour se détendre à la plage.',
  '最后一天在海滩放松。'),

(3, 6, 'Abreise', 'Transfer zum Flughafen. Abreise.', '-', 'Frühstück',
  'Salida', 'Départ', '出发',
  'Transfer zum Flughafen. Abreise.',
  'Traslado al aeropuerto. Salida.',
  'Transfert à l''aéroport. Départ.',
  '前往机场。离开。');

-- ============================================
-- BLOG POSTS
-- ============================================

-- Blog Post 1: Beste Reisezeit
INSERT INTO blog_posts (
  slug, title, content, excerpt, featured_image, author, is_published,
  title_de, title_es, title_fr, title_zh,
  content_de, content_es, content_fr, content_zh,
  excerpt_de, excerpt_es, excerpt_fr, excerpt_zh,
  slug_de, slug_es, slug_fr, slug_zh,
  created_at, updated_at
) VALUES (
  'beste-reisezeit-safari-tansania',
  'Die beste Reisezeit für Ihre Safari in Tansania',
  'Die beste Zeit für eine Safari in Tansania hängt von Ihren Prioritäten ab. Die Trockenzeit von Juni bis Oktober bietet beste Tierbeobachtungen, während die Regenzeit von November bis Mai für Vogelbeobachtung und günstigere Preise ideal ist.',
  'Alles was Sie über die beste Reisezeit für Safari in Tansania wissen müssen.',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
  'GeTaToS Team', true,
  'La mejor época para su safari en Tanzania', 'La meilleure période pour votre safari en Tanzanie', '坦桑尼亚Safari最佳旅行时间',
  'Die Trockenzeit von Juni bis Oktober ist die beliebteste Zeit für Safari.',
  'La temporada seca de junio a octubre es la época más popular para el safari.',
  'La saison sèche de juin à octobre est la période la plus populaire pour le safari.',
  '6月至10月的旱季是Safari最受欢迎的时期。',
  'Die beste Zeit für Safari in Tansania',
  'La mejor época para safari en Tanzania',
  'La meilleure période pour le safari en Tanzanie',
  '坦桑尼亚Safari的最佳时间',
  'beste-reisezeit-safari-tansania', 'mejor-epoca-safari-tanzania', 'meilleure-periode-safari-tanzanie', 'tansaniya-safari-zuijia-shijian',
  NOW(), NOW()
);

-- Blog Post 2: Was Sie erwartet
INSERT INTO blog_posts (
  slug, title, content, excerpt, featured_image, author, is_published,
  title_de, title_es, title_fr, title_zh,
  content_de, content_es, content_fr, content_zh,
  excerpt_de, excerpt_es, excerpt_fr, excerpt_zh,
  slug_de, slug_es, slug_fr, slug_zh,
  created_at, updated_at
) VALUES (
  'was-erwartet-safari-tansania',
  'Was Sie auf Ihrer Safari in Tansania erwartet',
  'Eine Safari in Tansania ist ein unvergessliches Erlebnis. Von der großen Tierwanderung in der Serengeti bis zu den majestätischen Elefantenherden im Tarangire - erwarten Sie atemberaubende Naturerlebnisse.',
  'Entdecken Sie, was Sie auf einer Safari in Tansania erwartet.',
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
  'GeTaToS Team', true,
  'Qué esperar de su safari en Tanzania', 'Ce qui vous attend lors de votre safari en Tanzanie', '坦桑尼亚Safari期待什么',
  'Jeder Tag Ihrer Safari bringt neue aufregende Entdeckungen.',
  'Cada día de safari trae nuevas emocionantes descubrimientos.',
  'Chaque jour de safari apporte de nouvelles découvertes exciting.',
  'Safari的每一天都会带来新的激动人心的发现。',
  'Was Sie auf Safari erwartet',
  'Qué esperar en safari',
  'Ce qu''attend safari',
  'Safari期待什么',
  'was-erwartet-safari-tansania', 'que-esperar-safari-tanzania', 'attendre-safari-tanzanie', 'tansaniya-safari-qidai-shenme',
  NOW(), NOW()
);

-- Blog Post 3: Kilimanjaro Vorbereitung
INSERT INTO blog_posts (
  slug, title, content, excerpt, featured_image, author, is_published,
  title_de, title_es, title_fr, title_zh,
  content_de, content_es, content_fr, content_zh,
  excerpt_de, excerpt_es, excerpt_fr, excerpt_zh,
  slug_de, slug_es, slug_fr, slug_zh,
  created_at, updated_at
) VALUES (
  'kilimanjaro-vorbereitung-tipps',
  'Kilimanjaro Besteigung: Tipps zur Vorbereitung',
  'Die Besteigung des Kilimanjaro ist ein unvergessliches Abenteuer. Mit der richtigen Vorbereitung kann jeder den Gipfel erreichen. Hier sind unsere Expertentipps für eine erfolgreiche Besteigung.',
  'Wichtige Tipps für Ihre Kilimanjaro Besteigung.',
  'https://images.unsplash.com/photo-1596438027678-521d1d1bf999?w=800',
  'GeTaToS Team', true,
  'Ascensión al Kilimanjaro: Consejos de preparación', 'Ascension au Kilimanjaro: Conseils de préparation', '乞力马扎罗登山：准备技巧',
  'Eine gute Akklimatisierung ist der Schlüssel zum Erfolg.',
  'Una buena aclimatación es la clave del éxito.',
  'Une bonne acclimatation est la clé du succès.',
  '良好的适应是成功的关键。',
  'Kilimanjaro Vorbereitung',
  'Preparación Kilimanjaro',
  'Préparation Kilimanjaro',
  '乞力马扎罗准备',
  'kilimanjaro-vorbereitung-tipps', 'preparacion-kilimanjaro', 'preparation-kilimanjaro', 'qilimajialuo-zhunbei-jiqiao',
  NOW(), NOW()
);

-- Blog Post 4: Sansibar Guide
INSERT INTO blog_posts (
  slug, title, content, excerpt, featured_image, author, is_published,
  title_de, title_es, title_fr, title_zh,
  content_de, content_es, content_fr, content_zh,
  excerpt_de, excerpt_es, excerpt_fr, excerpt_zh,
  slug_de, slug_es, slug_fr, slug_zh,
  created_at, updated_at
) VALUES (
  'sansibar-urlaub-guide',
  'Sansibar: Ihr ultimativer Guide zum Strandparadies',
  'Sansibar ist mehr als nur ein Strandziel. Die Insel bietet eine einzigartige Kombination aus weißem Sand, kristallklarem Wasser, reicher Geschichte und köstlicher Küche.',
  'Entdecken Sie alles was Sansibar zu bieten hat.',
  'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800',
  'GeTaToS Team', true,
  'Zanzibar: Tu guía definitiva para el paraíso de playa', 'Zanzibar: Votre guide ultime du paradis plages', '桑给巴尔：海滩天堂终极指南',
  'Besuchen Sie unbedingt die historische Stone Town.',
  'No deje de visitar la histórica Stone Town.',
  'Ne manquez pas de visiter la Stone Town historique.',
  '一定要参观历史悠久的石头城。',
  'Sansibar Guide',
  'Guía Zanzibar',
  'Guide Zanzibar',
  '桑给巴尔指南',
  'sansibar-urlaub-guide', 'guia-zanzibar', 'guide-zanzibar', 'sangjibaer-zhinand',
  NOW(), NOW()
);

-- Blog Post 5: Big Five
INSERT INTO blog_posts (
  slug, title, content, excerpt, featured_image, author, is_published,
  title_de, title_es, title_fr, title_zh,
  content_de, content_es, content_fr, content_zh,
  excerpt_de, excerpt_es, excerpt_fr, excerpt_zh,
  slug_de, slug_es, slug_fr, slug_zh,
  created_at, updated_at
) VALUES (
  'big-five-safari-tansania',
  'Die Big Five: Die majestätischen Tiere Afrikas',
  'Löwe, Leopard, Elefant, Nashorn und Büffel - die Big Five sind die beeindruckendsten Tiere Afrikas. In Tansania haben Sie die beste Chance, alle fünf zu sehen.',
  'Alles über die Big Five und wo Sie sie in Tansania finden.',
  'https://images.unsplash.com/photo-1549366021-9f761d040c34?w=800',
  'GeTaToS Team', true,
  'Los Big Five: Los animales majestuosos de África', 'Le Big Five: Les animaux majestueux d''Afrique', '非洲五霸：雄伟的动物',
  'In Tansania haben Sie die beste Chance, alle fünf zu sehen.',
  'En Tanzania tiene la mejor oportunidad de ver los cinco.',
  'En Tanzanie, vous avez la meilleure chance de voir les cinq.',
  '在坦桑尼亚您有最好的机会看到全部五种。',
  'Die Big Five in Tansania',
  'Los Big Five en Tanzania',
  'Le Big Five en Tanzanie',
  '坦桑尼亚的五霸',
  'big-five-safari-tansania', 'big-five-tanzania', 'big-five-tanzanie', 'feizhou-wuba-tansaniya',
  NOW(), NOW()
);

-- ============================================
-- TESTIMONIALS
-- ============================================

INSERT INTO testimonials (tour_id, guest_name, guest_country, rating, comment, is_approved, is_featured, created_at) VALUES
(1, 'Hans Müller', 'Deutschland', 5, 'Eine unvergessliche Safari-Erfahrung! Das Team von GeTaToS war sehr professionell und hat uns eine wunderbare Zeit bereitet.', true, true, NOW()),
(2, 'Sarah Johnson', 'USA', 5, 'Der Kilimanjaro-Trip war phänomenal. Unsere Guides waren erfahren und unterstützend. Der Sonnenaufgang am Gipfel war unbeschreiblich!', true, true, NOW()),
(3, 'Marco Rossi', 'Italien', 5, 'Wunderschöne Strände und exzellenter Service in Sansibar. Wir kommen auf jeden Fall wieder!', true, true, NOW()),
(1, 'Thomas Schmidt', 'Österreich', 5, 'Die Serengeti Tierwanderung war ein Traum. Vielen Dank an das GeTaToS Team!', true, false, NOW()),
(2, 'Emma Wilson', 'Großbritannien', 5, 'Herausfordernde aber lohnende Erfahrung. Die Guides waren erstklassig!', true, false, NOW());

-- ============================================
-- FAQS
-- ============================================

INSERT INTO faqs (question, answer, category, display_order, is_active, language) VALUES
('Wann ist die beste Zeit für eine Safari?', 'Die beste Zeit für eine Safari in Tansania ist während der Trockenzeit von Juni bis Oktober. In dieser Zeit sind die Tiere leicht an Wasserstellen zu finden.', 'safari', 1, true, 'de'),
('Wie anstrengend ist die Kilimanjaro Besteigung?', 'Der Kilimanjaro ist für alle Fitnesslevel geeignet. Der Aufstieg ist nicht technisch, aber die Höhe macht es herausfordernd. Eine gute Akklimatisierung ist wichtig.', 'kilimanjaro', 2, true, 'de'),
('Welche Impfungen werden benötigt?', 'Für Tansania werden Gelbfieber-Impfung (bei Einreise aus Risikogebieten), Malaria-Prophylaxe und Standardimpfungen empfohlen. Konsultieren Sie Ihren Arzt.', 'allgemein', 3, true, 'de'),
('Was sollte ich für die Safari einpacken?', 'Wir empfehlen: bequeme Kleidung in Erdtönen, Fernglas, Sonnencreme, Hut, Kamera mit Teleobjektiv und leichte Regenjacke.', 'safari', 4, true, 'de'),
('Gibt es WLAN auf den Lodges?', 'Die meisten Lodges bieten WLAN, aber die Verbindung kann in abgelegenen Gebieten langsam sein. Genießen Sie die Natur und nutzen Sie die Zeit offline.', 'allgemein', 5, true, 'de');

-- ============================================================================
-- ENDE
-- ============================================================================
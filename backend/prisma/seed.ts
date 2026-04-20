import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Translations
  const translations = [
    // English
    { languageCode: 'en', pageKey: 'nav', key: 'home', value: 'Home' },
    { languageCode: 'en', pageKey: 'nav', key: 'about', value: 'About Us' },
    { languageCode: 'en', pageKey: 'nav', key: 'tours', value: 'Tours' },
    { languageCode: 'en', pageKey: 'nav', key: 'blog', value: 'Blog' },
    { languageCode: 'en', pageKey: 'nav', key: 'contact', value: 'Contact' },
    { languageCode: 'en', pageKey: 'home.hero', key: 'title', value: 'Discover the Magic of Tanzania' },
    { languageCode: 'en', pageKey: 'home.hero', key: 'subtitle', value: 'Unforgettable safari experiences, Kilimanjaro climbs, and Zanzibar beaches' },
    { languageCode: 'en', pageKey: 'home.hero', key: 'cta', value: 'Explore Tours' },
    { languageCode: 'en', pageKey: 'home.hero', key: 'cta2', value: 'Learn More' },
    { languageCode: 'en', pageKey: 'home.hero', key: 'years', value: '37+ Years Experience' },
    { languageCode: 'en', pageKey: 'home.stats', key: 'experience', value: 'Years Experience' },
    { languageCode: 'en', pageKey: 'home.stats', key: 'guests', value: 'Happy Guests' },
    { languageCode: 'en', pageKey: 'home.stats', key: 'tours', value: 'Safari Tours' },
    { languageCode: 'en', pageKey: 'home.stats', key: 'recommendation', value: 'Recommendation' },
    { languageCode: 'en', pageKey: 'home', key: 'featured', value: 'Featured Tours' },
    { languageCode: 'en', pageKey: 'home', key: 'why_choose', value: 'Why Choose Us' },
    { languageCode: 'en', pageKey: 'home.tours', key: 'days', value: 'days' },
    { languageCode: 'en', pageKey: 'home.tours', key: 'stops', value: 'stops' },
    { languageCode: 'en', pageKey: 'home.tours', key: 'from', value: 'From' },
    { languageCode: 'en', pageKey: 'home.tours', key: 'perPerson', value: 'per person' },
    { languageCode: 'en', pageKey: 'home.tours', key: 'bestseller', value: 'Bestseller' },
    { languageCode: 'en', pageKey: 'home', key: 'testimonials', value: 'What Our Guests Say' },
    { languageCode: 'en', pageKey: 'home.cta', key: 'title', value: 'Ready for Your Safari Adventure?' },
    { languageCode: 'en', pageKey: 'home.cta', key: 'subtitle', value: 'Contact us today for a free consultation' },
    { languageCode: 'en', pageKey: 'home.cta', key: 'button', value: 'Contact Us Now' },
    { languageCode: 'en', pageKey: 'home.newsletter', key: 'title', value: 'Newsletter' },
    { languageCode: 'en', pageKey: 'home.newsletter', key: 'text', value: 'Subscribe for exclusive offers' },
    { languageCode: 'en', pageKey: 'tours', key: 'title', value: 'Our Tours' },
    { languageCode: 'en', pageKey: 'tours', key: 'search', value: 'Search tours...' },
    { languageCode: 'en', pageKey: 'tours', key: 'all', value: 'All Tours' },
    { languageCode: 'en', pageKey: 'tours', key: 'safari', value: 'Safari' },
    { languageCode: 'en', pageKey: 'tours', key: 'kilimanjaro', value: 'Kilimanjaro' },
    { languageCode: 'en', pageKey: 'tours', key: 'beach', value: 'Beach' },
    { languageCode: 'en', pageKey: 'tours', key: 'combined', value: 'Combined' },
    { languageCode: 'en', pageKey: 'tours', key: 'days', value: 'days' },
    { languageCode: 'en', pageKey: 'tours', key: 'from', value: 'from' },
    { languageCode: 'en', pageKey: 'tours', key: 'view', value: 'View Details' },
    { languageCode: 'en', pageKey: 'tours', key: 'book', value: 'Book Now' },
    { languageCode: 'en', pageKey: 'blog', key: 'title', value: 'Blog' },
    { languageCode: 'en', pageKey: 'blog', key: 'read_more', value: 'Read More' },
    { languageCode: 'en', pageKey: 'blog', key: 'no_posts', value: 'No posts yet' },
    { languageCode: 'en', pageKey: 'blog', key: 'search', value: 'Search articles...' },
    { languageCode: 'en', pageKey: 'contact', key: 'title', value: 'Contact Us' },
    { languageCode: 'en', pageKey: 'contact', key: 'name', value: 'Name' },
    { languageCode: 'en', pageKey: 'contact', key: 'email', value: 'Email' },
    { languageCode: 'en', pageKey: 'contact', key: 'subject', value: 'Subject' },
    { languageCode: 'en', pageKey: 'contact', key: 'message', value: 'Message' },
    { languageCode: 'en', pageKey: 'contact', key: 'send', value: 'Send Message' },
    { languageCode: 'en', pageKey: 'contact', key: 'success', value: 'Message Sent!' },
    { languageCode: 'en', pageKey: 'footer', key: 'quick_links', value: 'Quick Links' },
    { languageCode: 'en', pageKey: 'footer', key: 'faq', value: 'FAQs' },
    { languageCode: 'en', pageKey: 'footer', key: 'terms', value: 'Terms & Conditions' },
    { languageCode: 'en', pageKey: 'footer', key: 'contact', value: 'Contact' },
    { languageCode: 'en', pageKey: 'footer', key: 'copyright', value: 'All rights reserved.' },
    { languageCode: 'en', pageKey: 'common', key: 'read_more', value: 'Read More' },
    { languageCode: 'en', pageKey: 'common', key: 'loading', value: 'Loading...' },
    // German
    { languageCode: 'de', pageKey: 'nav', key: 'home', value: 'Startseite' },
    { languageCode: 'de', pageKey: 'nav', key: 'about', value: 'Über uns' },
    { languageCode: 'de', pageKey: 'nav', key: 'tours', value: 'Touren' },
    { languageCode: 'de', pageKey: 'nav', key: 'blog', value: 'Blog' },
    { languageCode: 'de', pageKey: 'nav', key: 'contact', value: 'Kontakt' },
    { languageCode: 'de', pageKey: 'home.hero', key: 'title', value: 'Entdecken Sie den Zauber Tansanias' },
    { languageCode: 'de', pageKey: 'home.hero', key: 'subtitle', value: 'Unvergessliche Safari-Erlebnisse und Kilimanjaro' },
    { languageCode: 'de', pageKey: 'home.hero', key: 'cta', value: 'Touren entdecken' },
    { languageCode: 'de', pageKey: 'home.hero', key: 'cta2', value: 'Mehr erfahren' },
    { languageCode: 'de', pageKey: 'home.hero', key: 'years', value: 'Seit 37+ Jahren' },
    { languageCode: 'de', pageKey: 'home.stats', key: 'experience', value: 'Jahre Erfahrung' },
    { languageCode: 'de', pageKey: 'home.stats', key: 'guests', value: 'Zufriedene Gäste' },
    { languageCode: 'de', pageKey: 'home.stats', key: 'tours', value: 'Safari Touren' },
    { languageCode: 'de', pageKey: 'home.stats', key: 'recommendation', value: 'Weiterempfehlung' },
    { languageCode: 'de', pageKey: 'home', key: 'featured', value: 'Empfohlene Touren' },
    { languageCode: 'de', pageKey: 'home', key: 'why_choose', value: 'Warum wir' },
    { languageCode: 'de', pageKey: 'home.tours', key: 'days', value: 'Tage' },
    { languageCode: 'de', pageKey: 'home.tours', key: 'stops', value: 'Stops' },
    { languageCode: 'de', pageKey: 'home.tours', key: 'from', value: 'Ab' },
    { languageCode: 'de', pageKey: 'home.tours', key: 'perPerson', value: 'pro Person' },
    { languageCode: 'de', pageKey: 'home.tours', key: 'bestseller', value: 'Bestseller' },
    { languageCode: 'de', pageKey: 'home', key: 'testimonials', value: 'Was unsere Gäste sagen' },
    { languageCode: 'de', pageKey: 'home.cta', key: 'title', value: 'Bereit für Ihr Safari-Abenteuer?' },
    { languageCode: 'de', pageKey: 'home.cta', key: 'subtitle', value: 'Kontaktieren Sie uns noch heute für eine unverbindliche Beratung' },
    { languageCode: 'de', pageKey: 'home.cta', key: 'button', value: 'Jetzt kontaktieren' },
    { languageCode: 'de', pageKey: 'home.newsletter', key: 'title', value: 'Newsletter' },
    { languageCode: 'de', pageKey: 'home.newsletter', key: 'text', value: 'Jetzt abonnieren' },
    { languageCode: 'de', pageKey: 'tours', key: 'title', value: 'Unsere Touren' },
    { languageCode: 'de', pageKey: 'tours', key: 'search', value: 'Touren suchen...' },
    { languageCode: 'de', pageKey: 'tours', key: 'all', value: 'Alle Touren' },
    { languageCode: 'de', pageKey: 'tours', key: 'safari', value: 'Safari' },
    { languageCode: 'de', pageKey: 'tours', key: 'kilimanjaro', value: 'Kilimanjaro' },
    { languageCode: 'de', pageKey: 'tours', key: 'beach', value: 'Strand' },
    { languageCode: 'de', pageKey: 'tours', key: 'combined', value: 'Kombiniert' },
    { languageCode: 'de', pageKey: 'tours', key: 'days', value: 'Tage' },
    { languageCode: 'de', pageKey: 'tours', key: 'from', value: 'ab' },
    { languageCode: 'de', pageKey: 'tours', key: 'view', value: 'Details' },
    { languageCode: 'de', pageKey: 'tours', key: 'book', value: 'Buchen' },
    { languageCode: 'de', pageKey: 'blog', key: 'title', value: 'Blog' },
    { languageCode: 'de', pageKey: 'blog', key: 'read_more', value: 'Mehr' },
    { languageCode: 'de', pageKey: 'blog', key: 'no_posts', value: 'Noch keine Beiträge' },
    { languageCode: 'de', pageKey: 'blog', key: 'search', value: 'Artikel suchen...' },
    { languageCode: 'de', pageKey: 'contact', key: 'title', value: 'Kontakt' },
    { languageCode: 'de', pageKey: 'contact', key: 'name', value: 'Name' },
    { languageCode: 'de', pageKey: 'contact', key: 'email', value: 'E-Mail' },
    { languageCode: 'de', pageKey: 'contact', key: 'subject', value: 'Betreff' },
    { languageCode: 'de', pageKey: 'contact', key: 'message', value: 'Nachricht' },
    { languageCode: 'de', pageKey: 'contact', key: 'send', value: 'Senden' },
    { languageCode: 'de', pageKey: 'contact', key: 'success', value: 'Gesendet!' },
    { languageCode: 'de', pageKey: 'footer', key: 'quick_links', value: 'Links' },
    { languageCode: 'de', pageKey: 'footer', key: 'faq', value: 'FAQs' },
    { languageCode: 'de', pageKey: 'footer', key: 'terms', value: 'AGB' },
    { languageCode: 'de', pageKey: 'footer', key: 'contact', value: 'Kontakt' },
    { languageCode: 'de', pageKey: 'footer', key: 'copyright', value: 'Alle Rechte vorbehalten.' },
    { languageCode: 'de', pageKey: 'common', key: 'read_more', value: 'Mehr' },
    { languageCode: 'de', pageKey: 'common', key: 'loading', value: 'Laden...' },
    // Spanish
    { languageCode: 'es', pageKey: 'nav', key: 'home', value: 'Inicio' },
    { languageCode: 'es', pageKey: 'nav', key: 'about', value: 'Nosotros' },
    { languageCode: 'es', pageKey: 'nav', key: 'tours', value: 'Tours' },
    { languageCode: 'es', pageKey: 'nav', key: 'blog', value: 'Blog' },
    { languageCode: 'es', pageKey: 'nav', key: 'contact', value: 'Contacto' },
    { languageCode: 'es', pageKey: 'home.hero', key: 'title', value: 'Descubre Tanzania' },
    { languageCode: 'es', pageKey: 'home.hero', key: 'subtitle', value: 'Safari inolvidable y Kilimanjaro' },
    { languageCode: 'es', pageKey: 'home.hero', key: 'cta', value: 'Ver Tours' },
    { languageCode: 'es', pageKey: 'home.hero', key: 'cta2', value: 'Saber más' },
    { languageCode: 'es', pageKey: 'blog', key: 'title', value: 'Blog' },
    { languageCode: 'es', pageKey: 'blog', key: 'read_more', value: 'Más' },
    { languageCode: 'es', pageKey: 'footer', key: 'faq', value: 'FAQs' },
    { languageCode: 'es', pageKey: 'footer', key: 'terms', value: 'Términos' },
    // French
    { languageCode: 'fr', pageKey: 'nav', key: 'home', value: 'Accueil' },
    { languageCode: 'fr', pageKey: 'nav', key: 'about', value: 'À propos' },
    { languageCode: 'fr', pageKey: 'nav', key: 'tours', value: 'Tours' },
    { languageCode: 'fr', pageKey: 'nav', key: 'blog', value: 'Blog' },
    { languageCode: 'fr', pageKey: 'nav', key: 'contact', value: 'Contact' },
    { languageCode: 'fr', pageKey: 'home.hero', key: 'title', value: 'Découvrez la Tanzanie' },
    { languageCode: 'fr', pageKey: 'blog', key: 'title', value: 'Blog' },
    { languageCode: 'fr', pageKey: 'blog', key: 'read_more', value: 'Plus' },
    { languageCode: 'fr', pageKey: 'footer', key: 'faq', value: 'FAQs' },
    { languageCode: 'fr', pageKey: 'footer', key: 'terms', value: 'Conditions' },
    // Chinese
    { languageCode: 'zh', pageKey: 'nav', key: 'home', value: '首页' },
    { languageCode: 'zh', pageKey: 'nav', key: 'about', value: '关于' },
    { languageCode: 'zh', pageKey: 'nav', key: 'tours', value: '行程' },
    { languageCode: 'zh', pageKey: 'nav', key: 'blog', value: '博客' },
    { languageCode: 'zh', pageKey: 'nav', key: 'contact', value: '联系' },
    { languageCode: 'zh', pageKey: 'home.hero', key: 'title', value: '探索坦桑尼亚' },
    { languageCode: 'zh', pageKey: 'home.hero', key: 'subtitle', value: '难忘的Safari和乞力马扎罗' },
    { languageCode: 'zh', pageKey: 'blog', key: 'title', value: '博客' },
    { languageCode: 'zh', pageKey: 'blog', key: 'read_more', value: '更多' },
    { languageCode: 'zh', pageKey: 'footer', key: 'faq', value: '常见问题' },
    { languageCode: 'zh', pageKey: 'footer', key: 'terms', value: '条款' },
  ]

  for (const t of translations) {
    await prisma.translation.upsert({
      where: {
        languageCode_pageKey_key: {
          languageCode: t.languageCode,
          pageKey: t.pageKey,
          key: t.key
        }
      },
      update: {},
      create: t
    })
  }

  console.log(`✓ Created ${translations.length} translations`)

  // FAQs
  const faqs = [
    { question: 'Was ist die beste Zeit für eine Safari?', answer: 'Die beste Zeit für eine Safari in Tansania ist von Juni bis Oktober während der Trockenzeit. Die Tierbeobachtung ist dann am besten.', category: 'Travel', language: 'de', displayOrder: 1, isActive: true },
    { question: 'Benötige ich ein Visum für Tansania?', answer: 'Ja, die meisten Reisenden benötigen ein Visum. Dieses kann bei Einreise am Flughafen oder online vorab beantragt werden.', category: 'Visa', language: 'de', displayOrder: 2, isActive: true },
    { question: 'Welche Impfungen werden empfohlen?', answer: 'Empfohlen werden Impfungen gegen Gelbfieber (bei Einreise aus bestimmten Ländern), Hepatitis A/B, Typhus und Malariaprophylaxe.', category: 'Health', language: 'de', displayOrder: 3, isActive: true },
    { question: 'How long does it take to climb Kilimanjaro?', answer: 'Most climbs take 5-9 days depending on the route. The Machame route typically takes 6-7 days.', category: 'Travel', language: 'en', displayOrder: 1, isActive: true },
    { question: 'Do I need a visa for Tanzania?', answer: 'Most travelers need a visa. It can be obtained on arrival at the airport or applied for online in advance.', category: 'Visa', language: 'en', displayOrder: 2, isActive: true },
  ]

  for (const f of faqs) {
    await prisma.fAQ.create({ data: f })
  }

  console.log(`✓ Created ${faqs.length} FAQs`)

  // Site Settings
  const settings = [
    { settingKey: 'site_name', settingValue: 'Getatos Safari', settingType: 'text', category: 'general' },
    { settingKey: 'site_email', settingValue: 'info@getatos-safari.com', settingType: 'text', category: 'general' },
    { settingKey: 'site_phone', settingValue: '+255 789 123 456', settingType: 'text', category: 'general' },
    { settingKey: 'site_address', settingValue: 'Arusha, Tanzania', settingType: 'text', category: 'general' },
    { settingKey: 'currency', settingValue: 'USD', settingType: 'text', category: 'general' },
  ]

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { settingKey: s.settingKey },
      update: {},
      create: s
    })
  }

  console.log(`✓ Created ${settings.length} settings`)

  // Gallery Images
  const galleryImages = [
    { title: 'Elefanten in der Serengeti', description: 'Majestätische Elefantenherde', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', category: 'wildlife', displayOrder: 1, isActive: true, slug: 'elefanten-safari-a7f3b2' },
    { title: 'Kilimanjaro Sonnenaufgang', description: 'Der höchste Berg Afrikas', url: 'https://images.unsplash.com/photo-1596438027678-521d1d1bf999?w=800', category: 'landscape', displayOrder: 2, isActive: true, slug: 'kilimanjaro-sunrise-b2c3d4' },
    { title: 'Masai Krieger', description: 'Traditionelle Masai-Kultur', url: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800', category: 'people', displayOrder: 3, isActive: true, slug: 'masai-warrior-c3d4e5' },
    { title: 'Löwe bei der Jagd', description: 'Spannende Tierbeobachtung', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800', category: 'wildlife', displayOrder: 4, isActive: true, slug: 'lion-hunt-d4e5f6' },
    { title: 'Zanzibar Strand', description: 'Türkisfarbenes Wasser', url: 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800', category: 'landscape', displayOrder: 5, isActive: true, slug: 'zanzibar-beach-e5f6g7' },
  ]

  for (const g of galleryImages) {
    await prisma.galleryImage.upsert({
      where: { slug: g.slug },
      update: g,
      create: g
    })
  }

  console.log(`✓ Created ${galleryImages.length} gallery images`)

  // Tours with multi-language support
  const tours = [
    {
      title: 'Serengeti Safari',
      slug: 'serengeti-safari',
      titleDe: 'Serengeti Safari', titleEs: 'Safari Serengeti', titleFr: 'Safari Serengeti', titleZh: '塞伦盖蒂Safari',
      description: 'Erleben Sie die große Tierwanderung in der Serengeti',
      descriptionDe: 'Erleben Sie die große Tierwanderung in der Serengeti',
      descriptionEs: 'Experimente la Gran Migración en el Serengeti',
      descriptionFr: 'Vivez la Grande Migration au Serengeti',
      descriptionZh: '体验塞伦盖蒂的大迁徙',
      shortDescription: 'Die große Tierwanderung erleben',
      shortDescriptionDe: 'Die große Tierwanderung erleben',
      shortDescriptionEs: 'La Gran Migración',
      shortDescriptionFr: 'La Grande Migration',
      shortDescriptionZh: '塞伦盖蒂大迁徙',
      tourType: 'safari', durationDays: 5, difficulty: 'easy', price: 2500, maxGroupSize: 6,
      highlights: ['Big Five', 'Tierwanderung', 'Ngorongoro Krater', 'Masai Dorf'],
      included: ['Mahlzeiten', '4x4 Safari Fahrzeug', 'Professioneller Guide', 'Unterkunft'],
      notIncluded: ['Internationale Flüge', 'Reiseversicherung', 'Visum', 'Trinkgeld'],
      isFeatured: true, isActive: true,
      images: [{ url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', altText: 'Serengeti Safari', isCover: true, displayOrder: 1 }],
      itinerary: [
        { dayNumber: 1, title: 'Arrive in Arusha', description: 'Willkommen in Tansania! Transfer zum Hotel.', accommodation: 'Lake Duluti Lodge', meals: ' Dinner' },
        { dayNumber: 2, title: 'Tarangire National Park', description: 'Safari im Elefanten-Paradies.', accommodation: 'Tarangire Safari Lodge', meals: 'Breakfast, Lunch, Dinner' },
        { dayNumber: 3, title: 'Serengeti National Park', description: 'Auf dem Weg zur Serengeti.', accommodation: 'Serengeti Safari Camp', meals: 'Breakfast, Lunch, Dinner' },
        { dayNumber: 4, title: 'Serengeti & Ngorongoro', description: 'Ganztägige Safari.', accommodation: 'Ngorongoro Rhino Lodge', meals: 'Breakfast, Lunch, Dinner' },
        { dayNumber: 5, title: 'Ngorongoro Krater & Abreise', description: 'Frühmorgen Abstieg in den Krater.', accommodation: '', meals: 'Breakfast, Lunch' }
      ]
    },
    {
      title: 'Kilimanjaro Summit',
      slug: 'kilimanjaro-summit',
      titleDe: 'Kilimanjaro Gipfel', titleEs: 'Cumbre del Kilimanjaro', titleFr: 'Sommet du Kilimanjaro', titleZh: '乞力马扎罗登顶',
      description: 'Besteigen Sie den höchsten Berg Afrikas',
      descriptionDe: 'Besteigen Sie den höchsten Berg Afrikas',
      descriptionEs: 'Escala la montaña más alta de África',
      descriptionFr: 'Monte le plus haut d\'Afrique',
      descriptionZh: '攀登非洲最高峰',
      shortDescription: 'Der höchste Berg Afrikas',
      shortDescriptionDe: 'Der höchste Berg Afrikas',
      shortDescriptionEs: 'La montaña más alta de África',
      shortDescriptionFr: 'Le plus haut montagne d\'Afrique',
      shortDescriptionZh: '非洲最高峰',
      tourType: 'kilimanjaro', durationDays: 8, difficulty: 'challenging', price: 3500, maxGroupSize: 12,
      highlights: ['Uhuru Peak', 'Machame Route', 'Alpine Zone', 'Gletscher'],
      included: ['Mahlzeiten', 'Bergführer', 'Koch', 'Zelt', 'Höhenmesser'],
      notIncluded: ['Internationale Flüge', 'Visum', 'Höhenkrankheitsversicherung', 'Persönliche Ausrüstung'],
      isFeatured: true, isActive: true,
      images: [{ url: 'https://images.unsplash.com/photo-1596438027678-521d1d1bf999?w=800', altText: 'Kilimanjaro Summit', isCover: true, displayOrder: 1 }],
      itinerary: [
        { dayNumber: 1, title: 'Machame Gate to Machame Camp', description: 'Start der Besteigung durch den Regenwald.', accommodation: 'Machame Camp', meals: 'Breakfast, Lunch, Dinner' },
        { dayNumber: 2, title: 'Machame Camp to Shira Cave', description: 'Aufstieg in die Heideland-Zone.', accommodation: 'Shira Cave Camp', meals: 'Breakfast, Lunch, Dinner' },
        { dayNumber: 3, title: 'Shira Cave to Barranco Camp', description: 'Akademisierungstag mit Blick auf den Wall.', accommodation: 'Barranco Camp', meals: 'Breakfast, Lunch, Dinner' },
        { dayNumber: 4, title: 'Barranco Camp to Karanga', description: 'Über den Barranco Wall.', accommodation: 'Karanga Camp', meals: 'Breakfast, Lunch, Dinner' },
        { dayNumber: 5, title: 'Karanga to Barafu', description: 'Aufstieg zum Basislager.', accommodation: 'Barafu Camp', meals: 'Breakfast, Lunch, Dinner' },
        { dayNumber: 6, title: 'Summit Day', description: 'Mitternächtlicher Aufstieg zum Uhuru Peak.', accommodation: 'Mweka Camp', meals: 'Breakfast, Lunch, Dinner' },
        { dayNumber: 7, title: 'Mweka Camp to Mweka Gate', description: 'Abstieg durch den Regenwald.', accommodation: 'Mweka Camp', meals: 'Breakfast, Lunch, Dinner' },
        { dayNumber: 8, title: 'Abreise', description: 'Transfer zum Flughafen.', accommodation: '', meals: 'Breakfast' }
      ]
    },
    {
      title: 'Zanzibar Paradise',
      slug: 'zanzibar-paradise',
      titleDe: 'Paradies Zanzibar', titleEs: 'Paraíso Zanzíbar', titleFr: 'Paradis Zanzibar', titleZh: '桑给巴尔天堂',
      description: 'Entspannen Sie an weißen Sandstränden',
      descriptionDe: 'Entspannen Sie an weißen Sandstränden',
      descriptionEs: 'Relájate en las playas de arena blanca',
      descriptionFr: 'Détendez-vous sur les plages de sable blanc',
      descriptionZh: '在白色沙滩上放松身心',
      shortDescription: 'Paradiesische Strände',
      shortDescriptionDe: 'Paradiesische Strände',
      shortDescriptionEs: 'Playas del paraíso',
      shortDescriptionFr: 'Plages de paradis',
      shortDescriptionZh: '人间天堂',
      tourType: 'beach', durationDays: 6, difficulty: 'easy', price: 1800, maxGroupSize: 10,
      highlights: ['Weiße Sandstrände', 'Tauchen', 'Stone Town', 'Gewürz-Tour'],
      included: ['Mahlzeiten', 'Flughafen-Transfer', 'Strand-Resort', 'Schnorchel-Ausrüstung'],
      notIncluded: ['Internationale Flüge', 'Tauchschein', 'Alkoholische Getränke', 'Persönliche Ausgaben'],
      isFeatured: true, isActive: true,
      images: [{ url: 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800', altText: 'Zanzibar Beach', isCover: true, displayOrder: 1 }],
      itinerary: [
        { dayNumber: 1, title: 'Ankunft in Zanzibar', description: 'Transfer zum Resort.', accommodation: 'Nungwi Beach Resort', meals: 'Dinner' },
        { dayNumber: 2, title: 'Freizeit am Strand', description: 'Entspannen oder schnorcheln.', accommodation: 'Nungwi Beach Resort', meals: 'Breakfast, Dinner' },
        { dayNumber: 3, title: 'Stone Town Tour', description: 'Besichtigung der Altstadt.', accommodation: 'Nungwi Beach Resort', meals: 'Breakfast, Dinner' },
        { dayNumber: 4, title: 'Spice Tour', description: 'Gewürz-Plantage Besuch.', accommodation: 'Nungwi Beach Resort', meals: 'Breakfast, Dinner' },
        { dayNumber: 5, title: 'Freizeit', description: 'Optional: Tauchen oder Spa.', accommodation: 'Nungwi Beach Resort', meals: 'Breakfast, Dinner' },
        { dayNumber: 6, title: 'Abreise', description: 'Transfer zum Flughafen.', accommodation: '', meals: 'Breakfast' }
      ]
    }
  ]

  for (const tour of tours) {
    const { images, itinerary, ...tourData } = tour
    const createdTour = await prisma.tour.upsert({
      where: { slug: tourData.slug },
      update: tourData,
      create: tourData
    })
    
    // Create images (delete existing first)
    await prisma.tourImage.deleteMany({ where: { tourId: createdTour.id } })
    for (const img of images) {
      await prisma.tourImage.create({ data: { ...img, tourId: createdTour.id } })
    }
    
    // Create itinerary (delete existing first)
    await prisma.itinerary.deleteMany({ where: { tourId: createdTour.id } })
    for (const it of itinerary) {
      await prisma.itinerary.create({ data: { ...it, tourId: createdTour.id } })
    }
  }

  console.log(`✓ Created ${tours.length} tours with images and itinerary`)

  // ============ SITE SETTINGS ============
  const siteSettings = [
    // General settings
    { settingKey: 'site_title', settingValue: 'GeTaToS Safari - Ihre Safari Experten', settingType: 'string', category: 'general' },
    { settingKey: 'site_subtitle', settingValue: 'Unvergessliche Safari-Erlebnisse in Tansania', settingType: 'string', category: 'general' },
    { settingKey: 'default_language', settingValue: 'de', settingType: 'string', category: 'general' },
    { settingKey: 'currency', settingValue: 'EUR', settingType: 'string', category: 'general' },
    { settingKey: 'timezone', settingValue: 'Africa/Dar_es_Salaam', settingType: 'string', category: 'general' },
    { settingKey: 'booking_enabled', settingValue: 'true', settingType: 'boolean', category: 'general' },
    // Analytics
    { settingKey: 'ga4_id', settingValue: '', settingType: 'string', category: 'analytics' },
    { settingKey: 'gtm_id', settingValue: '', settingType: 'string', category: 'analytics' },
    { settingKey: 'gdpr_cookie_banner', settingValue: 'false', settingType: 'boolean', category: 'analytics' },
    // API Keys (empty)
    { settingKey: 'google_maps_key', settingValue: '', settingType: 'string', category: 'api' },
    { settingKey: 'whatsapp_business_api', settingValue: '', settingType: 'string', category: 'api' },
    { settingKey: 'mailchimp_api_key', settingValue: '', settingType: 'string', category: 'api' },
    { settingKey: 'sendgrid_api_key', settingValue: '', settingType: 'string', category: 'api' },
    { settingKey: 'cloudinary_name', settingValue: '', settingType: 'string', category: 'api' },
  ]

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { settingKey: setting.settingKey },
      update: setting,
      create: setting
    })
  }

  console.log(`✓ Created ${siteSettings.length} site settings`)

  // ============ COMPANY INFO ============
  const companyInfo = [
    { key: 'company_name', value: 'GeTaToS Safari Ltd.' },
    { key: 'ceo', value: 'Thomas D. Wald' },
    { key: 'address', value: 'Mikocheni Road\nP.O. Box 1234\nDar es Salaam, Tansania' },
    { key: 'phone', value: '+255 712 345 678' },
    { key: 'email', value: 'info@getatos-safari.com' },
    { key: 'website', value: 'https://getatos-safari.com' },
    { key: 'tax_id', value: 'TIN: 123-456-789' },
    { key: 'reg_no', value: 'REG. NO. 98765' },
    { key: 'bank', value: 'Bank: CRDB Bank\nKonto: 0123456789\nSWIFT: CORUTZ TZ' },
    { key: 'hours', value: 'Mo-Fr: 08:00 - 18:00\nSa: 09:00 - 14:00' },
  ]

  for (const info of companyInfo) {
    await prisma.companyInfo.upsert({
      where: { key: info.key },
      update: info,
      create: info
    })
  }

  console.log(`✓ Created ${companyInfo.length} company info`)

  // ============ SOCIAL MEDIA ============
  const socialMedia = [
    { platform: 'facebook', username: 'getatos', url: 'https://facebook.com/getatos', displayOrder: 1, isActive: true },
    { platform: 'instagram', username: 'getatos', url: 'https://instagram.com/getatos', displayOrder: 2, isActive: true },
    { platform: 'whatsapp', username: '255712345678', url: 'https://wa.me/255712345678', displayOrder: 3, isActive: true },
    { platform: 'youtube', username: '', url: '', displayOrder: 4, isActive: false },
  ]

  for (const social of socialMedia) {
    await prisma.socialMedia.upsert({
      where: { id: social.displayOrder },
      update: social,
      create: social
    })
  }

  console.log(`✓ Created ${socialMedia.length} social media links`)

  console.log('\n✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

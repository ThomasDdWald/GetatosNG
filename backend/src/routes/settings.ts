import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../index.js'

const router = Router()

// JWT Secret - use same as admin.ts
const JWT_SECRET = process.env.JWT_SECRET
const effectiveJwtSecret = JWT_SECRET || 'dev-only-secret-do-not-use-in-production'

// Middleware to check admin auth
const authenticateAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }
  const token = authHeader.replace('Bearer ', '')
  try {
    jwt.verify(token, effectiveJwtSecret)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}


// In-memory storage for FAQs
let faqs = [
  {
    id: 1,
    question: 'What is the best time to visit Tanzania?',
    answer: 'The best time for safari in Tanzania is from June to October during the dry season. For the Great Migration, December to March is ideal.',
    category: 'Travel',
    displayOrder: 1,
    isActive: true,
    language: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    question: 'Do I need a visa for Tanzania?',
    answer: 'Most nationalities require a visa for Tanzania. You can obtain a visa on arrival at the airport or apply online through the e-visa system before your trip.',
    category: 'Visa',
    displayOrder: 2,
    isActive: true,
    language: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    question: 'What should I pack for a safari?',
    answer: 'We recommend packing light, breathable clothing in neutral colors, comfortable walking shoes, sunscreen, insect repellent, binoculars, and a camera with zoom lens.',
    category: 'Packing',
    displayOrder: 3,
    isActive: true,
    language: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    question: 'Wann ist die beste Reisezeit für Tansania?',
    answer: 'Die beste Zeit für eine Safari in Tansania ist von Juni bis Oktober während der Trockenzeit. Für die Great Migration ist Dezember bis März ideal.',
    category: 'Reise',
    displayOrder: 1,
    isActive: true,
    language: 'de',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    question: 'Benötige ich ein Visum für Tansania?',
    answer: 'Die meisten Staatsbürger benötigen ein Visum für Tansania. Sie können ein Visum bei Ankunft am Flughafen erhalten oder vorher online über das E-Visum-System beantragen.',
    category: 'Visum',
    displayOrder: 2,
    isActive: true,
    language: 'de',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Share Buttons (for tours/blog posts)
const shareButtonsDefaults = {
  facebook: true,
  whatsapp: true,
  email: true,
  copy: true
}

// GET share buttons
router.get('/share-buttons', async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany({ where: { category: 'share' } })
    const result = { ...shareButtonsDefaults }
    settings.forEach(s => {
      if (s.settingKey in result) {
        result[s.settingKey as keyof typeof result] = s.settingValue === 'true'
      }
    })
    res.json(result)
  } catch (err) {
    res.json(shareButtonsDefaults)
  }
})

// UPDATE share buttons - PROTECTED
router.put('/share-buttons', authenticateAdmin, async (req, res) => {
  try {
    const data = req.body
    for (const [key, value] of Object.entries(data)) {
      await prisma.siteSetting.upsert({
        where: { settingKey: key },
        update: { settingValue: String(value), settingType: 'boolean', category: 'share' },
        create: { settingKey: key, settingValue: String(value), settingType: 'boolean', category: 'share' }
      })
    }
    res.json({ message: 'Share buttons updated', data: req.body })
  } catch (err) {
    console.error('Error saving share buttons:', err)
    res.status(500).json({ error: 'Failed to save share buttons' })
  }
})

// GET active social media only (public)
router.get('/social/active', async (req, res) => {
  try {
    const active = await prisma.socialMedia.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    })
    res.json(active.map(s => ({ ...s, active: s.isActive })))
  } catch (err) {
    console.error('Error fetching active social:', err)
    res.json([])
  }
})

// SEO Config per page (defaults)
const seoConfigDefaults = {
  home: { title: 'GeTaToS Safari', description: 'Unvergessliche Safari-Erlebnisse in Tansania', keywords: 'safari, tansania, kilimanjaro, serengeti' },
  about: { title: 'Über uns', description: 'Erfahren Sie mehr über GeTaToS Safari', keywords: 'safari anbieter, tansania' },
  tours: { title: 'Unsere Touren', description: 'Entdecken Sie unsere Safari-Touren', keywords: 'safari touren, tansania reisen' },
  contact: { title: 'Kontakt', description: 'Kontaktieren Sie uns für Ihre Traum-Safari', keywords: 'safari buchen, kontakt' },
}

// GET SEO config
router.get('/seo/:page?', async (req, res) => {
  try {
    const { page } = req.params
    if (page) {
      const setting = await prisma.siteSetting.findUnique({
        where: { settingKey: `seo_${page}` }
      })
      if (setting && setting.settingValue) {
        res.json(JSON.parse(setting.settingValue))
      } else {
        res.json(seoConfigDefaults[page as keyof typeof seoConfigDefaults] || {})
      }
    } else {
      const settings = await prisma.siteSetting.findMany({
        where: { settingKey: { startsWith: 'seo_' } }
      })
      const result:any = { ...seoConfigDefaults }
      settings.forEach(s => {
        const pageKey = s.settingKey.replace('seo_', '')
        result[pageKey] = JSON.parse(s.settingValue || '{}')
      })
      res.json(result)
    }
  } catch (err) {
    res.json(seoConfigDefaults)
  }
})

// UPDATE SEO config - PROTECTED
router.put('/seo/:page', authenticateAdmin, async (req, res) => {
  try {
    const { page } = req.params
    const settingKey = `seo_${page}`
    const settingValue = JSON.stringify(req.body)
    await prisma.siteSetting.upsert({
      where: { settingKey },
      update: { settingValue, settingType: 'json', category: 'seo' },
      create: { settingKey, settingValue, settingType: 'json', category: 'seo' }
    })
    res.json({ message: 'SEO config updated' })
  } catch (err) {
    console.error('Error saving SEO:', err)
    res.status(500).json({ error: 'Failed to save SEO config' })
  }
})

// General Settings
const generalSettings = {
  site_title: 'GeTaToS Safari - Ihre Safari Experten',
  site_subtitle: 'Unvergessliche Safari-Erlebnisse in Tansania',
  default_language: 'de',
  currency: 'EUR',
  // Default currencies per language
  default_currencies: {
    de: 'EUR',
    en: 'USD',
    es: 'USD',
    fr: 'EUR',
    zh: 'CNY'
  },
  timezone: 'Africa/Dar_es_Salaam',
  booking_enabled: true
}

// Analytics
const analyticsSettings = {
  ga4_id: '',
  gtm_id: '',
  google_search_console: '',
  bing_webmaster: '',
  yandex_verification: '',
  gdpr_cookie_banner: false
}

// API Keys
const apiKeys = {
  google_maps_key: '',
  whatsapp_business_api: '',
  mailchimp_api_key: '',
  mailchimp_list_id: '',
  sendgrid_api_key: '',
  sendgrid_from_email: 'noreply@getatos-safari.com',
  sendgrid_to_email: 'info@getatos-safari.com',
  cloudinary_name: ''
}

// GET company info - PUBLIC (for footer/contact)
router.get('/company/public', async (req, res) => {
  try {
    const info = await prisma.companyInfo.findMany()
    const result: Record<string, any> = {}
    info.forEach(i => { result[i.key] = i.value })
    res.json(result)
  } catch (err) {
    console.error('Error fetching company:', err)
    res.status(500).json({ error: 'Failed to fetch company info' })
  }
})

// GET company info - PROTECTED (contains sensitive business data)
router.get('/company', authenticateAdmin, async (req, res) => {
  try {
    const info = await prisma.companyInfo.findMany()
    const result: Record<string, any> = {}
    info.forEach(i => { result[i.key] = i.value })
    res.json(result)
  } catch (err) {
    console.error('Error fetching company:', err)
    res.status(500).json({ error: 'Failed to fetch company info' })
  }
})

// UPDATE company info - PROTECTED
router.put('/company', authenticateAdmin, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await prisma.companyInfo.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string }
      })
    }
    const info = await prisma.companyInfo.findMany()
    const result: Record<string, any> = {}
    info.forEach(i => { result[i.key] = i.value })
    res.json({ message: 'Company info updated', data: result })
  } catch (err) {
    console.error('Error saving company:', err)
    res.status(500).json({ error: 'Failed to save company info' })
  }
})

// GET all social media
router.get('/social', async (req, res) => {
  try {
    let social = await prisma.socialMedia.findMany({ orderBy: { displayOrder: 'asc' } })
    // Create defaults if empty
    if (social.length === 0) {
      const defaults = [
        { platform: 'facebook', username: 'getatos', url: 'https://facebook.com/getatos', displayOrder: 1, isActive: true },
        { platform: 'instagram', username: 'getatos', url: 'https://instagram.com/getatos', displayOrder: 2, isActive: true },
        { platform: 'whatsapp', username: '255712345678', url: 'https://wa.me/255712345678', displayOrder: 3, isActive: true },
      ]
      for (const s of defaults) {
        await prisma.socialMedia.create({ data: s })
      }
      social = await prisma.socialMedia.findMany({ orderBy: { displayOrder: 'asc' } })
    }
    // Map 'isActive' to 'active' for frontend compatibility
    const result = social.map(s => ({
      ...s,
      active: s.isActive
    }))
    res.json(result)
  } catch (err) {
    console.error('Error fetching social:', err)
    res.status(500).json({ error: 'Failed to fetch social media' })
  }
})

// UPDATE social media - PROTECTED
router.put('/social', authenticateAdmin, async (req, res) => {
  try {
    const { id, active, ...updates } = req.body
    if (id) {
      // Map 'active' to 'isActive' for frontend compatibility
      const data: any = { ...updates }
      if (active !== undefined) {
        data.isActive = active
      }
      // Try update, if not found create new
      await prisma.socialMedia.upsert({
        where: { id: Number(id) },
        update: data,
        create: { id: Number(id), ...data }
      })
    }
    const social = await prisma.socialMedia.findMany({ orderBy: { displayOrder: 'asc' } })
    res.json({ message: 'Social media updated', data: social })
  } catch (err) {
    console.error('Error updating social:', err)
    res.status(500).json({ error: 'Failed to update social media' })
  }
})

// GET general settings
router.get('/general', async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany({ where: { category: 'general' } })
    const result: Record<string, any> = {}
    settings.forEach(s => {
      result[s.settingKey] = s.settingType === 'boolean' ? s.settingValue === 'true' : s.settingValue
    })
    // Set defaults if empty
    if (!result.site_title) result.site_title = 'GeTaToS Safari - Ihre Safari Experten'
    if (!result.default_language) result.default_language = 'de'
    if (!result.currency) result.currency = 'EUR'
    if (!result.timezone) result.timezone = 'Africa/Dar_es_Salaam'
    if (result.booking_enabled === undefined) result.booking_enabled = true
    res.json(result)
  } catch (err) {
    console.error('Error fetching general settings:', err)
    res.status(500).json({ error: 'Failed to fetch general settings' })
  }
})

// GET booking enabled (public)
router.get('/booking-status', async (req, res) => {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { settingKey: 'booking_enabled' } })
    const booking_enabled = setting?.settingType === 'boolean' ? setting.settingValue === 'true' : true
    res.json({ booking_enabled })
  } catch (err) {
    res.json({ booking_enabled: true })
  }
})

// UPDATE general settings - PROTECTED
router.put('/general', authenticateAdmin, async (req, res) => {
  try {
    const data = req.body
    for (const [key, value] of Object.entries(data)) {
      const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
      const settingType = typeof value === 'boolean' ? 'boolean' : 'string'
      await prisma.siteSetting.upsert({
        where: { settingKey: key },
        update: { settingValue, settingType, category: 'general' },
        create: { settingKey: key, settingValue, settingType, category: 'general' }
      })
    }
    const settings = await prisma.siteSetting.findMany({ where: { category: 'general' } })
    const result: Record<string, any> = {}
    settings.forEach(s => {
      result[s.settingKey] = s.settingType === 'boolean' ? s.settingValue === 'true' : s.settingValue
    })
    res.json({ message: 'General settings updated', data: result })
  } catch (err) {
    console.error('Error saving general settings:', err)
    res.status(500).json({ error: 'Failed to save general settings' })
  }
})

// GET analytics settings
router.get('/analytics', async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany({ where: { category: 'analytics' } })
    const result: Record<string, any> = {}
    settings.forEach(s => {
      result[s.settingKey] = s.settingType === 'boolean' ? s.settingValue === 'true' : s.settingValue
    })
    // Defaults
    if (!result.ga4_id) result.ga4_id = ''
    if (!result.gtm_id) result.gtm_id = ''
    if (!result.gdpr_cookie_banner) result.gdpr_cookie_banner = false
    res.json(result)
  } catch (err) {
    console.error('Error fetching analytics:', err)
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
})

// UPDATE analytics settings - PROTECTED
router.put('/analytics', authenticateAdmin, async (req, res) => {
  try {
    const data = req.body
    for (const [key, value] of Object.entries(data)) {
      const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
      const settingType = typeof value === 'boolean' ? 'boolean' : 'string'
      await prisma.siteSetting.upsert({
        where: { settingKey: key },
        update: { settingValue, settingType, category: 'analytics' },
        create: { settingKey: key, settingValue, settingType, category: 'analytics' }
      })
    }
    res.json({ message: 'Analytics settings updated' })
  } catch (err) {
    console.error('Error saving analytics:', err)
    res.status(500).json({ error: 'Failed to save analytics' })
  }
})

// GET API keys
router.get('/api-keys', async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany({ where: { category: 'api' } })
    const result: Record<string, boolean> = {}
    settings.forEach(s => {
      result[`has_${s.settingKey.replace('_api_key', '').replace('_business', '')}`] = !!s.settingValue
    })
    res.json(result)
  } catch (err) {
    res.json({ has_google_maps: false, has_whatsapp: false, has_mailchimp: false, has_sendgrid: false, has_cloudinary: false })
  }
})

// UPDATE API keys - PROTECTED
router.put('/api-keys', authenticateAdmin, async (req, res) => {
  try {
    const data = req.body
    for (const [key, value] of Object.entries(data)) {
      const settingValue = String(value || '')
      await prisma.siteSetting.upsert({
        where: { settingKey: key },
        update: { settingValue, settingType: 'string', category: 'api' },
        create: { settingKey: key, settingValue, settingType: 'string', category: 'api' }
      })
    }
    res.json({ message: 'API keys updated' })
  } catch (err) {
    console.error('Error saving api keys:', err)
    res.status(500).json({ error: 'Failed to save API keys' })
  }
})


// ============ TERMS & CONDITIONS ============

// GET all terms (public) - with optional type filter
router.get('/terms', async (req, res) => {
  try {
    const lang = req.query.lang as string || 'en'
    const type = req.query.type as string || 'agb'
    const terms = await prisma.termsAndCondition.findMany({
      where: { language: lang, isActive: true, type }
    })
    res.json(terms)
  } catch (err) {
    console.error('Error fetching terms:', err)
    res.status(500).json({ error: 'Failed to fetch terms' })
  }
})

// GET single terms by language
router.get('/terms/:lang', async (req, res) => {
  try {
    const { lang } = req.params
    const terms = await prisma.termsAndCondition.findMany({
      where: { language: lang }
    })
    res.json(terms)
  } catch (err) {
    console.error('Error fetching terms:', err)
    res.status(500).json({ error: 'Failed to fetch terms' })
  }
})

// CREATE new terms (admin) - PROTECTED
router.post('/terms', authenticateAdmin, async (req, res) => {
  try {
    const { title, content, language, version, type } = req.body
    const newTerms = await prisma.termsAndCondition.create({
      data: {
        title,
        content,
        language: language || 'en',
        type: type || 'agb',
        isActive: true,
        version: version || '1.0'
      }
    })
    res.json(newTerms)
  } catch (err) {
    console.error('Error creating terms:', err)
    res.status(500).json({ error: 'Failed to create terms' })
  }
})

// UPDATE terms (admin) - PROTECTED
router.put('/terms/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const updated = await prisma.termsAndCondition.update({
      where: { id: parseInt(id) },
      data: { ...req.body }
    })
    res.json(updated)
  } catch (err) {
    console.error('Error updating terms:', err)
    res.status(404).json({ error: 'Terms not found' })
  }
})

// DELETE terms (admin) - PROTECTED
router.delete('/terms/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params
    await prisma.termsAndCondition.delete({
      where: { id: parseInt(id) }
    })
    res.json({ message: 'Terms deleted' })
  } catch (err) {
    console.error('Error deleting terms:', err)
    res.status(404).json({ error: 'Terms not found' })
  }
})

// GET all terms for admin (with optional filtering)
router.get('/admin/terms', async (req, res) => {
  try {
    const { lang, type } = req.query
    const terms = await prisma.termsAndCondition.findMany({
      where: {
        ...(lang && { language: lang as string }),
        ...(type && { type: type as string })
      }
    })
    res.json(terms)
  } catch (err) {
    console.error('Error fetching admin terms:', err)
    res.status(500).json({ error: 'Failed to fetch terms' })
  }
})
// ============ FAQs ============

// GET all FAQs (public)

router.get('/faqs', (req, res) => {
  const lang = req.query.lang as string || 'en'
  const category = req.query.category as string
  let result = faqs.filter(f => f.language === lang && f.isActive)
  
  if (category) {
    result = result.filter(f => f.category === category)
  }
  
  // Sort by display order
  result.sort((a, b) => a.displayOrder - b.displayOrder)
  res.json(result)
})

// GET FAQ categories
router.get('/faqs/categories', (req, res) => {
  const lang = req.query.lang as string || 'en'
  const categories = [...new Set(faqs.filter(f => f.language === lang).map(f => f.category).filter(Boolean))]
  res.json(categories)
})

// CREATE new FAQ (admin) - PROTECTED
router.post('/faqs', authenticateAdmin, (req, res) => {
  const { question, answer, category, displayOrder, language } = req.body
  const newFaq = {
    id: Math.max(...faqs.map(f => f.id), 0) + 1,
    question,
    answer,
    category: category || 'General',
    displayOrder: displayOrder || faqs.length + 1,
    isActive: true,
    language: language || 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  faqs.push(newFaq)
  res.json(newFaq)
})

// UPDATE FAQ (admin) - PROTECTED
router.put('/faqs/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params
  const index = faqs.findIndex(f => f.id === parseInt(id))
  if (index >= 0) {
    faqs[index] = {
      ...faqs[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    }
    res.json(faqs[index])
  } else {
    res.status(404).json({ error: 'FAQ not found' })
  }
})

// DELETE FAQ (admin) - PROTECTED
router.delete('/faqs/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params
  faqs = faqs.filter(f => f.id !== parseInt(id))
  res.json({ message: 'FAQ deleted' })
})

// GET all FAQs for admin
router.get('/admin/faqs', (req, res) => {
  res.json(faqs)
})

export default router

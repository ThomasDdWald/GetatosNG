import { Router } from 'express'
import { prisma } from '../index.js'

const router = Router()

// Get all translations for a language
router.get('/:lang', async (req, res) => {
  try {
    const { lang } = req.params
    
    const translations = await prisma.translation.findMany({
      where: { languageCode: lang },
      orderBy: { pageKey: 'asc' }
    })
    
    // Convert to key-value format
    const result: Record<string, string> = {}
    translations.forEach(t => {
      const fullKey = t.pageKey ? `${t.pageKey}.${t.key}` : t.key
      result[fullKey] = t.value
    })
    
    res.json(result)
  } catch (error) {
    console.error('Error fetching translations:', error)
    res.status(500).json({ error: 'Failed to fetch translations' })
  }
})

// Get all translations (all languages)
router.get('/', async (req, res) => {
  try {
    const translations = await prisma.translation.findMany({
      orderBy: [
        { languageCode: 'asc' },
        { pageKey: 'asc' },
        { key: 'asc' }
      ]
    })
    res.json(translations)
  } catch (error) {
    console.error('Error fetching all translations:', error)
    res.status(500).json({ error: 'Failed to fetch translations' })
  }
})

// Admin: Create/update translation
router.post('/', async (req, res) => {
  try {
    const { languageCode, pageKey, key, value } = req.body
    
    const translation = await prisma.translation.upsert({
      where: {
        languageCode_pageKey_key: {
          languageCode,
          pageKey: pageKey || '',
          key
        }
      },
      update: { value },
      create: {
        languageCode,
        pageKey: pageKey || '',
        key,
        value
      }
    })
    
    res.json(translation)
  } catch (error) {
    console.error('Error saving translation:', error)
    res.status(500).json({ error: 'Failed to save translation' })
  }
})

// Admin: Delete translation
router.delete('/:id', async (req, res) => {
  try {
    await prisma.translation.delete({
      where: { id: Number(req.params.id) }
    })
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting translation:', error)
    res.status(500).json({ error: 'Failed to delete translation' })
  }
})

export default router

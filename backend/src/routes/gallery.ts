import { Router } from 'express'
import { prisma } from '../index.js'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

// Count all active images
router.get('/count', async (req, res) => {
  try {
    const count = await prisma.galleryImage.count({ where: { isActive: true } })
    res.json({ count })
  } catch (error) {
    console.error('Error counting images:', error)
    res.status(500).json({ error: 'Failed to count images' })
  }
})

// Generate slug from title
function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const shortUuid = uuidv4().slice(0, 8)
  return `${slug}-${shortUuid}`
}

// Get all images (public)
router.get('/', async (req, res) => {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    })
    res.json(images)
  } catch (error) {
    console.error('Error fetching gallery:', error)
    res.status(500).json({ error: 'Failed to fetch gallery' })
  }
})

export default router

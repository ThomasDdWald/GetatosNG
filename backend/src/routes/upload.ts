import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { uploadImage, deleteImage, isGcsConfigured } from '../services/gcsService.js'

const router = Router()

// JWT Secret - must match admin.ts
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-do-not-use-in-production'

// Middleware to check admin auth
const authenticateAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  const token = authHeader.replace('Bearer ', '')
  try {
    jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Log GCS configuration status
console.log('GCS Configured:', isGcsConfigured())

// Generate SEO-friendly slug from filename or title
function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) // Limit length
  const shortUuid = uuidv4().slice(0, 6)
  return `${baseSlug}-${shortUuid}`
}

// Configure multer storage - keep file temporarily in memory for GCS upload
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Nur Bilder (jpg, png, gif, webp) erlaubt!'))
    }
  }
})

// Upload single image - PROTECTED
router.post('/gallery', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Kein Bild hochgeladen' })
    }
    
    // Generate SEO-friendly filename
    const ext = path.extname(req.file.originalname)
    const title = req.body.title || path.basename(req.file.originalname, ext)
    const slug = generateSlug(title)
    const filename = `${slug}${ext}`
    
    // Set the filename for GCS
    req.file.filename = filename
    
    // Upload to GCS
    const result = await uploadImage(req.file)
    
    res.json({
      success: true,
      url: result.url,
      publicUrl: result.publicUrl,
      filename: filename,
      originalName: req.file.originalname,
      size: req.file.size
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload fehlgeschlagen' })
  }
})

// Delete image - PROTECTED
router.delete('/gallery/:filename', authenticateAdmin, async (req, res) => {
  try {
    const filename = req.params.filename
    await deleteImage(filename)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: 'Löschen fehlgeschlagen' })
  }
})

export default router
import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sgMail from '@sendgrid/mail'
import jwt from 'jsonwebtoken'
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-do-not-use-in-production'

// WICHTIG: Das ist der SITE KEY, nicht der Legacy Secret Key
const RECAPTCHA_SITE_KEY =
  process.env.RECAPTCHA_SITE_KEY || '6LfBvLgsAAAAAH7UGfOG-Nxz1XwOsKmX77HYMfbR'

const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID || 'getatos'
const RECAPTCHA_ACTION = 'contact'
const RECAPTCHA_MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE || '0.5')

const recaptchaClient = new RecaptchaEnterpriseServiceClient()

function getClientIp(req: any): string | undefined {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0]
  }
  return req.ip || req.socket?.remoteAddress || undefined
}

async function verifyRecaptchaEnterprise(args: {
  token: string
  expectedAction: string
  userAgent?: string
  userIpAddress?: string
}) {
  const { token, expectedAction, userAgent, userIpAddress } = args

  if (!token) {
    return { success: false, score: 0, reason: 'missing-token' }
  }

  try {
    const projectPath = recaptchaClient.projectPath(GCP_PROJECT_ID)

    const [response] = await recaptchaClient.createAssessment({
      parent: projectPath,
      assessment: {
        event: {
          token,
          siteKey: RECAPTCHA_SITE_KEY,
          expectedAction,
          userAgent,
          userIpAddress,
        },
      },
    })

    if (!response.tokenProperties?.valid) {
      console.error(
        'reCAPTCHA token invalid:',
        response.tokenProperties?.invalidReason
      )
      return {
        success: false,
        score: 0,
        reason: String(response.tokenProperties?.invalidReason || 'invalid-token'),
      }
    }

    const tokenAction = response.tokenProperties?.action || ''
    if (tokenAction !== expectedAction) {
      console.error('reCAPTCHA action mismatch:', tokenAction, 'vs', expectedAction)
      return { success: false, score: 0, reason: 'action-mismatch' }
    }

    const score = response.riskAnalysis?.score ?? 0
    const reasons = response.riskAnalysis?.reasons || []

    console.log('reCAPTCHA score:', score, 'reasons:', reasons)

    return {
      success: score >= RECAPTCHA_MIN_SCORE,
      score,
      reasons,
    }
  } catch (error) {
    console.error('reCAPTCHA Enterprise verification error:', error)
    return { success: false, score: 0, reason: 'assessment-error' }
  }
}

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

const dataFile = path.join(__dirname, '../../data/contact.json')
const dataDir = path.join(__dirname, '../../data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

function loadMessages(): any[] {
  try {
    if (fs.existsSync(dataFile)) {
      return JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    }
  } catch (error) {
    console.error('Error loading messages:', error)
  }
  return []
}

function saveMessages(messages: any[]) {
  fs.writeFileSync(dataFile, JSON.stringify(messages, null, 2))
}

function loadApiKeys() {
  try {
    const settingsPath = path.join(__dirname, '../../data/settings.json')
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
    }
  } catch (error) {
    console.error('Error loading API keys:', error)
  }
  return {}
}

async function sendEmailNotification(messageData: any) {
  const apiKeys = loadApiKeys()

  if (!apiKeys.sendgrid_api_key) {
    console.log('SendGrid not configured, skipping email notification')
    return false
  }

  sgMail.setApiKey(apiKeys.sendgrid_api_key)

  const toEmail = apiKeys.sendgrid_to_email || 'info@getatos-safari.com'
  const fromEmail = apiKeys.sendgrid_from_email || 'noreply@getatos-safari.com'

  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: `Neue Kontaktanfrage: ${messageData.subject || 'Ohne Betreff'}`,
    text: `
Name: ${messageData.name}
E-Mail: ${messageData.email}
Betreff: ${messageData.subject || 'Kein Betreff'}

Nachricht:
${messageData.message}
    `.trim(),
    html: `
<h2>Neue Kontaktanfrage</h2>
<p><strong>Name:</strong> ${messageData.name}</p>
<p><strong>E-Mail:</strong> ${messageData.email}</p>
<p><strong>Betreff:</strong> ${messageData.subject || 'Kein Betreff'}</p>
<hr>
<p><strong>Nachricht:</strong></p>
<p>${messageData.message.replace(/\n/g, '<br>')}</p>
    `.trim()
  }

  try {
    await sgMail.send(msg)
    console.log('Email notification sent to:', toEmail)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isSpam(name: string, message: string, email: string): boolean {
  const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'prize', 'click here', 'buy now', 'discount']
  const lowerMessage = (name + ' ' + message + ' ' + email).toLowerCase()

  for (const keyword of spamKeywords) {
    if (lowerMessage.includes(keyword)) return true
  }

  const linkCount = (message.match(/http|www\./gi) || []).length
  if (linkCount > 2) return true
  if (message.length < 10 || message.length > 5000) return true

  const upperCount = (message.match(/[A-Z]/g) || []).length
  if (message.length > 20 && upperCount / message.length > 0.5) return true

  return false
}

router.post('/', async (req, res) => {
  const { name, email, subject, message, recaptchaToken } = req.body
  const acceptLanguage = req.headers['accept-language'] || 'en'
  const isGerman = String(acceptLanguage).includes('de')

  if (!name || !email || !message) {
    return res.status(400).json({
      error: isGerman
        ? 'Name, E-Mail und Nachricht sind erforderlich'
        : 'Name, email and message are required'
    })
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: isGerman ? 'Ungültige E-Mail-Adresse' : 'Invalid email address'
    })
  }

  if (isSpam(name, message, email)) {
    return res.status(400).json({
      error: isGerman
        ? 'Ihre Nachricht scheint Spam zu sein.'
        : 'Your message appears to be spam.'
    })
  }

  if (!recaptchaToken) {
    return res.status(400).json({
      error: isGerman
        ? 'reCAPTCHA-Token fehlt.'
        : 'reCAPTCHA token is missing.'
    })
  }

  const verification = await verifyRecaptchaEnterprise({
    token: recaptchaToken,
    expectedAction: RECAPTCHA_ACTION,
    userAgent: req.get('user-agent'),
    userIpAddress: getClientIp(req),
  })

  if (!verification.success) {
    return res.status(400).json({
      error: isGerman
        ? 'reCAPTCHA Validierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
        : 'reCAPTCHA validation failed. Please try again.'
    })
  }

  const messages = loadMessages()
  const newMessage = {
    id: Date.now(),
    name,
    email,
    subject,
    message,
    read: false,
    recaptchaScore: verification.score,
    created_at: new Date().toISOString()
  }

  messages.push(newMessage)
  saveMessages(messages)

  await sendEmailNotification(newMessage)

  res.status(201).json({ message: 'Message sent successfully' })
})

router.get('/', (req, res) => {
  const messages = loadMessages()
  res.json(messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
})

router.patch('/:id/read', (req, res) => {
  const { id } = req.params
  const messages = loadMessages()
  const index = messages.findIndex((m: any) => m.id === parseInt(id))

  if (index === -1) {
    return res.status(404).json({ error: 'Message not found' })
  }

  messages[index].read = true
  saveMessages(messages)

  res.json({ message: 'Message marked as read' })
})

router.delete('/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params
  let messages = loadMessages()
  const initialLength = messages.length
  messages = messages.filter((m: any) => m.id !== parseInt(id))

  if (messages.length === initialLength) {
    return res.status(404).json({ error: 'Message not found' })
  }

  saveMessages(messages)
  res.json({ message: 'Message deleted' })
})

export default router
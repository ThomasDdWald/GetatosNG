import { Router } from 'express'

const router = Router()

const subscribers: any[] = []

router.post('/', (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }
  const existing = subscribers.find(s => s.email === email)
  if (existing) {
    return res.status(400).json({ error: 'Email already subscribed' })
  }
  const subscriber = {
    id: subscribers.length + 1,
    email,
    subscribed_at: new Date().toISOString()
  }
  subscribers.push(subscriber)
  res.status(201).json({ message: 'Subscribed successfully' })
})

export default router

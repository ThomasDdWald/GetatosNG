import { Router } from 'express'

const router = Router()

const testimonials = [
  { id: 1, guest_name: 'Hans Müller', guest_country: 'Germany', rating: 5, comment: 'Tolle Safari!', is_approved: true },
  { id: 2, guest_name: 'Sarah Johnson', guest_country: 'USA', rating: 5, comment: 'Unvergesslich!', is_approved: true }
]

router.get('/', (req, res) => {
  const approved = testimonials.filter(t => t.is_approved)
  res.json(approved)
})

export default router

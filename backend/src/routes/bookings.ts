import { Router } from 'express'
import { prisma } from '../index.js'

const router = Router()

// Create booking - PUBLIC for customers
router.post('/', async (req, res) => {
  try {
    const { 
      tour_id, 
      full_name, 
      email, 
      phone, 
      nationality, 
      travel_date, 
      number_of_guests, 
      additional_guests, 
      special_requests 
    } = req.body
    
    // Basic validation
    if (!tour_id || !full_name || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields: tour_id, full_name, email' 
      })
    }
    
    const booking = await prisma.booking.create({
      data: {
        tourId: tour_id,
        fullName: full_name,
        email,
        phone,
        nationality,
        travelDate: travel_date ? new Date(travel_date) : null,
        numberOfGuests: number_of_guests || 1,
        additionalGuests: additional_guests,
        specialRequests: special_requests,
        status: 'pending'
      },
      include: {
        tour: {
          select: { 
            id: true,
            titleEn: true, 
            slugEn: true,
            titleDe: true,
            titleEs: true,
            titleFr: true,
            titleZh: true
          }
        }
      }
    })
    
    res.status(201).json({
      message: 'Booking received. We will contact you by email.',
      bookingId: booking.id
    })
  } catch (error) {
    console.error('Create booking error:', error)
    res.status(500).json({ error: 'Failed to create booking' })
  }
})

// All other booking operations are handled by Admin API
// See /api/admin/bookings for admin-only endpoints

export default router

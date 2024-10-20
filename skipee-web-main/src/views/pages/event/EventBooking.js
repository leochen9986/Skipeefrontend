import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './EventBooking.css'
import { VenuApiController } from '../../../api/VenuApiController'
import { CSpinner } from '@coreui/react'
import { TicketApiController } from '../../../api/TicketApiController'
import { toast } from 'react-toastify'
import { AppFooter } from '../../../components'
import UserHeader from '../../../components/UserHeader'
import { ViewTicketPrice } from '../../forms/range/Range'

const EventBooking = () => {
  const { eventId, ticketId } = useParams()
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSplash, setShowSplash] = useState(true)
  const [formStep, setFormStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    quantity: 1,
  })
  const nav = useNavigate()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        new VenuApiController().getEvent(eventId).then((res) => {
          setEvent(res)
          setLoading(false)
          setSelectedTicket(res.tickets.find((ticket) => ticket._id.toString() === ticketId))
          setTimeout(() => setShowSplash(false), 3000)
        })
      } catch (error) {
        console.error('Error fetching event:', error)
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleQuantityChange = (increment) => {
    setFormData((prevState) => ({
      ...prevState,
      quantity: Math.max(1, prevState.quantity + increment),
    }))
  }

  const handleNext = (e) => {
    e.preventDefault()
    setFormStep(2)
  }

  const handleSubmit = async (e) => {
    console.log('Initiating payment')
    e.preventDefault()
    const { firstName, lastName, phoneNumber, quantity } = formData
    const data = {
      name: `${firstName} ${lastName}`,
      phone: phoneNumber,
      noOfUser: quantity,
      eventTicket: ticketId,
    }
    setLoading(true)

    new TicketApiController().initiateTicketBooking(data).then((res) => {
      if (res.message) {
        toast.error(res.message)
      } else {
        toast.success('Complete the payment to book ticket')
        window.location.href = res.url
      }
      setLoading(false)
    })
  }

  if (loading) {
    return (
      <div className="loading">
        <CSpinner color="primary" />
      </div>
    )
  }

  if (showSplash) {
    return (
      <div className="splash-screen">
        <img src={event.site.logo} alt={event.site.name} className="site-logo" />
        <h1>{event.site.name}</h1>
        <p>Powered by Skipee</p>
      </div>
    )
  }

  return (
    <>
      <UserHeader />
      <div className="event-booking">
        <div>
          <div
            style={{
              margin: '8px',
              backgroundImage: `url(${event.image})`,
              backgroundSize: 'cover',
              borderRadius: '20px',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="event-card-overlay-1">
              <img src={event.site.logo} alt={event.site.name} className="site-logo-small" />
            </div>
          </div>
          <h1>{event.name}</h1>
        </div>
        {formStep === 1 ? (
          <form onSubmit={handleNext}>
            <h2 style={{ textAlign: 'center' }}>May I have your name and email?</h2>
            <p className="subtitle">P.S. This helps us identify who's in line for VIP</p>
            <div className="form-group">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Your email"
                required
              />
            </div>
            <button type="submit" className="next-button">
              Next
            </button>
          </form>
        ) : (
          <form style={{ textAlign: 'center' }} onSubmit={handleSubmit}>
            <h2>Current Queue skip</h2>
            <div className="price"> {selectedTicket && <ViewTicketPrice amount={selectedTicket.price} site={event.site} />}</div>
            <p>How many Queue Skips would you like?</p>
            <div className="quantity-selector">
              <button type="button" onClick={() => handleQuantityChange(-1)}>
                -
              </button>
              <span>{formData.quantity}</span>
              <button type="button" onClick={() => handleQuantityChange(1)}>
                +
              </button>
            </div>
            <button type="submit" className="buy-button">
              £{selectedTicket?.price * formData.quantity} - Buy Now
            </button>
          </form>
        )}
      </div>
      <AppFooter />
    </>
  )
}

export default EventBooking

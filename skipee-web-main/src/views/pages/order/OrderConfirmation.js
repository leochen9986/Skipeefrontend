import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { VenuApiController } from '../../../api/VenuApiController'
import { CButton, CSpinner } from '@coreui/react'
import './OrderConfirmation.css'
import QRCode from 'react-qr-code'
import { TicketApiController } from '../../../api/TicketApiController'
import { toast } from 'react-toastify'
import { AppFooter } from '../../../components'
import UserHeader from '../../../components/UserHeader'
import { format } from 'date-fns'

const OrderConfirmation = () => {
  const { ticketId } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)
  const location = useLocation()
  const isSuccess = new URLSearchParams(location.search).get('success') === 'true'

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await new TicketApiController().getTicket(ticketId)
        setTicket(response)
        setLoading(false)
      } catch (error) {
        toast.error('Error fetching ticket:', error)
        setLoading(false)
      }
    }

    const confirmTicketBooked = async () => {
      try {
        await new TicketApiController().confirmTicketBooked(ticketId)
      } catch (error) {
        toast.error('Error confirming ticket:', error)
      }
    }

    if (isSuccess) {
      fetchTicket()
      confirmTicketBooked()
    } else {
      setLoading(false)

      // Set a 2-second delay before navigating back
      setTimeout(() => {
        // Navigate back twice to skip the Stripe page
        window.history.go(-3)
      }, 2000)
    }
  }, [ticketId, isSuccess])

  if (loading) {
    return (
      <div className="loading">
        <CSpinner color="primary" />
      </div>
    )
  }

  if (!isSuccess) {
    return (
      <div className="order-confirmation failure">
        <h1>Booking Failed</h1>
        <p>We're sorry, but there was an error processing your booking. Please try again.</p>
      </div>
    )
  }

  return (
    <>
      <UserHeader />
      <div className="order-confirmation">
        <br />
        <br />
        <h2>Order Confirmation</h2>
        {!showQR ? (
          <>
            <p>
              You’re nearly there! Collect your tickets below, they have also been sent to your
              email
            </p>
            <div className="ticket-info">
              <h3>Acceptable for:</h3>
              <div className="guest-count">{ticket && ticket.noOfUser}</div>
              <p>Guests</p>

              <p>Ticket: {ticket?.eventTicket?.name}</p>
            </div>
            <div className="event-details">
              <h3>Event Details</h3>
              <p>
                <strong>Event Name:</strong> {ticket?.eventTicket?.event?.name}
              </p>
              <img
                src={ticket?.eventTicket?.event?.image}
                alt={ticket?.eventTicket?.event?.name}
                width={260}
                height={140}
                style={{ objectFit: 'cover' }}
                className="mb-3"
              />
              <p>
                <strong>Date:</strong>{' '}
                {ticket?.eventTicket?.event?.endDate
                  ? 'Recurring Event'
                  : format(new Date(ticket?.eventTicket?.event?.date), 'dd/MM/yyyy')}
              </p>
              <p>
                <strong>Time:</strong> {ticket?.eventTicket?.event?.startTime} -{' '}
                {ticket?.eventTicket?.event?.endTime}
              </p>
              <p>
                <strong>Location:</strong> {ticket?.eventTicket?.event?.location}
              </p>
            </div>
            <button className="scan-button" onClick={() => setShowQR(true)}>
              Get QR
            </button>
          </>
        ) : (
          <>
            <p>Please present this screen to the person at the entrance.</p>
            <p>Take screenshot of this page to prevent loss of ticket.</p>
            <div id={ticketId} className="qr-code mb-3">
              <QRCode
                value={ticketId}
                size={256}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                viewBox={`0 0 256 256`}
              />
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <CButton
                color="primary"
                size="sm"
                className="d-flex align-items-center justify-content-center"
                style={{backgroundColor:'#1DB954' ,border:'none'}}
                onClick={async (e) => {
                  e.preventDefault()
                  const svg = document.getElementById(ticketId).getElementsByTagName('svg')[0]
                  const svgData = new XMLSerializer().serializeToString(svg)
                  const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
                  const svgUrl = URL.createObjectURL(svgBlob)
                  const link = document.createElement('a')
                  link.href = svgUrl
                  link.download = `${ticket?.eventTicket?.event?.name}.svg`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  URL.revokeObjectURL(svgUrl)
                }}
              >
                Download QR Code
              </CButton>
            </div>
          </>
        )}
      </div>
      <AppFooter />
    </>
  )
}

export default OrderConfirmation

import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CBadge, CButton, CCol, CContainer, CRow, CSpinner } from '@coreui/react'
import axios from 'axios'
import './Search.css'
import { VenuApiController } from '../../../api/VenuApiController'
import UserHeader from '../../../components/UserHeader'
import { AppFooter } from '../../../components'
import PopupModelBase from '../../popup/PopupModelBase'
import { EventDetailPage } from '../event/EventDetails'
import { EventDetailView } from '../event/EventOverview'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { ViewTicketPrice } from '../../forms/range/Range'

const Search = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const searchTerm = new URLSearchParams(location.search).get('search')
    const siteId = new URLSearchParams(location.search).get('siteId')

    if (searchTerm || siteId) {
      fetchResults(searchTerm, siteId)
    }
  }, [])

  const fetchResults = async (searchTerm, siteId) => {
    setLoading(true)
    try {
      const filter = {}
      if (searchTerm) {
        filter['search'] = searchTerm
      }

      if (siteId) {
        filter['siteId'] = siteId
      }
      const res = await new VenuApiController().getAllEvents(filter)
      setResults(res)
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <UserHeader />
      <CContainer md>
        <div className="search-container">
          <h1>🔍 Search Results: &nbsp; {new URLSearchParams(location.search).get('search')} </h1>
          <br />
          {loading ? (
            <div className="loader-container">
              <CSpinner color="primary" />
            </div>
          ) : (
            <ul className="results-list">
              {results.map((result, index) => (
                <EventCard key={index} event={result} />
              ))}
              {results.length === 0 && (
                <div className="loader-container">
                  <h1 style={{ textAlign: 'center' }}>No results found.</h1>
                </div>
              )}
            </ul>
          )}
        </div>
      </CContainer>
      <AppFooter />
    </>
  )
}

const EventCard = ({ event }) => {
  const [showTicketPopup, setShowTicketPopup] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupChildren, setPopupChildren] = useState(null)
  const eventDate = new Date(event.date)
  console.log(eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
  const nav = useNavigate()

  const handleBookNow = () => {
    setShowTicketPopup(true)
  }

  const handleClosePopup = () => {
    setShowTicketPopup(false)
  }

  const handleProceed = (selectedTicketId) => {
    // Here you would typically initiate the booking process
    nav(`/book-event/${event._id}/${selectedTicketId}`)
    setShowTicketPopup(false)
    // Add your booking logic here
  }

  return (
    <div className="event-card">
      <div className="event-card-background" style={{ backgroundImage: `url(${event.image})` }}>
        <div className="event-card-overlay"></div>

        <div className="event-card-content">
          <div className="event-date-time">
            <div className="event-date">{event.endDate ? 'Daily' : formattedDate}</div>
            <div className="event-time">{event.startTime}</div>
          </div>
          <h2 className="event-name">{event.name}</h2>
          <div>
            <CRow>
              <CCol xs={12} md={8}>
                <div>{event.site.name}</div>
                <div>📌 {event.location}</div>
              </CCol>
              <CCol xs={12} md={4}>
                <CButton
                  className="text-white"
                  color="info"
                  onClick={() => {
                    setPopupChildren(<EventDetailView event={event} onProceed={handleProceed} />)
                    setPopupVisible(true)
                  }}
                >
                  View Details
                </CButton>
                &nbsp;
                <CButton className="text-white" color="success" onClick={handleBookNow}>
                  Book Now
                </CButton>
              </CCol>
            </CRow>
          </div>
        </div>
      </div>
      {showTicketPopup && (
        <TicketPopup
          tickets={event.tickets}
          onClose={handleClosePopup}
          onProceed={handleProceed}
          event={event}
        />
      )}
      <PopupModelBase
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false)
        }}
        title="Event Details"
        children={popupChildren}
      />
    </div>
  )
}

const TicketPopup = ({ tickets, onClose, onProceed, event }) => {
  const [selectedTicket, setSelectedTicket] = useState(null)

  return (
    <div className="ticket-popup-overlay">
      <div className="ticket-popup">
        <h2>Select a Tisscket</h2>
        <div className="ticket-list">
          {tickets
            .filter(
              (ticket) =>
                new Date(ticket.saleStartTime) < new Date() &&
                new Date(ticket.saleEndTime) > new Date(),
            )
            .map((ticket) => (
              <div
                key={ticket._id}
                className={`ticket-item ${selectedTicket === ticket._id ? 'selected' : ''}`}
                onClick={() => {
                  parseFloat(ticket.availableQuantity) > 0
                    ? setSelectedTicket(ticket._id)
                    : toast.error('No tickets available')
                }}
              >
                <h3>{ticket.name}</h3>
                <p>
                  Price: <ViewTicketPrice amount={ticket.price} site={event.site} />
                </p>
                <p>Available: {ticket.availableQuantity}</p>
                <CBadge color="success">
                  Available till: {format(ticket.saleEndTime, 'dd/MM/yyyy HH:mm a')}
                </CBadge>
              </div>
            ))}
        </div>
        <div className="popup-buttons">
          <button onClick={onClose}>Close</button>
          <button onClick={() => onProceed(selectedTicket)} disabled={!selectedTicket}>
            Proceed
          </button>
        </div>
      </div>
    </div>
  )
}

export default Search

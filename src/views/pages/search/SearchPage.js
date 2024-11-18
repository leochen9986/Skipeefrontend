import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CRow,
  CBadge, 
  CSpinner
} from '@coreui/react'
import { useLocation, useNavigate } from 'react-router-dom'
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
import noresultfoundIcon from 'src/assets/icon_svg/noresultfound.svg'; 
import homeBg from 'src/assets/icon_svg/home-bg.png'; 
import location_pin_blackIcon from 'src/assets/icon_svg/location_pin_black.svg'; 
import 'src/views/pages/home/Home.scss'
import SingleEventItem from '../venues/items/SearchCard'

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
    setLoading(true);
    try {
      const filter = { status: "upcoming" };
      if (searchTerm) {
        filter['search'] = searchTerm;
      }
      if (siteId) {
        filter['siteId'] = siteId;
      }
  
      const res = await new VenuApiController().getAllEvents(filter);
  
      // Get the current timestamp
      const currentTimestamp = Date.now();
  
      // Filter events based on `ticket.salesStartTime` and `ticket.salesEndTime`
      const filteredResults = res.filter(event => {
        if (!event.tickets[0] || !event.tickets[0].saleStartTime || !event.tickets[0].saleEndTime) {
          return false; // Skip events without ticket sales information
        }
        console.log(event.tickets[0] );
        const salesStartTimestamp = new Date(event.tickets[0].saleStartTime).getTime();
        const salesEndTimestamp = new Date(event.tickets[0].saleEndTime).getTime();
  
        // Check if current timestamp is within the ticket sales time range
        if (salesEndTimestamp < salesStartTimestamp) {
          // Handle overnight sales (e.g., sales start at 22:00 and end at 02:00)
          return currentTimestamp >= salesStartTimestamp || currentTimestamp <= salesEndTimestamp;
        } else {
          // Regular sales time range
          return currentTimestamp >= salesStartTimestamp && currentTimestamp <= salesEndTimestamp;
        }
      });
      console.log(filteredResults);
      setResults(filteredResults);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div style={{ height: '65px', width: '100%', backgroundColor: 'white' }}>
      <UserHeader />
    </div>
    {results.length > 0 && <SearchSection />}
    <div >

          {/* <h1>🔍 Search Results: &nbsp; {new URLSearchParams(location.search).get('search')} </h1> */}
          <br />
          {loading ? (
            <div className="loader-container">
              <CSpinner color="primary" />
            </div>
          ) : (

            <ul className="results-list" >

                <div  style={{width:'100%', height:'100%'}}>
                  <SingleEventItem event={results}  />
                  
                {/* <EventCard key={index} event={result} /> */}
                </div>
              
              {results.length === 0 && (
                <div className="loader-container" style={{ height: '100%', padding: '10%' }}>
                <img src={noresultfoundIcon} style={{ width: '25%', height: 'auto' }} alt="No Results Found" />
              </div>

              )}
            </ul>
          )}
        
      </div>
      <div className='footercontent'>
      <AppFooter />
      </div>
    </>
  )
}

const EventCard = ({ event }) => {
  const [showTicketPopup, setShowTicketPopup] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupChildren, setPopupChildren] = useState(null)
  const eventDate = new Date(event.date)
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
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
  
    <div className="ticket-popup-overlay">
  
      <div className="ticket-popup">
        <h2 className='select-text'>Select a Ticket</h2>
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
                    : toast.error('No tickets available');
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
    
  );
}


const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const SearchSection = () => {
  const [search, setSearch] = useState('')
  const [events, setEvents] = useState([])
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const nav = useNavigate()

  const debouncedSearch = useDebounce(search, 300)

  const handleSearch = () => {
    if (search) { // Ensure there's a search term before navigating
      nav(`/search?search=${search}`);
    }
  };
  const getAllEvents = async (query) => {
    const venuApiController = new VenuApiController();
    try {
      const response = await venuApiController.getAllEvents({ ...query, status: "upcoming" });
      const currentTimestamp = Date.now();
      const filteredEvents = response.filter(event => {
        if (!event.tickets[0] || !event.tickets[0].saleStartTime || !event.tickets[0].saleEndTime) {
          return false; // Skip events without ticket sales time information
        }
  
        const salesStartTimestamp = new Date(event.tickets[0].saleStartTime).getTime();
        const salesEndTimestamp = new Date(event.tickets[0].saleEndTime).getTime();
  
        // Check if the current timestamp is within the ticket sales time range
        if (salesEndTimestamp < salesStartTimestamp) {
          // Handle overnight sales (salesEndTime is past midnight)
          return currentTimestamp >= salesStartTimestamp || currentTimestamp <= salesEndTimestamp;
        } else {
          // Regular sales time range
          return currentTimestamp >= salesStartTimestamp && currentTimestamp <= salesEndTimestamp;
        }
      });
      
      console.log(response);
      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };


  useEffect(() => {
    // Call getAllEvents with the search query as soon as debouncedSearch updates
    if (debouncedSearch) {
      getAllEvents({ search: debouncedSearch ,status: "upcoming" });
    } else {
      setEvents([]); // Clear events if the search is empty
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (events.length > 0) {
      const uniqueSuggestions = new Set();
      const filtered = events
        ?.flatMap((event) => [
          { type: 'event', name: event?.name ?? '', _id: event?._id ?? '' ,site_name:event?.site?.name ,location: event?.site?.location},
          { type: 'site', name: event?.site?.name ?? '', _id: event?.site?._id ?? '' ,location: event?.site?.location},
        ])
        .filter((suggestion) => {
          const isUnique = !uniqueSuggestions.has(suggestion.name.toLowerCase());
          if (isUnique && suggestion.name) {
            uniqueSuggestions.add(suggestion.name.toLowerCase());
          }
          return (
            isUnique && suggestion.name.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        });

      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]); // Clear suggestions if no events are found
    }
  }, [events, debouncedSearch]);

  const handleSelect = (suggestion) => {
    setSearch(suggestion.name)

    if (suggestion.type === 'event') {
      nav(`/search?search=${suggestion.name}`)
      window.location.reload();
    } else {
      nav(`/search?siteId=${suggestion._id}`)
      window.location.reload();
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url(${homeBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '125px 0',
      }}
      className="bg-body"
    >
      <CContainer className="text-center">
        <h2 className="text-left fw-bold display-4 text-white">Search Result</h2>
        <CRow className="justify-content-center"> 
          <CCol md={6}>
          <div className="d-flex align-items-center justify-content-center"> {/* Flex container for the button */}
            <div className="input-group position-relative me-2"> {/* Wrapper for input and icon */}
              <img
                src={location_pin_blackIcon}
                alt="Location Pin"
                className="input-icon" // Add a class for styling
              />
              <CFormInput
                type="text"
                value={search}
                onChange={(e) => {
                  setFilteredSuggestions([]);
                  setSearch(e.target.value);
                }}
                placeholder="Search Club or City"
                aria-label="Search"
                aria-describedby="button-addon2"
                className="input-with-icon" // Custom class for input styling
              />
            </div>
            <CButton color="primary" id="button-addon2" onClick={handleSearch} className='btn-search'>
              Search
            </CButton>
          </div>

          {search && filteredSuggestions.length > 0 && (
              
              <ul className="list-group position-absolute input-with-icon">
                              <img
                src={location_pin_blackIcon}
                alt="Location Pin"
                className="input-icon" // Add a class for styling
              />
                {filteredSuggestions.map((suggestion) => (
                  <li
                    key={suggestion._id + suggestion.type}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSelect(suggestion)}
                    style={{ cursor: 'pointer' }}
                  >
                    {suggestion.type === 'site' ? suggestion.name : suggestion.site_name} 
                    <br>
                    </br>
                    <div className='locationgray'>
                    {suggestion.location}
                    </div>
                  </li>
                  
                ))}
              </ul>
            )}
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}


export default Search

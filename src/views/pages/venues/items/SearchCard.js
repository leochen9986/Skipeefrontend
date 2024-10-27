import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import { VenuApiController } from '../../../../api/VenuApiController'
import { cilEnvelopeClosed, cilMap, cilMoney, cilPhone, cilQrCode } from '@coreui/icons'
import PopupModelBaseVenue from '../../../popup/PopupModelBaseVenue'
import PopupModelBase from '../../../popup/PopupModelBase'
import QRCode from 'react-qr-code'
import { kBaseUrl } from '../../../../assets/constants/constants'
import Dashboard from '../../../dashboard/Dashboard'
import { toast } from 'react-toastify'
import select_ticketIcon from 'src/assets/icon_svg/select_ticket.svg';
import select_queueIcon from 'src/assets/icon_svg/select_queue.svg';
import location_pin_greyIcon from 'src/assets/icon_svg/location_pin_grey.svg';
import processIcon from 'src/assets/icon_svg/process.svg';
import { format } from 'date-fns'
import { ViewTicketPrice } from 'src/views/forms/range/Range.js'
import './VenueItemCard.scss'
import './TicketPopup.scss'
import { EventDetailView } from 'src/views/pages/event/EventOverview.js'
import { useLocation } from 'react-router-dom'

const SearchCard = ({ event}) => {
  const [showTicketPopup, setShowTicketPopup] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupChildren, setPopupChildren] = useState(null)
  const [popupVisibleV, setPopupVisibleV] = useState(false)
  const [popupChildrenV, setPopupChildrenV] = useState(null)
  const nav = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);




  //console.log('Location2:', location?.search);

  // const fakeEvent = {
  //   id: 'event_001',
  //   name: 'Concert in the Park',
  //   site: 'Park Amphitheater',
  //   tickets: [
  //     {
  //       _id: 'ticket_001',
  //       name: 'Regular Ticket',
  //       price: 30.0,
  //       availableQuantity: 100,
  //       saleStartTime: '2024-10-01T00:00:00Z',
  //       saleEndTime: '2024-10-30T23:59:59Z',
  //     },
  //     {
  //       _id: 'ticket_002',
  //       name: 'Queue Skip',
  //       price: 100.0,
  //       availableQuantity: 20,
  //       saleStartTime: '2024-10-01T00:00:00Z',
  //       saleEndTime: '2024-10-30T23:59:59Z',
  //     },

  //   ],
  // };

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


  const handleProceed = (selectedTicketId, index) => {
    if (selectedTicketId && results[index]) {
      const event = results[index];
    nav(`/book-event/${event._id}/${selectedTicketId}`)
  }
    setShowTicketPopup(false)
    // Add your booking logic here

  }

  const handleBookNow = (event, index) => {
    setSelectedEvent(event);
    setSelectedEventIndex(index); // Set the selected index here
    setShowTicketPopup(true);
  };


  const handleClosePopup = () => {
    setShowTicketPopup(false)
    setSelectedEvent(null);
  }

  return (
    <>
      <br />

      <CContainer>
        <CRow>
        {results.map((event, index) => (
          <CCol md="6" key={index}>
            <CCard className="mb-4" style={{ borderRadius: '10px' }}>
              <CCardBody className="card-body-cc">
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <CCardImage
                    src={event?.image}
                    className="rounded-top"
                    style={{ width: '30%', height: '150px', objectFit: 'fill' }}
                  />

                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '10px',
                    }}
                  >
                    <span style={{ marginRight: 'auto', fontWeight: 'bold' }}>
                      {event.name}
                    </span>
                    <div className={`event-date status-badge ${event.endDate ? 'status-success' : 'status-warning'}`}>
                      {event.endDate ? 'Open Daily' : new Date(event.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                    </div>

                  </div>
                </div>
              </CCardBody>
              <CCardFooter className="d-flex flex-column flex-md-row justify-content-between align-items-center width-mobile">
                <p className="mb-2 mb-md-0" style={{ marginRight: 'auto' }}>
                  <img src={location_pin_greyIcon} alt="Location Pin" /> {event.location}
                </p>
                <div className="d-flex flex-column flex-md-row flex-wrap width-mobile">
                  <div className="d-flex justify-content-between w-100 mb-2 mb-md-0">
                    <CButton
                      className="custom-button-analytics"
                      color="primary"
                      onClick={() => {
                        setPopupChildren(
                          <EventDetailView event={event} onProceed={handleProceed} />
                        );
                        setPopupVisible(true);
                      }}
                    >
                      View Details
                    </CButton>
                    <CButton className="custom-button-settings" color="success" onClick={() => handleBookNow(event, index)}>
                      Book Now
                    </CButton>

                  </div>
                </div>
              </CCardFooter>
            </CCard>
          </CCol>

        ))}
        </CRow>

        {showTicketPopup && selectedEvent && (
          <TicketPopup
            tickets={selectedEvent.tickets}
            onClose={handleClosePopup}
            onProceed={(selectedTicketId) => handleProceed(selectedTicketId, selectedEventIndex)}
            event={selectedEvent}
          />
        )}

          <PopupModelBase
            visible={popupVisible}
            onClose={() => {
              setPopupVisible(false);
            }}
          >
            {popupChildren}
          </PopupModelBase>



      </CContainer>

    </>
  )
}

const TicketPopup = ({ tickets, onClose, onProceed,event }) => {
  const [selectedTicket, setSelectedTicket] = useState(null)

  return (
    <div className="ticket-popup-overlay">
      <div className="ticket-popup">
<<<<<<< Updated upstream
        <h2  style={{fontWeight:'bold'}}>Select a Ticket</h2>
        <div className="ticket-list" >
=======
        <h2 style={{ fontWeight: 'bold' }}>Select a Ticket</h2>
        <div className="ticket-list">
>>>>>>> Stashed changes
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
                style={{
                  textAlign: 'center',
                  paddingBottom: '5px', // Reduced padding for mobile
                  borderRadius: '15px',
                  width: '45%',
                  height: 'auto',
                }}
              >
                <img 
                  src={ticket.name === "Skip Ticket" ? select_ticketIcon : select_queueIcon} 
                  alt="Ticket Icon" 
                  style={{ padding: '5px', maxWidth: '50px', height: 'auto', display: 'block', margin: '0 auto' }} 
                />
                <h3 className="ticket-name" style={{ padding: '5px', margin: '0' }}>{ticket.name}</h3>
                <hr style={{ border: 'none', borderTop: '2px dashed grey', width: '100%', margin: '5px 0' }} />
                <p style={{ padding: '5px', margin: '0' }}>
                  <ViewTicketPrice amount={ticket.price} site={event.site} />
                </p>
                {ticket.availableQuantity !== "999999" && (
                  <p style={{ padding: '5px', margin: '0' }}>
                    {`${ticket.availableQuantity} Skips Available`}
                  </p>
                )}
                <div className="event-date status-badge status-success">
                  Available till {format(ticket.saleEndTime, 'dd/MM/yyyy')} at {format(ticket.saleEndTime, 'hh:mm a')}
                </div>
              </div>
            ))}
        </div>
        <div className="popup-buttons" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CButton
            className="custom-button-analytics"
            color="primary"
            style={{
              backgroundColor: 'black',
              borderRadius: '30px',
              width: '49%',
            }}
            onClick={onClose}
          >
            Go Back
          </CButton>
  
          <button
            onClick={() => onProceed(selectedTicket)}
            disabled={!selectedTicket}
            style={{
              backgroundColor: '#1DB954',
              color: 'white',
              borderRadius: '30px',
              width: '49%',
            }}
          >
            Proceed
          </button>
        </div>
        <img src={processIcon} style={{ padding: '10px', maxWidth: '100%', height: 'auto' }} />
      </div>
    </div>
  );
  

}


export default SearchCard

// const CommissionTab = ({ site }) => {
//   const [commissionSettings, setCommissionSettings] = useState({
//     minCommission: site?.minCommission,
//     maxCommission: site?.maxCommission,
//     percentageCommission: site?.percentageCommission,
//     baseCommission: site?.baseCommission,
//   })

//   useEffect(() => {
//     setCommissionSettings({
//       minCommission: site?.minCommission,
//       maxCommission: site?.maxCommission,
//       percentageCommission: site?.percentageCommission,
//       baseCommission: site?.baseCommission,
//     })
//   }, [site])

//   const handleCommissionChange = (e) => {
//     const { name, value } = e.target
//     setCommissionSettings((prev) => ({
//       ...prev,
//       [name]: parseFloat(value),
//     }))
//   }

//   const saveCommissionSettings = async () => {
//     // Replace this with your actual API call
//     await new VenuApiController().updateStripeComission(site._id, commissionSettings)

//     toast.success('Commission settings saved successfully!')

//     window.location.reload()
//   }

//   return (
//     <CCard>
//       <CCardHeader>
//         <strong>Stripe Commission</strong>
//       </CCardHeader>
//       <CCardBody>
//         <CForm>
//           <CInputGroup className="mb-3">
//             <CInputGroupText>Min Commission (£)</CInputGroupText>
//             <CFormInput
//               type="number"
//               name="minCommission"
//               value={commissionSettings.minCommission}
//               onChange={handleCommissionChange}
//             />
//           </CInputGroup>
//           <CInputGroup className="mb-3">
//             <CInputGroupText>Max Commission (£)</CInputGroupText>
//             <CFormInput
//               type="number"
//               name="maxCommission"
//               value={commissionSettings.maxCommission}
//               onChange={handleCommissionChange}
//             />
//           </CInputGroup>
//           <CInputGroup className="mb-3">
//             <CInputGroupText>Percentage Commission (%)</CInputGroupText>
//             <CFormInput
//               type="number"
//               name="percentageCommission"
//               value={commissionSettings.percentageCommission}
//               onChange={handleCommissionChange}
//             />
//           </CInputGroup>
//           <CInputGroup className="mb-3">
//             <CInputGroupText>Base Commission (£)</CInputGroupText>
//             <CFormInput
//               type="number"
//               name="baseCommission"
//               value={commissionSettings.baseCommission}
//               onChange={handleCommissionChange}
//             />
//           </CInputGroup>
//           <CButton color="primary" onClick={saveCommissionSettings}>
//             Save Commission Settings
//           </CButton>
//         </CForm>
//       </CCardBody>
//     </CCard>
//   )
// }

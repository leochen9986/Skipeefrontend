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

const SingleVenueItem = ({ index, event }) => {
  const [showTicketPopup, setShowTicketPopup] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupChildren, setPopupChildren] = useState(null)
  const [popupVisibleV, setPopupVisibleV] = useState(false)
  const [popupChildrenV, setPopupChildrenV] = useState(null)
  const nav = useNavigate();

  const fakeEvent = {
    id: 'event_001',
    name: 'Concert in the Park',
    site: 'Park Amphitheater',
    tickets: [
      {
        _id: 'ticket_001',
        name: 'Regular Ticket',
        price: 30.0,
        availableQuantity: 100,
        saleStartTime: '2024-10-01T00:00:00Z',
        saleEndTime: '2024-10-30T23:59:59Z',
      },
      {
        _id: 'ticket_002',
        name: 'Queue Skip',
        price: 100.0,
        availableQuantity: 20,
        saleStartTime: '2024-10-01T00:00:00Z',
        saleEndTime: '2024-10-30T23:59:59Z',
      },

    ],
  };
  

  const benefits = [
    {
      title: 'Event Name 1',
      description: 'Description for Event 1. This event will be an exciting and fun experience.',
      eventId: 'EVT12345'
    },
    {
      title: 'Event Name 2',
      description: 'Description for Event 2. Join us for an amazing time and unforgettable memories.',
      eventId: 'EVT12346'
    },
    {
      title: 'Event Name 3',
      description: 'Description for Event 3. You will enjoy unique activities and performances.',
      eventId: 'EVT12347'
    },
    {
      title: 'Event Name 4',
      description: 'Description for Event 4. This is a special opportunity to participate in exclusive experiences.',
      eventId: 'EVT12348'
    }
  ];

  const handleProceed = (selectedTicketId) => {
    // Here you would typically initiate the booking process
    nav(`/book-event/${event._id}/${selectedTicketId}`)
    setShowTicketPopup(false)
    // Add your booking logic here
  }
  const handleBookNow = () => {
    setShowTicketPopup(true)
  }

  const handleClosePopup = () => {
    setShowTicketPopup(false)
  }
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })

  return (
    <>
    <br/>
    <CContainer  >
      <CRow>
      {/* {benefits.map((benefit, index) => ( */}
        <CCol md='6' key={index}>
          <CCard className="mb-4" style={{borderRadius:'10px'}}>
            {/* <CCardHeader>
              <strong>{site?.name}</strong>
            </CCardHeader>
            <CCardImage src={site?.imageVenue} className="rounded-top" /> */}
            <CCardBody className="card-body-cc">
              
            <div style={{ 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column', // Change to column to stack image and spans
              alignItems: 'flex-start', // Aligns children to the left
            }}>
              <CCardImage 
                src={event?.image} 
                className="rounded-top" 
                style={{ width: '30%',  
                  height: '150px', 
                  objectFit: 'fill' }}
              />

              {/* Use a flex container for the spans */}
              <div style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'space-between', // Space between the spans
                alignItems: 'center', 
                marginTop: '10px', // Optional: add some space above
              }}>
                <span style={{ marginRight: 'auto' ,fontWeight:'bold'}}>{event.name}</span> {/* Left aligned */}
                <div className={`event-date status-badge status-success`}>
                  {event.endDate ? 'Open Daily' : formattedDate}
                </div>

              </div>
            </div>

              

              {/* <CCardText>{site?.description}</CCardText>
              <CCardText>{site?.address}</CCardText>
              <CCardText>Ticket Price: {site?.ticketPrice} JOD</CCardText> */}
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
                      setPopupChildren(<EventDetailView event={event} onProceed={handleProceed} />);
                      setPopupVisible(true);
                    }}
                  >
                    View Details
                  </CButton>
                  <CButton
                    className="custom-button-settings" 
                    color="success"
                    onClick={handleBookNow}
                  >
                    Book Now
                  </CButton>
                                {/* &nbsp;

                          <CButton
                            className="custom-button-archive" 
                            // onClick={() => {
                            //   new VenuApiController().deleteSite(site?._id).then(() => {
                            //     window.location.reload();
                            //   });
                            // }}
                          >
                            <img 
                              src={achiveIcon} 
                              alt="Archive Icon" 
                              style={{ width: '20px', height: '20px', textAlign: 'center' }} 
                            />
                          </CButton> */}
                          {/* &nbsp;
                          <CButton color="warning" href={`/venues/${site?._id}/edit`}>
                            Edit
                          </CButton>
                          &nbsp; */}
                </div>
              </div>
            </CCardFooter>

          </CCard>
        </CCol>
        {/* ))} */}
      </CRow>

      {showTicketPopup && event.tickets && (
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
          setPopupVisible(false);
        }}
        // title={`${site?.name}'s QR`}
        children={popupChildren}

      />

    </CContainer>
    
    </>
  )
}
            {/* .filter(
              (ticket) =>
                new Date(ticket.saleStartTime) < new Date() &&
                new Date(ticket.saleEndTime) > new Date(),
            ) */}
const TicketPopup = ({ tickets, onClose, onProceed, event }) => {
  const [selectedTicket, setSelectedTicket] = useState(null)
  console.log(tickets);

  tickets.filter((ticket) => {
    console.log('Ticket:', ticket);
    console.log('saleStartTime:', ticket.saleStartTime, 'Parsed:', new Date(ticket.saleStartTime));
    console.log('saleEndTime:', ticket.saleEndTime, 'Parsed:', new Date(ticket.saleEndTime));
  
    return (
      new Date(ticket.saleStartTime) < new Date() &&
      new Date(ticket.saleEndTime) > new Date()
    );
  })

  return (
    <div className="ticket-popup-overlay" >
      <div className="ticket-popup">
        <h2  style={{fontWeight:'bold'}}>Select a Ticket</h2>
        <div className="ticket-list" >
          {tickets

            .map((ticket) => (
              
              <div
                key={ticket._id}
                className={`ticket-item ${selectedTicket === ticket._id ? 'selected' : ''}`}
                onClick={() => {
                  parseFloat(ticket.availableQuantity) > 0
                    ? setSelectedTicket(ticket._id)
                    : toast.error('No tickets available');
                }}
                style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '10px' ,borderRadius:'15px', width:'45%',height:'100%'}} // Set padding here
              >
                <img src={ticket.name === "Regular Ticket" ? select_ticketIcon : select_queueIcon} alt="Ticket Icon" style={{ padding: '10px' }} />
                <h3 className="ticket-name" style={{ padding: '10px' }}>{ticket.name}</h3>
                <div style={{ padding: '1px' }} className="dashed-line" ></div>
                <p style={{ padding: '10px' }}>
                  <ViewTicketPrice amount={ticket.price} site={event.site} />
                </p>
                <p style={{ padding: '10px' }}>{ticket.availableQuantity} Skips Available</p>
                <div className={`event-date status-badge status-success`} >
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
            width: '49%', // Adjust width to fit in the row
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
            width: '49%', // Adjust width to fit in the row
          }}
        >
          Proceed
        </button>

        
      </div>
      <img src={processIcon}style={{padding:'20px'}}/>
      </div>
    </div>
  )
}

export default SingleVenueItem

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

import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { VenuApiController } from '../../../api/VenuApiController'
import { CButton, CRow, CSpinner ,CCol} from '@coreui/react'
import './OrderConfirmation.css'
import QRCode from 'react-qr-code'
import { TicketApiController } from '../../../api/TicketApiController'
import { toast } from 'react-toastify'
import { AppFooter } from '../../../components'
import UserHeader from '../../../components/UserHeader'
import { format } from 'date-fns'
import paymentfailedIcon from 'src/assets/icon_svg/paymentfailed.svg'; 
import eventPNG from 'src/assets/icon_svg/event.png'; 
import select_ticketIcon from 'src/assets/icon_svg/select_ticket.svg';
import OC_pplIcon from 'src/assets/icon_svg/OC_ppl.svg';
import OC_flagIcon from 'src/assets/icon_svg/OC_flag.svg';
import OC_timeIcon from 'src/assets/icon_svg/OC_time.svg';
import OC_calendarIcon from 'src/assets/icon_svg/OC_calendar.svg';
import downloadqrIcon from 'src/assets/icon_svg/downloadqr.svg';
import location_pin_greyIcon from 'src/assets/icon_svg/location_pin_grey.svg';
import process4Icon from 'src/assets/icon_svg/process4.svg';

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
      <><UserHeader />
      <div className="loader-container" style={{ height: '100%', padding: '10%' }}>
      <img src={paymentfailedIcon} style={{ width: '25%', height: 'auto' }} alt="Failed Payment" />
    </div>
    </>
    )
  }
  return (
    <>
      <div style={{ height: '65px', width: '100%', backgroundColor: 'white' ,border: '2px solid #E2E2E3'}}>
      <UserHeader />
      </div>
      <div className="event-booking" style={{ border: '1px solid #E2E2E3', borderRadius: '20px', position: 'relative' }}>
      <div className="background-overlay-10"></div>
        <div>
          <div style={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
              src={ticket?.eventTicket?.event?.image}
              alt={ticket?.eventTicket?.event?.name}
              style={{ height: '15%', width: '15%', margin: '5% 2% 1% 2%', position: 'relative', zIndex: 1 }} 
            />
            <h1 style={{ zIndex: 1, position: 'relative' }}>{ticket?.eventTicket?.event?.name}</h1>
          </div>
          <div className="order-confirmation">
          <br />
          <br />
          <h2>Order Confirmation</h2>

        </div>
        </div>

        {!showQR ? (
          <div className='center-block'>
            <p>
              You’re nearly there! Collect your tickets below, they have also been sent to your
              email
            </p>
            <div
              style={{
                width: '95%',
                border: '1px solid #E2E2E3',
                borderRadius: '15px',
                padding: '2%',
                display: 'flex',
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center',
                justifyContent:'center'
              }}
            >            
            <img src={select_ticketIcon} style={{paddingBottom: '2%',}}/>
            <h3>Ticket Details</h3>
            <hr style={{ border: 'none', borderTop: '2px dashed grey', width: '100%', margin: '10px 0' }} />
<div style={{ width: '100%', margin: '10px', backgroundColor: 'white' }}> {/* Set background color to white */}
  <CRow className="custom-row" style={{ justifyContent: 'center', textAlign: 'center' }}>
    <CCol className="custom-col-con" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0', height: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '0' }}>
        <img src={OC_pplIcon} style={{ width: '7%' }} />
        <p style={{ textAlign: 'center', margin: '0', padding: '0 10px' }}>
          Number of Guests
        </p>
      </div>
      <p style={{ color: '#1DB954', textAlign: 'center', margin: '0', padding: '0' }}>
        {ticket && ticket.noOfUser} Person
      </p>
    </CCol>
    <CCol className="custom-col-con" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0', height: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '0' }}>
        <img src={OC_flagIcon} style={{ width: '7%' }} />
        <p style={{ textAlign: 'center', margin: '0', padding: '0 10px' }}>
          Event Name
        </p>
      </div>
      <p style={{ color: '#1DB954', textAlign: 'center', margin: '0', padding: '0' }}>
        {ticket?.eventTicket?.event?.name}
      </p>
    </CCol>
  </CRow>
  <CRow className="custom-row" style={{ justifyContent: 'center', textAlign: 'center' }}>
    <CCol className="custom-col-con" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0', height: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '0' }}>
        <img src={OC_calendarIcon} style={{ width: '7%' }} />
        <p style={{ textAlign: 'center', margin: '0', padding: '0 10px' }}>
          Date
        </p>
      </div>
      <p style={{ color: '#1DB954', textAlign: 'center', margin: '0', padding: '0' }}>
        {format(new Date(ticket?.createdAt), 'dd/MM/yyyy')}
        {/* {ticket?.eventTicket?.event?.endDate
          ? 'Recurring Event'
          : format(new Date(ticket?.eventTicket?.event?.date), 'dd/MM/yyyy')} */}
          
      </p>
    </CCol>
    <CCol className="custom-col-con" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0', height: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '0' }}>
        <img src={OC_timeIcon} style={{ width: '7%' }} />
        <p style={{ textAlign: 'center', margin: '0', padding: '0 10px' }}>
          Time
        </p>
      </div>
      <p style={{ color: '#1DB954', textAlign: 'center', margin: '0', padding: '0' }}>
      {format(new Date(ticket?.createdAt), 'HH:mm')}
        {/* {ticket?.eventTicket?.event?.startTime} -{' '}
        {ticket?.eventTicket?.event?.endTime} */}
      </p>
    </CCol>
  </CRow>
  <CRow className="custom-row" style={{ justifyContent: 'center', textAlign: 'center' }}>
    <CCol className="custom-col-con" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0', height: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '0' }}>
        <img src={location_pin_greyIcon} style={{ width: '3%' }} />
        <p style={{ textAlign: 'center', margin: '0', padding: '0 10px' }}>
          Location
        </p>
      </div>
      <p style={{ color: '#1DB954', textAlign: 'center', margin: '0', padding: '0' }}>
        {ticket?.eventTicket?.event?.location}
      </p>
    </CCol>
  </CRow>
</div>


          <hr style={{ border: 'none', borderTop: '2px dashed grey', width: '100%', margin: '10px 0' }} />
          <div id={ticketId} className="qr-code mb-3">
              <QRCode
                value={ticketId}
                size={256}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                viewBox={`0 0 256 256`}
              />
            </div>
            </div>

            {/* <div className="ticket-info">
              
              

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
            </div> */}
            {/* <button className="scan-button" onClick={() => setShowQR(true)} style={{margin:'3%'}}>
              Get QR
            </button> */}
            <CButton
                color="primary"
                size="sm"
                className="scan-button"
                style={{backgroundColor:'#1DB954' ,border:'none',margin:'3%',borderRadius:'20px'}}
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
                <img src={downloadqrIcon} style={{paddingLeft:'10px'}}/>
              </CButton>
            <div style={{width:'100%', textAlign:'center', alignContent:'center', justifyContent:'center', display:'flex'}}>
            <img src={process4Icon}style={{padding:'20px'}}/>
            </div>
          </div>
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

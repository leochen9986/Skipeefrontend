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
import select_queueIcon from 'src/assets/icon_svg/select_queue.svg';
import {
  CFormInput,
  CFormLabel,
  CButton,
} from '@coreui/react'
import process2Icon from 'src/assets/icon_svg/proess2.svg';
import process3Icon from 'src/assets/icon_svg/process3.svg';

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
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleQuantityChange = (increment) => {
    setFormData((prevState) => ({
      ...prevState,
      quantity: Math.max(1, prevState.quantity + increment),
    }))
  }

  const handleNext = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Validate input fields (optional)
    if (formData.firstName && formData.lastName && formData.phoneNumber) {
      setFormStep(2); // Move to the next step
    } else {
      // Handle invalid input if necessary
      toast.error('Please fill in all required fields.');
    }
  };

  // const handleSubmit = async (e) => {
  //   nav(`/book/${ticketId}`)
  // }
  
  
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
    nav(`/book/${ticketId}`)

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
      <div className='event-booking-header' style={{width: '100%', backgroundColor: 'white' ,border: '2px solid #E2E2E3'}}>
      <UserHeader />
      </div>
      <div className="event-booking" style={{ border: '1px solid #E2E2E3', borderRadius: '20px', position: 'relative' }}>
      <div className="background-overlay"></div>
        <div>
          {/* <div
            style={{
              
              backgroundImage: `url(${event.image})`,
              backgroundSize: 'cover',
              borderRadius: '20px',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="event-card-overlay-1">
               <img src={event.site.logo} alt={event.site.name} className="site-logo-small" /> 
            </div>
            
          </div> */}
          <div style={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
              src={event.image} 
              alt={event.name} 
              style={{ height: '15%', width: '15%', margin: '5% 2% 3% 2%', position: 'relative', zIndex: 1 }} 
            />
            <h1 style={{ zIndex: 1, position: 'relative' }}>{event.name}</h1>
          </div>

          
        </div>
        {formStep === 1 ? (
          <form onSubmit={handleNext}>
            <h2 style={{ textAlign: 'center' }}>Enter Details</h2>
            <p className="subtitle">Phasellus condimentum id leo eu fermentum.</p>
            <div style={{width:'100%'}}>
            <CFormLabel htmlFor="first" className="col-form-label custom-label">
             First Name
            </CFormLabel>
            <CFormInput
              type="text"
              id="firstName"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="custom-input"
            />
            <CFormLabel htmlFor="last" className="col-form-label custom-label">
            Last Name
            </CFormLabel>
            <CFormInput
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                required
                className="custom-input"
            />
            <CFormLabel htmlFor="email" className="col-form-label custom-label">
             Email
            </CFormLabel>
            <CFormInput
                type="email"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Your email"
                required
                className="custom-input"
            />
            
            {/* <div className="form-group">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                required
              />
            </div> */}
            {/* <div className="form-group">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                required
              />
            </div> */}
            {/* <div className="form-group">
              <input
                type="email"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Your email"
                required
              />
            </div> */}
            <div className="popup-buttons">
              <CButton
                className="custom-button-analytics-ck"
                color="primary"
                style={{
                  backgroundColor: 'black',
                  borderRadius: '30px',
                  // Removed width since it's managed in CSS now
                }}
              >
                Go Back
              </CButton>

              <button
                style={{
                  backgroundColor: '#1DB954',
                  color: 'white',
                  borderRadius: '30px',
                  // Removed width since it's managed in CSS now
                }}
                type="submit"
                className="custom-button-analytics-ck"
              >
                Next
              </button>
            </div>


            <div style={{width:'100%', textAlign:'center', alignContent:'center', justifyContent:'center', display:'flex'}}>
            <img src={process2Icon}style={{padding:'20px'}}/>
            </div>
            </div>
        
            
        
            {/* <button type="submit" className="next-button">
              Next
            </button> */}
          </form>
        ) : (
          <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }} onSubmit={handleSubmit}>            
          <h2 style={{ fontWeight:'bold'}}>Queue Skip at Venue</h2>
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
            <img src={select_queueIcon} style={{paddingBottom: '2%',}}/>
            <p style={{color:'black'}}>This is not an entry ticket, please check entry requirements</p>
            <div  className="dashed-line" ></div>
            <p style={{color:'black',paddingTop: '2%', }}>Current Queue Skip</p>
            <div className="price"> £ 30.00{selectedTicket && <ViewTicketPrice amount={selectedTicket.price} site={event.site} />}</div>
            <div className="price-small"> + £ 0.0 fees{selectedTicket && <ViewTicketPrice amount={selectedTicket.price} site={event.site} />}</div>
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
            // onClick={onClose}
            >
            Go Back
            </CButton>

            <button

            style={{
            backgroundColor: '#1DB954',
            color: 'white',
            borderRadius: '30px',
            width: '49%', // Adjust width to fit in the row
            }}
            type="submit"
            
            >
            Pay
            </button>
            </div>
            {/* <button type="submit" className="buy-button">
              £{selectedTicket?.price * formData.quantity} - Buy Now
            </button> */}
            <div style={{width:'100%', textAlign:'center', alignContent:'center', justifyContent:'center', display:'flex'}}>
            <img src={process3Icon}style={{padding:'20px'}}/>
            </div>
          </form>
        )}
      </div>
      <AppFooter />
    </>
  )
}

export default EventBooking

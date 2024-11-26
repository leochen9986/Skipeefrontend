import { useState, useEffect, useRef } from 'react'
import {
  CCol,
  CRow,
  CImage,
  CSpinner,
  CContainer,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CForm,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import ticket_icon from 'src/assets/images/icons/ticket-icon.svg'
import money_icon from 'src/assets/images/icons/money-icon.svg'
import MainChart from './MainChart'
import PageTopBar from '../../components/PageTopBar'
import './dashboard.scss'
import { AuthApiController } from '../../api/AuthApiController'
import { VenuApiController } from '../../api/VenuApiController'
import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'
import { DashboardApiController } from '../../api/DashboardApiController'
import { addDays, format } from 'date-fns'
import skips_soldIcon from 'src/assets/icon_svg/skips_sold.svg';
import total_revenueIcon from 'src/assets/icon_svg/total_revenue.svg';
import chartIcon from 'src/assets/icon_svg/chart.svg';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase'

const Dashboard = ({ site,  showTitle = true  }) => {
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const today = new Date();
  const oneWeekAgo = addDays(today, -7);
  const [dateRange, setDateRange] = useState([oneWeekAgo, today]);
  const [dashboardData, setDashboardData] = useState({})
  const [label, setLabel] = useState([])
  const [value, setValue] = useState([])
  const [topCustomers, setTopCustomers] = useState([])

  // Modal state and refs
  const [showModal, setShowModal] = useState(false)
  const [clubName, setClubName] = useState('')
  const [location, setLocation] = useState('')
  const [logo, setLogo] = useState(null)
  const [venueId, setVenueId] = useState(null) // To store the current venue ID
  const fileInputRef = useRef(null)
  const locationInputRef = useRef(null) // Reference for location input



  const [startDate, endDate] = dateRange
  console.log

  const formatCurrency = (amount) => {
    return `£${parseFloat(amount).toFixed(2)}`; // Ensure it's a float and format to 2 decimal places
  }
  

  const getDashboardData = (filter) => {
    setLoading(true)

    new DashboardApiController().getDashboardData(filter).then((res) => {
      console.log(res)

      if (res && res.message) {
        toast.error(res.message)
      } else {
        setDashboardData(res)
        setLabel(res.chartData.map((data) => data._id))
        setValue(res.chartData.map((data) => data.amount))
        setTopCustomers(res.topCustomers)
        setLoading(false)
      }
    })
  }

  const fetch = async () => {
    const [stDate, enDate] = dateRange
    setLoading(true)
    new AuthApiController()
      .getProfile()
      .then((res) => {
        if (res.message) {
          toast.error(res.message)
          new AuthApiController().logout()
        } else {
          if (res && !res.worksIn) {
            nav('/register?step=1')
          }
          console.log(res.message);
          getDashboardData({
            startDate: format(stDate, 'dd/MM/yyyy'),
            endDate: format(enDate, 'dd/MM/yyyy'),
            siteId: site?._id,
          })
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetch()
  }, [dateRange])

  useEffect(() => {
    const today = new Date()
    const oneWeekAgo = addDays(today, -7)
    setDateRange([oneWeekAgo, today])
  }, [nav])

  const fetchProfile = async () => {
    const res = await new AuthApiController().getProfile()
    if (res && res.worksIn.location === 'HQ') {
      setClubName(res.siteName)
      setLocation(res.location)
      setVenueId(res.worksIn._id)
      setShowModal(true) // Show modal if user works in "HQ"
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (showModal) {
      const intervalId = setInterval(() => {
        if (window.google && window.google.maps && locationInputRef.current) {
          clearInterval(intervalId);
          const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
            componentRestrictions: { country: 'GB' }, // Restrict to United Kingdom
            fields: ['formatted_address', 'geometry', 'name'],
          });
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            setLocation(place.formatted_address);
          });
        }
      }, 100);
    }
  }, [showModal]);

  const colors = ['#FFD966', '#D9EAD3', '#D9D2E9', '#F4CCCC']

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

  const handleFileChange = (e) => {
    setLogo(e.target.files[0])
  }

  const uploadLogoToFirebase = async (file) => {
    try {
      const storageRef = ref(storage, `logos/${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (error) {
      console.error('Error uploading logo to Firebase:', error)
      throw error
    }
  }

  const handleSave = async () => {
    try {
      let logoUrl = null
      if (logo) {
        // Upload new logo if selected
        logoUrl = await uploadLogoToFirebase(logo)
      }

      const payload = {
        name: clubName,
        location,
        ...(logoUrl && { logo: logoUrl }), // Include logo URL if a new logo was uploaded
      }

      // Update the existing venue
      const response = await new VenuApiController().updateVenue(venueId, payload)
      if (response) {
        toast.success('Site updated successfully')
        setShowModal(false)
        // Optionally, refresh dashboard data or state
      }
    } catch (error) {
      toast.error('Failed to update site.')
      console.error(error)
    }
  }


  if (loading) {
    return (
      <CContainer
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  return (
    <>
      <br />
      <div style={{ display: 'flex', alignItems: 'left', width:'100%'}}>
      {showTitle && (
      <div className="title-bold">Dashboard Overview</div>
      )}
      <div style={{ marginLeft:"10px", width: '80%', display: 'flex', justifyContent: showTitle ? 'flex-end' : 'center', position: 'relative' }}>
      <PageTopBar
        picker={true}
        startDate={startDate}
        endDate={endDate}
        setDateRange={setDateRange}
        currentPage="dashboard"
      />
      </div>
      </div>
      <br />
      {dashboardData && (
        <CContainer fluid>
          <CRow>
            <CCol xs={12}>
              <CRow>
                <CCol xs={12} md={6} className="mb-3">
                  <div className="left-box paper" style={{ border: '2px solid #E2E2E3',height: showTitle ? 'auto' : '178px',}}>
                    {/* <div className='percentage'>^ 12%</div> */}
                    {/* <CImage src={ticket_icon} height={100} width={100} /> */}
                    <div style={{ display: 'flex', alignItems: 'left', width:'100%'}}>
                    <img src={skips_soldIcon}  width="35" height="35"/>
                    <div className="title">Skips Sold</div>
                    </div>
                    <h3 className="value">{dashboardData.ticketCount ?? 0}</h3>
                  </div>
                </CCol>
                <CCol xs={12} md={6} className="mb-3">
                  <div
                    className="right-box paper"
                    style={{border: '2px solid #E2E2E3' }}
                  >
                    {/* <div className='percentage'>^ 12%</div> */}
                    {/* <CImage src={money_icon} height={100} width={100} /> */}
                    <div style={{ display: 'flex', alignItems: 'left', width:'100%'}}>
                    <img src={total_revenueIcon}  width="35" height="35"/>
                    <div className="title">Total Revenue</div>
                    </div>
                    <h3 className="value">{formatCurrency(dashboardData.totalAmount?? 0.00)}</h3>
                  </div>
                </CCol>
              </CRow>
              <div className="my-3 paper"style={{ border: '2px solid #E2E2E3'}}>
              <div style={{ display: 'flex', alignItems: 'left', width:'100%'}}>
                    <img src={chartIcon}  width="35" height="35"/>
                    <div className="title">Chart</div>
                    </div>
                <MainChart labels={label} values={value} />
              </div>
            </CCol>
            {/* <CCol xs={12} lg={4}>
            <div className='paper mx-3 mt-4 mt-lg-0'> 
              <h2>Top Customers</h2>
              <div className="ticket-table">
                <CRow className="mb-2">
                  <CCol xs={6}>Name</CCol>
                  <CCol xs={3}>Ticket</CCol>
                  <CCol xs={3}>Revenue</CCol>
                </CRow>
                {topCustomers.map((user, index) => (
                  <div key={index} className='user-list' style={{backgroundColor: `${getRandomColor()}`}}>
                    <CRow>
                      <CCol xs={6} className='user-list-item'>{user.name}</CCol>
                      <CCol xs={3} className='user-list-item'>{user.ticketCount}</CCol>
                      <CCol xs={3} className='user-list-item'>${user.totalAmount}</CCol>
                    </CRow>
                  </div>
                ))}
              </div>
            </div>
          </CCol> */}
          </CRow>
        </CContainer>
      )}
      {showModal && (
        <CModal visible={showModal} backdrop="static">
        <CModalHeader>Edit Site Information</CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormInput
                label="Club Name (Site Name)"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormInput
                label="Location"
                ref={locationInputRef} // Bind the input to Google API
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
              />
            </div>
            <div className="mb-3">
            <CFormInput
                type="file"
                label="Logo"
                accept=".jpg,.png,.gif"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            <CButton color="success" onClick={handleSave}>
              Save Changes
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>
    )}
    </>
  )
}

export default Dashboard

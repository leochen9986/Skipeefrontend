import React from 'react'
import UserHeader from '../../../components/UserHeader'
import { CButton, CCol, CContainer, CFormInput, CInputGroup, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilCheckCircle } from '@coreui/icons'
import { AuthApiController } from '../../../api/AuthApiController'
import { toast } from 'react-toastify'
import { AppFooter } from '../../../components'
import ICEDImg from 'src/assets/icon_svg/ICED.png'; 

const AboutUs = () => {
  return (
    <div className="bg-white">
      <UserHeader />

      <HeroAboutJs />

      <div className="py-5" style={{ backgroundColor: '#E9EDF2' }}>
        <CContainer>
          <CRow>
            <CCol xs="12" md="6">
              <img src="/src/assets/icon_svg/ICED.png" alt="about" width="100%" />
            </CCol>
            <CCol
              xs="12"
              md="6"
              className="mb-3 d-flex align-items-center flex-column justify-content-center"
            >
              <h2 className="fw-bold mb-3 mt-5">Intuitive Comprehensive Efficient Dashboard</h2>
              <p className="text-center">
              With user-friendly navigation, a rich suite of tools including real-time analytics, 
              attendee tracking, and seamless marketing integration, clubs can optimize attendee 
              flow and maximize revenue with ease.
              </p>
            </CCol>
          </CRow>
        </CContainer>
      </div>

      <div className="py-5">
        <CContainer>
          <CRow>
            <CCol xs="12" md="6" className="mb-3 d-flex  flex-column justify-content-center">
              <h3 className="fw-bold mb-3">
                <CIcon icon={cilCheckCircle} size="xl" className="me-2 text-success fw-bold" /> Easy
                set up
              </h3>
              <h3 className="fw-bold mb-3">
                <CIcon icon={cilCheckCircle} size="xl" className="me-2 text-success fw-bold" />{' '}
                Boost income
              </h3>
              <h3 className="fw-bold mb-3">
                <CIcon icon={cilCheckCircle} size="xl" className="me-2 text-success fw-bold" /> No
                set up or subscription cost
              </h3>
            </CCol>
            <CCol xs="12" md="6">
              <img className="rounded" src="/assets/about_3.jpeg" alt="about" width="100%" />
            </CCol>
          </CRow>
        </CContainer>
      </div>

      <div className="py-5" style={{ backgroundColor: '#E9EDF2' }}>
        <CContainer>
          <CRow>
            <CCol xs="12" md="6" className="text-center">
              <img src="/assets/about_4.png" alt="about" width="80%" />
            </CCol>
            <CCol
              xs="12"
              md="6"
              className="mb-3 d-flex align-items-center flex-column justify-content-center"
            >
              <h2 className="fw-bold mb-3">Revenue Split Pricing</h2>
              <p className="text-center">
              Experience the freedom of No minimum contract length, No cancellation fees, 
              and No setup costs. Instead benefit from a revenue share on every queue skip 
              sold, with x% going directly to you
              </p>
            </CCol>
          </CRow>
        </CContainer>
      </div>

      <AppFooter />
    </div>
  )
}

const HeroAboutJs = () => {
  const [email, setEmail] = React.useState('')
  const [organizerName, setOrganizerName] = React.useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Organizer Name:', organizerName, 'Email:', email)

    // You can add your form submit logic here
    new AuthApiController()
      .requestJoin({ email: email, organizerName: organizerName })
      .then((res) => {
        if (res.message) {
          toast.warning(res.message)
        } else {
          toast.success('Request submitted successfully')
        }
      })
  }

  return (
    <CContainer >
      <CRow className="my-5">
        <CCol xs="12" md="7" style={{ padding: '100px 40px 100px 40px' }}>
        <h2 className="fw-bold display-4">Clubs on track with fast track</h2>
          <p className="mb-5">Fill this simple form to get started with us.</p>
          <CRow>
            <CCol xs="12">
              <CInputGroup className="mb-3">
                <CFormInput
                  type="text"
                  placeholder="Organizer Name"
                  aria-label="Organizer Name"
                  aria-describedby="organizer-name"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormInput
                  type="email"
                  placeholder="Email address"
                  aria-label="Email address"
                  aria-describedby="email-address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </CInputGroup>
              <CButton color="success" onClick={handleSubmit}>
                Join Now
              </CButton>
            </CCol>
          </CRow>
        </CCol>

        <CCol
          xs="12"
          md="5"
          style={{
            padding: '100px 10px',
            backgroundImage: 'url(/assets/about_1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        ></CCol>
      </CRow>
    </CContainer>
  )
}



export default AboutUs

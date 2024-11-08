import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import ApplyForm from './views/pages/register/Appyform'
import Search from './views/pages/search/SearchPage'
import EventBooking from './views/pages/event/EventBooking'
import OrderConfirmation from './views/pages/order/OrderConfirmation'
import { AuthApiController } from './api/AuthApiController'
import PrivacyPolicy from './views/pages/privacy-and-terms/PrivacyPolicy'
import TermsAndCondition from './views/pages/privacy-and-terms/TermsAndConditions'
// import OrganizationSetup from './views/pages/register/OrganizationSetup'
import ResetPassword from './views/pages/reset-password/ResetPassword'
import { useLocation } from 'react-router-dom'
// import ViewTicket from './views/pages/view-ticket/ViewTicket'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Home = React.lazy(() => import('./views/pages/home/Home'))
const Register = React.lazy(() => import('./views/pages/login/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const ViewTicket = React.lazy(() => import('./views/pages/view-ticket/ViewTicket'))
const QrScannerPage = React.lazy(() => import('./views/pages/qr-scanner/QRScannerPage'))
const AboutUsPage = React.lazy(() => import('./views/pages/about/AboutUs'))
const ContactUsPage = React.lazy(() => import('./views/pages/contact/ContactUs'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  useEffect(() => {
    setColorMode('light')
  }, [])

  return (
    <HashRouter>
      <ScrollToTop /> {/* Add the ScrollToTop component here */}
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/" name="Home Page" element={<Home />} />
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route
            exact
            path="/reset-password/:token"
            name="Reset Password Page"
            element={<ResetPassword />}
          />
          {/* <Route exact path="/apply-now" name="Apply New Org" element={<ApplyForm />} /> */}
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route exact path="/ticket" name="View Ticket" element={<ViewTicket />} />
          <Route exact path="/home" name="Skipee | Home" element={<Home />} />
          <Route exact path="/about-us" name="Skipee | About Us" element={<AboutUsPage />} />
          <Route exact path="/contact-us" name="Skipee | Contact Us" element={<ContactUsPage />} />
          <Route exact path="/search" name="Skipee | Search" element={<Search />} />
          <Route
            exact
            path="/book-event/:eventId/:ticketId"
            name="Skipee | Book Event"
            element={<EventBooking />}
          />
          <Route
            exact
            path="/book/:ticketId"
            name="Skipee | Book Event"
            element={<OrderConfirmation />}
          />
          <Route
            exact
            path="/privacy-policy"
            name="Skipee | Privacy Policy"
            element={<PrivacyPolicy />}
          />
          <Route
            exact
            path="/terms-and-conditions"
            name="Skipee | Terms And Conditions"
            element={<TermsAndCondition />}
          />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
      <ToastContainer 
        limit={3}  // Only 3 toasts visible at a time
        autoClose={3000}  // Optional: auto-close after 5 seconds
        pauseOnHover 
      />
    </HashRouter>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default App

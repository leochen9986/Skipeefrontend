import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserHeader from '../../../components/UserHeader'
import { CarouselPrimary } from '../../carousel/CarouselPrimary'
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
} from '@coreui/react'
import { cilGraph, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { AppFooter } from '../../../components'
import logo from '../../../assets/images/logo/logo.png'
import { VenuApiController } from '../../../api/VenuApiController'
import homeBg from 'src/assets/icon_svg/home-bg.png'; 
import location_pin_blackIcon from 'src/assets/icon_svg/location_pin_black.svg'; 
import RGIcon from 'src/assets/icon_svg/RG.svg'; 
import EIIcon from 'src/assets/icon_svg/EI.svg'; 
import UFPIcon from 'src/assets/icon_svg/UFP.svg'; 
import './Home.scss'
import ContactUs,{ContactUsDiv} from 'src/views/pages/contact/ContactUs.js'; 
import { Element } from 'react-scroll';


const benefits = [
  {
    icon: <img src={RGIcon} alt="Revenue Generation" width="90" />,
    title: 'Revenue Generation',
    description:
      'Partnering with us boosts your profits through seamless, fast-track access—elevating guest experience and maximizing efficiency.',
  },
  {
    icon: <img src={EIIcon} alt="Easy Integration" width="90" />,
    title: 'Easy Intregreation',
    description:
      'Skipee integrates effortlessly with existing ticketing systems, offering a flexible solution that can serve as a dedicated fast-track platform.',
  },
  {
    icon: <img src={UFPIcon} alt="User Friendly Platform" width="90" />,
    title: 'User Friendly Platform',
    description:
      'Skipee enables clubs to seamlessly create, customize, and manage event access for all your occasions.',
  },
]

const Home = () => {

  
  const [isHomeInView, setIsHomeInView] = useState(false);
  const [isAboutInView, setIsAboutInView] = useState(false);
  const [isContactInView, setIsContactInView] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); // Add menuVisible state

  const handleScroll = () => {
    const homeSection = document.getElementById('home-section');
    const aboutSection = document.getElementById('about-section');
    const contactSection = document.getElementById('contact-section');

    if (homeSection) {
      const rect = homeSection.getBoundingClientRect();
      setIsHomeInView(rect.top <= window.innerHeight && rect.bottom >= 0);
    }
    
    if (aboutSection) {
      const rect = aboutSection.getBoundingClientRect();
      setIsAboutInView(rect.top <= window.innerHeight && rect.bottom >= 0);
    }
    
    if (contactSection) {
      const rect = contactSection.getBoundingClientRect();
      setIsContactInView(rect.top <= window.innerHeight && rect.bottom >= 0);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <UserHeader
        isHomeInView={isHomeInView}
        isAboutInView={isAboutInView}
        isContactInView={isContactInView}
        setIsAboutInView={setIsAboutInView}
        setIsContactInView={setIsContactInView}
        menuVisible={menuVisible} // Pass menuVisible state
        setMenuVisible={setMenuVisible} // Pass setter function
      />
      <div id="home-section"  style={{ paddingBottom: '100px'}}>
      <HeroSection setMenuVisible={setMenuVisible} /> {/* Pass setMenuVisible */}
        <BenefitsSection />
      </div>
        
      
        <div id="about-section" style={{ paddingTop: '100px', marginTop: '-80px' }}>
        <AboutUsDiv />
      </div>
            
        <CCol className="text-center" style={{ marginTop: '3%', marginBottom: '3%' }}>
        <div id="contact-section"  style={{ paddingTop: '80px', marginTop: '80px' }}>
          <h2 className="fw-bold display-4">
            Feel Free to <span className="highlight">Contact Us</span>
          </h2>
          <p className="text-center">
            We look forward to discussing the possibilities together. Send us a <br /> message, and we will get back to you soon.
          </p>
          </div>
        </CCol>
        <CContainer className="bg-light p-5 contact-div" style={{ marginBottom: '5%', borderRadius: '10px' }}>
          <ContactUsDiv />
        </CContainer>
      
      <AppFooter />
    </div>
  );
};

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

const HeroSection = ({ setMenuVisible }) => {
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
  
      // Get the current timestamp
      const currentTimestamp = Date.now();
  
      // Filter events based on `salesStartTime` and `salesEndTime`
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
  
      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  useEffect(() => {
    // Call getAllEvents with the search query as soon as debouncedSearch updates
    if (debouncedSearch) {
      getAllEvents({ search: debouncedSearch });
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
    } else {
      nav(`/search?siteId=${suggestion._id}`)
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url(${homeBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '280px 0',
      }}
      className="bg-body"
    >
      <CContainer>
        <h2 className="text-left fw-bold display-4 text-white">Find a location near you</h2>
        <CRow className="justify-content-left">
          <CCol md={6}>
          <div className="d-flex align-items-center"> {/* Flex container for the button */}
            <div className="input-group position-relative me-2"> {/* Wrapper for input and icon */}
              <img
                src={location_pin_blackIcon}
                alt="Location Pin"
                className="input-icon" // Add a class for styling
              />
              <CFormInput
                type="text"
                value={search}
                onFocus={() => setMenuVisible(false)}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remove "=" characters from the input
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9 ]/g, '');
                  setFilteredSuggestions([]);
                  setSearch(sanitizedValue);
                }}
                placeholder="Search Club or City"
                aria-label="Search"
                aria-describedby="button-addon2"
                className="input-with-icon"
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

const BenefitsSection = () => {
  return (
    <div className="py-5 bg-body">
      <CContainer>
        <CRow>
          {benefits.map((benefit, index) => (
            <CCol md={4} key={index} className='card-gap'>
              <CCard
                className="h-100"
                style={{
                  backgroundColor: '#E8F8EE',
                  '--bs-hover-bg': '#B7E1D2',
                  '--bs-hover-color': 'white',
                  border: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#B7E1D2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E8F8EE')}
              >
                <CCardBody className="d-flex flex-column justify-content-center">
                  <div className="d-flex align-items-center justify-content-center make-center" >
                    <div className="icon-container me-3">
                      {benefit.icon}
                    </div>
                    <CCardTitle className="fw-normal" style={{ fontSize: '2.3rem' }}>
                      {benefit.title}
                    </CCardTitle>
                  </div>
                  <CCardText className="text-center mt-3">{benefit.description}</CCardText>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </CContainer>
    </div>
  );
}



const AboutUsDiv = () => {
  return (
    <div>
      <CRow className="justify-content-center custom-row">
        <CCol className="text-center">
          <h2 className="fw-bold display-4">
            Clubs on track with <span className="highlight">fast track</span>
          </h2>
        </CCol>

        <CRow className="custom-row">
          <CCol
            md="5"
            className="custom-col mb-3 d-flex flex-column"
          >
            <div className="about-text">
              <h2 className="fw-bold mb-3 mt-5">Intuitive Comprehensive Efficient Dashboard</h2>
              <p className="text-center">
                With user-friendly navigation and a powerful suite of tools
                including real-time analytics and attendee tracking, clubs
                can effortlessly optimize guest flow and maximize revenue.
              </p>
            </div>
            <div className="about-img d-flex justify-content-center" style={{ maxWidth: '100%', height: 'auto' }}>
              <img 
                src="/src/assets/icon_svg/ICED.png" 
                alt="about"  
              />
            </div>
          </CCol>

          <CCol
            md="5"
            className="custom-col mb-3 d-flex flex-column"
          >
            <div className="about-text">
              <h2 className="fw-bold mb-3 mt-5">Revenue Split Pricing</h2>
              <p className="text-center">
                Enjoy complete flexibility—no minimum contract, no cancellation fees,
                and zero setup costs. 
              </p>
            </div>
            <div className="about-img d-flex justify-content-center" style={{ maxWidth: '100%', height: 'auto' }}>
              <img 
                src="/assets/about_4_2.png" 
                alt="about" 
              />
            </div>
          </CCol>
        </CRow>

        <div className="d-flex justify-content-center">
          <CButton
            href="/#/login"
            size="sm"
            color="success text-white"
            style={{ 
              borderRadius: '10px', 
              backgroundColor: '#1DB954', 
              padding: '1% 2% 1% 2%', 
              transition: 'background-color 0.3s ease' // Smooth transition for hover
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#17a34a'}  // Darker green on hover
            onMouseLeave={(e) => e.target.style.backgroundColor = '#1DB954'}  // Original color on leave
          >
            Start Skipping At Your Venue
          </CButton>
        </div>
      </CRow>
    </div>
  );
};


export default Home
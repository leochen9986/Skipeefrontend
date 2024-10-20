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

const benefits = [
  {
    icon: cilGraph,
    title: 'Revenue Generation',
    description:
      'Partnering with us, allows your business to generate greater profits with our comprehensive fast-track ticketing solution',
  },
  {
    icon: cilSettings,
    title: 'Easy Intregreation',
    description:
      'Skipee works alongside other ticketing companies can either be used primarily for fast track tickets or an all in one ticketing platform',
  },
  {
    icon: cilUser,
    title: 'User Friendly Platform',
    description:
      'Skipee allows clubs to easily create, customize and manage ticket sales for your events',
  },
]

const Home = () => {
  return (
    <div>
      <UserHeader />

      {/* <CarouselPrimary items={carouselItems} /> */}
      <HeroSection />

      <BenefitsSection />

      <AppFooter />
    </div>
  )
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

const HeroSection = () => {
  const [search, setSearch] = useState('')
  const [events, setEvents] = useState([])
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const nav = useNavigate()

  const debouncedSearch = useDebounce(search, 300)

  const handleSearch = () => {
    nav(`/search?search=${search}`)
  }

  const getAllEvents = () => {
    new VenuApiController().getAllEvents().then((res) => {
      if (res.message) {
        console.error(res.message)
      } else {
        setEvents(res)
      }
    })
  }

  useEffect(() => {
    getAllEvents()
  }, [])

  useEffect(() => {
    if (debouncedSearch) {
      const uniqueSuggestions = new Set()
      const filtered = events
        ?.flatMap((event) => [
          { type: 'event', name: event?.name ?? '', _id: event?._id ?? '' },
          { type: 'site', name: event?.site?.name ?? '', _id: event?.site?._id ?? '' },
        ])
        .filter((suggestion) => {
          const isUnique = !uniqueSuggestions.has(suggestion.name.toLowerCase())
          if (isUnique && suggestion.name) {
            uniqueSuggestions.add(suggestion.name.toLowerCase())
          }
          return isUnique && suggestion.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        })

      setFilteredSuggestions(filtered)
    }
  }, [debouncedSearch, events])

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
        backgroundImage: 'url(/assets/bg_home_1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '180px 0',
      }}
      className="bg-body"
    >
      <CContainer>
        <h2 className="text-center fw-bold display-4 text-dark">Find your Club</h2>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CInputGroup className="mb-3">
              <CFormInput
                type="text"
                value={search}
                onChange={(e) => {
                  setFilteredSuggestions([])
                  setSearch(e.target.value)
                }}
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
              />
              <CButton color="primary" id="button-addon2" onClick={handleSearch}>
                Search
              </CButton>
            </CInputGroup>
            {search && filteredSuggestions.length > 0 && (
              <ul className="list-group position-absolute">
                {filteredSuggestions.map((suggestion) => (
                  <li
                    key={suggestion._id + suggestion.type}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSelect(suggestion)}
                    style={{ cursor: 'pointer' }}
                  >
                    {suggestion.name} ({suggestion.type === 'site' ? 'Club' : 'Event'})
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
        <h2>
          Skip the queue with{' '}
          <span className="text-success fw-bold">
            <img src={logo} alt="logo" width="130" className="me-2" />
          </span>
        </h2>

        <div style={{ height: '40px' }} />

        <CRow>
          {benefits.map((benefit, index) => (
            <CCol md={4} key={index}>
              <CCard
                className="h-100"
                style={{
                  '--bs-hover-bg': 'green',
                  '--bs-hover-color': 'white',
                  border: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgb(214 254 225)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
              >
                <CCardBody className="d-flex flex-column justify-content-center">
                  <CIcon
                    icon={benefit.icon}
                    size="3xl"
                    className="align-self-center text-success"
                  />
                  <div className="text-center mt-3">
                    <CCardTitle className="fw-bold">{benefit.title}</CCardTitle>
                    <CCardText>{benefit.description}</CCardText>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </CContainer>
    </div>
  )
}

export default Home

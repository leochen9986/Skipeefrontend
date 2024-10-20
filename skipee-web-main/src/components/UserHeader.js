import React from 'react'
import { CButton, CContainer, CHeader, CNavLink } from '@coreui/react'
import logo from '../assets/images/logo/logo.png'

const UserHeader = () => {
  return (
    <CHeader position="sticky" className=" p-0">
      <CContainer fluid>
        <CContainer className="d-flex align-items-center justify-content-between">
          <div
            style={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <CNavLink href="/" className="d-flex align-items-center">
              <img src={logo} alt="logo" width="90" className="me-2" />
            </CNavLink>
            <div className="d-flex">
              <CNavLink
                href="/#/about-us"
                style={{ fontSize: '0.9rem' }}
                className={`d-flex align-items-center ${window.location.href.includes('about') ? 'text-success' : ''}`}
              >
                About
              </CNavLink>
              &nbsp; &nbsp;
              <CNavLink
                href="/#/contact-us"
                style={{ fontSize: '0.9rem' }}
                className={`d-flex align-items-center me-3 ${window.location.href.includes('contact') ? 'text-success' : ''}`}
              >
                Contact
              </CNavLink>
              <CButton href="/#/login" size="sm" color="success text-white">
                Manager Portal
              </CButton>
            </div>
          </div>
        </CContainer>
      </CContainer>
    </CHeader>
  )
}

export default UserHeader

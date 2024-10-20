import React, { useState } from 'react';
import { CButton, CContainer, CHeader, CNavLink } from '@coreui/react';
import logo from '../assets/images/logo/logo.png';
import './components.scss';

const UserHeader = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    
  };
  

  const handleMenuClick = () => {
    setMenuVisible(false);
  };

  return (
    <div className="user-header" >      
    <CHeader
        position="sticky"
        className="p-0"
        style={{
          border: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          position: 'fixed', width: '100%', zIndex: 1000 
        }}
      >
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
              {/* Left-aligned logo */}
              <div className="d-flex align-items-center header-logo-change"  >
                <CNavLink href="/" className="d-flex align-items-center logo-mobile" >
                  <img src={logo} alt="logo" width="90" className="me-2" />
                </CNavLink>

                {/* Mobile menu button (hamburger) */}
                <div className="menu-toggle d-md-none" onClick={toggleMenu} style={{ cursor: 'pointer', paddingLeft: '10px', alignItems: 'center' }}>
                  &#9776; {/* Unicode for hamburger icon */}
                </div>
              </div>

            {/* Center-aligned navigation (visible in desktop, hidden in mobile unless toggled) */}
            <div className={`nav-links ${menuVisible ? 'show-menu' : ''}`} style={{ flexGrow: 1 }}>
            <div

            className='header-btn-block'> 
              <div

              className='header-btn-block' > 
              <CNavLink
                href="/"
                style={{
                  fontSize: '0.9rem',
                  color: window.location.href.includes('/') && !window.location.href.includes('about') && !window.location.href.includes('contact')
                    ? '#1DB954' // Green when it's the home page
                    : 'black',  // Black otherwise
                }}
                className="d-flex header-btn" // Change to align-items-start
              >
                Home
              </CNavLink>
              &nbsp; &nbsp;
              <CNavLink
                href="/#/about-us"
                style={{ fontSize: '0.9rem' }}
                className={`d-flex header-btn ${window.location.href.includes('about') ? 'text-success' : ''}`} // Change to align-items-start
              >
                About
              </CNavLink>
              &nbsp; &nbsp;
              <CNavLink
                href="/#/contact-us"
                style={{ fontSize: '0.9rem'}}
                className={`d-flex header-btn me-3 contact ${window.location.href.includes('contact') ? 'text-success' : ''}`} // Change to align-items-start
              >
                Contact
              </CNavLink>
              &nbsp; &nbsp;
              </div>
              <CButton href="/#/login" size="sm" color="success text-white" style={{ borderRadius: '10px', backgroundColor: '#1DB954',transition: 'background-color 0.3s ease' // Smooth transition for hover
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#17a34a'}  // Darker green on hover
              onMouseLeave={(e) => e.target.style.backgroundColor = '#1DB954'} className='manager-button'>
                Manager Portal
              </CButton>
            </div>
            </div>
            </div>
          </CContainer>
        </CContainer>
      </CHeader>
    </div>
  );
};

export default UserHeader;

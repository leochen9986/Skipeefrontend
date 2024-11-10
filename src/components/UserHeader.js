import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CButton, CContainer, CHeader, CNavLink } from '@coreui/react';
import logo from '../assets/images/logo/logo.png';
import './components.scss';
import { Link as ScrollLink } from 'react-scroll';

const UserHeader = ({
  isHomeInView,
  setIsHomeInView,
  isAboutInView,
  isContactInView,
  setIsAboutInView,
  setIsContactInView,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        setIsAboutInView(rect.top <= window.innerHeight && rect.bottom >= 0);
      }

      const contactSection = document.getElementById('contact-section');
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        setIsContactInView(rect.top <= window.innerHeight && rect.bottom >= 0);
      }

      const homeSection = document.getElementById('home-section');
      if (homeSection) {
        const rect = homeSection.getBoundingClientRect();
        setIsHomeInView(rect.top <= window.innerHeight && rect.bottom >= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setIsAboutInView, setIsContactInView]);

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleMenuClick = () => {
    setMenuVisible(false);
  };

  const handleScrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="user-header">
      <CHeader
        position="sticky"
        className="p-0"
        style={{
          border: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          position: 'fixed',
          width: '100%',
          zIndex: 1000,
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
              <div className="d-flex align-items-center header-logo-change">
                <CNavLink href="/" className="d-flex align-items-center logo-mobile">
                  <img src={logo} alt="logo" width="110" className="me-2" />
                </CNavLink>

                <div
                  className="menu-toggle d-md-none"
                  onClick={toggleMenu}
                  style={{ cursor: 'pointer', paddingLeft: '10px', alignItems: 'center' }}
                >
                  &#9776;
                </div>
              </div>

              <div className={`nav-links ${menuVisible ? 'show-menu' : ''}`} style={{ flexGrow: 1 }}>
                <div className="header-btn-block">
                  <ScrollLink
                    to="home-section"
                    smooth={true}
                    duration={500}
                    onClick={() => handleScrollToSection('home-section')}
                    style={{
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      color: isHomeInView ? '#1DB954' : 'black',
                      textDecoration: 'none',
                    }}
                    className="d-flex header-btn"
                  >
                    Home
                  </ScrollLink>
                  &nbsp; &nbsp;
                  <ScrollLink
                    to="about-section"
                    smooth={true}
                    duration={500}
                    onClick={() => handleScrollToSection('about-section')}
                    style={{
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      color: isAboutInView && !isContactInView ? '#1DB954' : 'black',
                      textDecoration: 'none',
                    }}
                    className="d-flex header-btn"
                  >
                    About
                  </ScrollLink>
                  &nbsp; &nbsp;
                  <ScrollLink
                    to="contact-section"
                    smooth={true}
                    duration={500}
                    onClick={() => handleScrollToSection('contact-section')}
                    style={{
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      color: isContactInView ? '#1DB954' : 'black',
                      textDecoration: 'none',
                    }}
                    className="d-flex header-btn"
                  >
                    Contact
                  </ScrollLink>
                  &nbsp; &nbsp;
                </div>
                <CButton
                  href="/#/login"
                  size="sm"
                  color="success text-white"
                  style={{
                    borderRadius: '10px',
                    backgroundColor: '#1DB954',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#17a34a')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#1DB954')}
                  className="manager-button"
                >
                  Manager Portal
                </CButton>
              </div>
            </div>
          </CContainer>
        </CContainer>
      </CHeader>
    </div>
  );
};

export default UserHeader;
import React, { useEffect, useState } from 'react';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import { useNavigate } from 'react-router-dom';
import './DefaultLayout.css';

const DefaultLayout = () => {
  const nav = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const checkAuthentication = async () => {
    const token = localStorage.getItem('skipee_access_token');
    if (!window.location.href.includes('login') && !window.location.href.includes('register') && !token) {
      nav('/login');
    } else if (token) {
      nav('/dashboard');
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const toggleSidebarVisibility = () => {
    if (window.innerWidth <= 992) {
    setIsSidebarVisible((prevState) => !prevState);
    }
  };

  return (
    <div className="wrapper d-flex flex-column min-vh-100">
      <div className="header-container">
        <AppHeader onToggleSidebar={toggleSidebarVisibility} />
      </div>
      <div className="body d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between flex-grow-1">
          <div className={isSidebarVisible ? 'sidebar-slide' : 'sidebar-hidden'}>
            <AppSidebar isVisible={isSidebarVisible} onToggleSidebar={toggleSidebarVisibility} />
          </div>
          <div className={`content-area ${isSidebarVisible ? 'content-shifted' : ''}`} style={{ marginTop: '60px' }}>
            <AppContent />
          </div>
        </div>
      </div>
      <div className="footer-container">
      <AppFooter />
      </div>
    </div>
  );
};

export default DefaultLayout;

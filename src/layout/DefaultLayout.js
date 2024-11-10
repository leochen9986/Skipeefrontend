// DefaultLayout.js
import React, { useEffect, useState } from 'react';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import { useNavigate } from 'react-router-dom';
import './DefaultLayout.css';

const DefaultLayout = () => {
  const nav = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

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
    setIsSidebarVisible((prevState) => !prevState);
  };

  return (
    <div className="wrapper d-flex flex-column min-vh-100">
      <AppHeader onToggleSidebar={toggleSidebarVisibility} /> 
      <div className="body d-flex flex-column flex-grow-1" >
        <div className="d-flex justify-content-between flex-grow-1">
        <div style={{width:'250px'}}>
          <AppSidebar isVisible={isSidebarVisible} />
          </div>
          <div style={{width:'100%'}}>
          <AppContent/>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
};

export default DefaultLayout;

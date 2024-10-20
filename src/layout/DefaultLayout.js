import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom'

const DefaultLayout = () => {
  const nav = useNavigate()
  const checkAuthentication = async () => {
    if (window.location.href.includes('login') || window.location.href.includes('register')) {
      const token = localStorage.getItem('skipee_access_token')
      if (token) {
        nav('/dashboard')
      }
    } else {
      const token = localStorage.getItem('skipee_access_token')
      if (!token) {
        nav('/login')
      }
    }
  }
  useEffect(() => {
    checkAuthentication()
  }, [])
  return (
    <div>
      
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between">
          <AppSidebar />
          <AppContent />
        </div>
      </div>

        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout

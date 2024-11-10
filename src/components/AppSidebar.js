import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from '../assets/images/logo/logo.png'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import { AuthApiController } from '../api/AuthApiController'
import './AppSidebar.css'


const AppSidebar = ({ isVisible }) => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [profile, setProfile] = useState(null)
  const [isMobile, setIsMobile] = useState(false)


  const getProfile = () => {
    new AuthApiController()
      .getProfile()
      .then((res) => {
        setProfile(res)
      })
      .catch((err) => {
        toast.error(err.message)
        localStorage.removeItem('skipee_access_token')
        window.location.href = '${kBaseUrl}/#/home'
      })
  }

  const getFilteredNavigation = () => {
    if (!profile) return []

    return navigation.filter((navItem) => {
      if (navItem.ticketingRequired) {
        return profile.worksIn && profile.worksIn.ticketing === true
      }
      if (navItem.adminOnly) {
        return profile.role === 'admin'
      }
      return true
    })
  }

  const [sidebarWidth, setSidebarWidth] = useState('250px');

  useEffect(() => {

    if (
      localStorage.getItem('skipee_access_token') !== null &&
      localStorage.getItem('skipee_access_token') !== undefined &&
      localStorage.getItem('skipee_access_token').length > 8
    ) {
      getProfile()
    }

    
    const handleResize = () => {
      setSidebarWidth(window.innerWidth <= 992 ? (isVisible ? '250px' : '0px') : '250px');
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible]);

  // useEffect(() => {
  //   if (
  //     localStorage.getItem('skipee_access_token') !== null &&
  //     localStorage.getItem('skipee_access_token') !== undefined &&
  //     localStorage.getItem('skipee_access_token').length > 8
  //   ) {
  //     getProfile()
  //   }

  //   // Detect if the screen is in mobile mode
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth <= 992) // Change this value based on your design
  //     if (!isMobile) {
  //       setSidebarWidth('250px') // Set to normal width for desktop mode
  //     }
  //   }

  //   // Add resize event listener
  //   window.addEventListener('resize', handleResize)
  //   handleResize() // Check on mount

  //   // Cleanup event listener
  //   return () => window.removeEventListener('resize', handleResize)
  // }, [isMobile])

  return (
    <div
      className="border-end"
      colorScheme="light"
      unfoldable={unfoldable}
      style={{ width: sidebarWidth }} // Set the width of the sidebar dynamically
      visible={!isMobile || sidebarShow} // Always visible when not in mobile mode
      onVisibleChange={(visible) => {
        if (isMobile) {
          dispatch({ type: 'set', sidebarShow: visible }) // Dispatch when sidebar visibility changes on mobile
        }
      }}
    >
      <AppSidebarNav items={getFilteredNavigation()} profile={profile} />
    
    </div>
  )
}

export default React.memo(AppSidebar)
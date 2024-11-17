import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'
import logo from '../assets/images/logo/logo.png'
import navigation from '../_nav'
import { AuthApiController } from '../api/AuthApiController'
import './AppSidebar.css'

const AppSidebar = ({ isVisible,onToggleSidebar }) => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [profile, setProfile] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState('250px')
  const [sidebarMargin, setSidebarMargin] = useState('0%')

  const getProfile = () => {
    new AuthApiController()
      .getProfile()
      .then((res) => {
        setProfile(res)
      })
      .catch((err) => {
        toast.error(err.message)
        localStorage.removeItem('skipee_access_token')
        window.location.href = `${kBaseUrl}/#/home`
      })
  }

  const onNavLinkClick = () => {
    if (isMobile) {
      // setSidebarWidth('0px')
      // setSidebarMargin('-20px')
    }
  }

  const getFilteredNavigation = () => {
    if (!profile) return [];
  
    return navigation.filter((navItem) => {
      // If the nav item requires ticketing, check if the user's site has ticketing enabled
      if (navItem.ticketingRequired) {
        console.log(profile.worksIn);
        return profile.worksIn && profile.worksIn.ticketing === true;
      }
      // If the nav item is admin-only, check if the user is an admin
      if (navItem.adminOnly) {
        return profile.role === 'admin';
      }
      return true
    })
  }

  useEffect(() => {
    if (
      localStorage.getItem('skipee_access_token') !== null &&
      localStorage.getItem('skipee_access_token') !== undefined &&
      localStorage.getItem('skipee_access_token').length > 8
    ) {
      getProfile()
    }

    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setIsMobile(true)
        setSidebarWidth(isVisible ? '250px' : '0px')
        setSidebarMargin(isVisible ? '0%' : '-20px')
      } else {
        setIsMobile(false)
        setSidebarWidth('250px')
        setSidebarMargin('0%')
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [isVisible])

  return (
    <div
      className="border-end"
      colorScheme="light"
      unfoldable={unfoldable}
      style={{ width: sidebarWidth, marginLeft: sidebarMargin }} // Adjust margin and width dynamically
      visible={!isMobile || sidebarShow}
      onVisibleChange={(visible) => {
        if (isMobile) {
          dispatch({ type: 'set', sidebarShow: visible })
        }
      }}
    >
      <AppSidebarNav items={getFilteredNavigation()} profile={profile} onNavLinkClick={onToggleSidebar} />
    </div>
  )
}
export default React.memo(AppSidebar)

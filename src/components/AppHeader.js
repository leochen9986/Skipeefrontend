import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CButton,
  CImage,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilArrowBottom,
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { AuthApiController } from '../api/AuthApiController'
import { toast } from 'react-toastify'
import helpIcon from 'src/assets/icon_svg/help.svg';
import logoutIcon from 'src/assets/icon_svg/logout.svg';
import './components.scss';
import logo from '../assets/images/logo/logo.png'

const AppHeader = ({ onToggleSidebar }) => {
  const headerRef = useRef()
  const [profile, setProfile] = useState(null)
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getProfile = () => {
    new AuthApiController()
      .getProfile()
      .then((res) => {
        setProfile(res)
      })
      .catch((err) => {
        toast.error(err.message)
        localStorage.removeItem('skipee_access_token')
        window.location.href = `${kBaseUrl}/#/login`
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
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    // <CHeader position="sticky" ref={headerRef}>
    <CContainer className="border-bottom px-4 py-3 d-flex justify-content-between align-items-center" fluid style={{backgroundColor:"white"}}>
      {windowWidth <= 992 && (
        <CHeaderToggler
          onClick={onToggleSidebar}
          style={{ marginInlineStart: '-14px', padding: '0 5%' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
      )}
        <CImage src={logo} height={45} /> 
        <span className="manage-text">Manager Portal</span>
        <CHeaderNav className="d-none d-md-flex"></CHeaderNav>
        <CHeaderNav className="ms-auto">
          {/* <CNavItem>
            <CNavLink href="/#/event/create">
              <CButton color="success" style={{ color: 'white' , marginTop: '5px' }}>
                New Event &nbsp;
                <CIcon icon={cilArrowBottom} size="lg" />
              </CButton>
            </CNavLink>
          </CNavItem> */}
          {/* <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
  </li> */}
          <CNavItem>
          <CNavLink href="/#/help">
              <div className="icon-wrapper">
                <img src={helpIcon} alt="Help" width="20" height="20" />
              </div>
            </CNavLink>
          </CNavItem>
          <CNavItem className="ms-2">
          <CNavLink
            onClick={() => {
              new AuthApiController().logout();
            }}
          >
            <div className="icon-wrapper">
              <img src={logoutIcon} alt="Logout" width="20" height="20" />
            </div>
          </CNavLink>
        </CNavItem>



          {/* 
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CNavItem className="nav-item">
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem> */}
          {/* <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li> */}
        </CHeaderNav>
        
          {/* <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li> */}
          <CHeaderNav className="ms-2" >
          {profile && <AppHeaderDropdown profile={profile} />}
        </CHeaderNav>
      </CContainer>
      /* <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader> */
  )
}

export default AppHeader

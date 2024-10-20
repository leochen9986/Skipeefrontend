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
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import { AuthApiController } from '../api/AuthApiController'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [profile, setProfile] = useState(null)

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

  useEffect(() => {
    if (
      localStorage.getItem('skipee_access_token') !== null &&
      localStorage.getItem('skipee_access_token') !== undefined &&
      localStorage.getItem('skipee_access_token').length > 8
    ) {
      getProfile()
    }
  }, [])

  return (
    <CSidebar
      className="border-end"
      colorScheme="light"
      //position="fixed"
      unfoldable={unfoldable}
      //visible={sidebarShow}
      visible={true}
      // onVisibleChange={(visible) => {
      //   dispatch({ type: 'set', sidebarShow: visible })
      // }}
    >
      {/* <CSidebarHeader className="border-bottom">
        <CSidebarBrand href="/#/home" className="text-center">
          <CImage src={logo} height={82} />
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader> */}
      <AppSidebarNav items={navigation} profile={profile}/>
      {/* <CSidebarFooter style={{ background: '#1b9e3e' }} className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

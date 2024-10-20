import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CImage,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { AuthApiController } from '../../../api/AuthApiController'
import { cilLockLocked, cilLockUnlocked } from '@coreui/icons'

import loginBg from 'src/assets/images/login_image.png'
import loginLogo from 'src/assets/images/login_logo.png'

import './login.scss'
import CIcon from '@coreui/icons-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const nav = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (!email || !emailRegex.test(email)) {
      toast.warning('Please enter a valid email')
      return
    }

    if (!password) {
      toast.warning('Please enter a password')
      return
    }

    new AuthApiController().login({ email, password })
  }

  const checkAuthentication = () => {
    if (window.location.href.includes('login') || window.location.href.includes('register')) {
      const token = localStorage.getItem('skipee_access_token')

      if (token) {
        // window.location.href = 'http://localhost:3000/#/dashboard'
        nav('/dashboard')
      }
    }
  }

  const handleForgotPassword = () => {
    if (!email) {
      toast.warning('Please enter your email')
      return
    }

    toast.info('Processing your request...')

    new AuthApiController().forgotPassword({ email }).then((res) => {
      if (res.message) {
        toast.error(res.message)
      } else {
        toast.success('Password reset link has been sent to your email')
      }
    })
  }

  useEffect(() => {
    checkAuthentication()
  }, [])

  return (
    <div className="min-vh-100">
      <CRow className="m-0 p-0">
        <CCol xs={12} md={5} className="m-0 p-0 d-none d-md-block">
          <CImage fluid src={loginBg} className="bg-image" />
        </CCol>
        <CCol md={7} xs={12} className="m-0 p-0">
          <CContainer fluid className="d-flex flex-column align-items-center m-0 p-0">
            <div className="header-title mt-2">
              <h2 className="heading-text">Admin Login</h2>
            </div>
            <CImage src={loginLogo} className="logo-img" />
            <h3 className="welcome-text">Welcome back!</h3>
            <CForm className="w-75 mt-5 px-4">
              <div>
                <h3 className="input-lbl">Email</h3>
                <CFormInput
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Enter your email address"
                  autoComplete="username"
                  size="lg"
                  className="input-comp"
                />
              </div>
              <div className="mt-4">
                <div className="d-flex flex-row align-items-center h-40">
                  <h3 className="input-lbl flex-fill">Password</h3>
                  <p className="forgot-password mb-0 cursor-pointer" onClick={handleForgotPassword}>
                    Forgotten password?
                  </p>
                </div>
                <CInputGroup className="mb-4">
                  <CFormInput
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="input-comp"
                  />
                  <CInputGroupText onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                    <CIcon icon={showPassword ? cilLockUnlocked : cilLockLocked} size="sm" />
                  </CInputGroupText>
                </CInputGroup>
              </div>
              <CButton
                color="primary"
                className="signin-btn w-100 px-4 mt-5"
                onClick={handleSubmit}
              >
                Sign in
              </CButton>
              <p className="mt-2 text-start signup-text">
                Don’t have an account?{' '}
                <Link to="/register">
                  {' '}
                  <span className="text-black">Sign up</span>{' '}
                </Link>{' '}
              </p>
            </CForm>
          </CContainer>
        </CCol>
      </CRow>
    </div>
  )
}

export default Login

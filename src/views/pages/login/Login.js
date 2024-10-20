import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CForm,
  CFormInput,
  CImage,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { AuthApiController } from '../../../api/AuthApiController'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import UserHeader from '../../../components/UserHeader'
import loginBg from 'src/assets/icon_svg/SkipeeLogin.png';

import './login.scss'

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
    <div className="min-vh-100 parent-block">
      <div className="d-block d-md-none">
        <UserHeader />
      </div>
      <div className='img-block'>
        <CImage fluid src={loginBg} className="bg-image" />
      </div>
      <div className='left-container-block'>
        <div className='left-container'>
        <div className='left-container-content left-container-content-white'>
        <div className='left-container-content' style={{ marginTop: '-1%' }}>
          <div className="header-title mt-2">
            <h2 className="heading-text">Sign In</h2>
            <h3 className="welcome-text">Welcome back! Please enter your account <br /> details</h3>
          </div>
          <CForm className="w-75 mt-4 px-4">
            {/* Email Input */}
            <div style={{ marginTop: '10%' }}>
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
            {/* Password Input */}
            <div className="mt-4" style={{ marginTop: '3%' }}>
              <div className="d-flex flex-row align-items-center h-40">
                <h3 className="input-lbl flex-fill">Password</h3>
              </div>
              <div className="mb-3 position-relative">
                <CFormInput
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Password"
                  autoComplete="current-password"
                  size="lg"
                  className="input-comp"
                />
                <span
                  className="position-absolute end-0 top-50 translate-middle-y pe-3"
                  style={{ cursor: 'pointer', color: '#A6A6A9' }}  // Icon color
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
                </span>
              </div>
              <div style={{ width: '100%', textAlign: 'right' }}>
                <p className="forgot-password mb-0 cursor-pointer" onClick={handleForgotPassword}>
                  Forgotten password?
                </p>
              </div>
            </div>

            {/* Sign In Button */}
            <div style={{ marginTop: '-10%', width: '100%' }}>
              <CButton
                className="signin-btn w-100 px-4 mt-5" // width set to 100% to match the parent
                onClick={handleSubmit}
              >
                Sign In
              </CButton>
              <p className="mt-2 text-center signup-text">
                Don’t have an account?{' '}
                <Link to="/register">
                  {' '}
                  <span style={{ color: '#1DB954' }}>Request Now</span>{' '}
                </Link>{' '}
              </p>
            </div>
          </CForm>
        </div>
      </div>
              </div>
      </div>
    </div>
  )
}

export default Login




{/* <div className="min-vh-100 parent-block" >
<CRow className="m-0 p-0">
  <CCol xs={12} md={5} className="m-0 p-0 d-none d-md-block" >
    <CImage fluid src={loginBg} className="bg-image" />
  </CCol>
  <CCol md={7} xs={12} className="m-0 p-0 left-container offset-md-1">
    <div>
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
      </div>
  </CCol>
</CRow>
</div> */}
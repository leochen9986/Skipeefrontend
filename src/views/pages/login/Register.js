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
import arrowIcon from 'src/assets/icon_svg/arrow.svg';
import UserHeader from '../../../components/UserHeader'
import loginBg from 'src/assets/icon_svg/SkipeeLogin.png';

import './login.scss'

const Register = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [organizerName, setOrganisation] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const nav = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!firstName) {
      toast.warning('Please enter your first name');
      return;
    }
  
    if (!lastName) {
      toast.warning('Please enter your last name');
      return;
    }
  
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email || !emailRegex.test(email)) {
      toast.warning('Please enter a valid email');
      return;
    }
  
    if (!password) {
      toast.warning('Please enter a password');
      return;
    }
  
    const requestData = {
      name: `${firstName} ${lastName}`,
      email,
      phone,
      organizerName,
      password,
      role: 'manager',
    };
  
    // Sending join request instead of registration
    new AuthApiController()
    .requestJoin(requestData)
    .then((res) => {
      if (res.message) {
        toast.error(res.message);
      } else {
        toast.success('Join request submitted successfully. Please wait for approval.');
        nav('/dashboard');
      }
    })
    .catch((error) => {
      console.error('Error during join request:', error);
      toast.error('Failed to submit join request');
    });
  };

  const checkAuthentication = () => {
    if (window.location.href.includes('login') || window.location.href.includes('register')) {
      const token = localStorage.getItem('skipee_access_token')

      if (token) {
        nav('/dashboard')
      }
    }
  }

//   const handleForgotPassword = () => {
//     if (!email) {
//       toast.warning('Please enter your email')
//       return
//     }

//     toast.info('Processing your request...')

//     new AuthApiController().forgotPassword({ email }).then((res) => {
//       if (res.message) {
//         toast.error(res.message)
//       } else {
//         toast.success('Password reset link has been sent to your email')
//       }
//     })
//   }

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
        <div className='left-container-content left-container-content-white-re'>
        <div className='left-container-content' style={{ marginTop: '-10%' }}>
          <div className="header-title-re mt-2" >
            <h2 className="heading-text">Organiser Registration</h2>
            <h3 className="welcome-text">Register now to start using Skipee and create <br /> queue skips in just mintues</h3>
          </div>
          <CForm className="w-75 mt-5 px-4">
            {/* Email Input */}
            <div >
              <h3 className="input-lbl-re">First Name</h3>
              <CFormInput
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                placeholder="First Name"
                autoComplete="off"
                size="lg"
                className="input-comp"
              />
            </div>
            <div >
              <h3 className="input-lbl-re">Last Name</h3>
              <CFormInput
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                placeholder="Last Name"
                autoComplete="off"
                size="lg"
                className="input-comp"
              />
            </div>
            <div>
                <h3 className="input-lbl-re">Organisation Name</h3>
                <CFormInput
                  onChange={(e) => setOrganisation(e.target.value)}
                  value={organizerName}
                  placeholder="Organisation Name"
                  autoComplete="off" // Change this if needed
                  size="lg"
                  className="input-comp"
                />
              </div>
            <div >
              <h3 className="input-lbl-re">Email</h3>
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
                <h3 className="input-lbl-re">Contact Number</h3>
                <CFormInput
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  placeholder="Enter your contact number"
                  autoComplete="off" // Change this if needed
                  size="lg"
                  className="input-comp"
                />
              </div>
            
            {/* Password Input */}
            <div className="mt-4" >
              <div className="d-flex flex-row align-items-center h-40" style={{marginTop:'-5%'}}>
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
                                {/* Warning Message */}
                                {password && password.length < 8 && (
                  <div style={{marginTop: '-3%',color: 'black' }} className='forgot-password-re'> 
                    Minimum 8 characters
                  </div>

                    )}
              
            </div>

            {/* Sign In Button */}
            <div style={{ marginTop: '-13%', width: '100%' }}>
              <CButton
                className="signin-btn-re w-100 px-4 mt-5" // width set to 100% to match the parent
                onClick={handleSubmit}
              >
                Continue 
                <img style={{paddingLeft:'3%'}} src={arrowIcon}/>
              </CButton>
            </div>
          </CForm>
        </div>
      </div>
              </div>
      </div>
    </div>
  )
}

export default Register


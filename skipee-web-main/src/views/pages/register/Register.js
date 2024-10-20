import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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

import loginBg from 'src/assets/images/login_image.png'
import loginLogo from 'src/assets/images/login_logo.png'

import '../login/login.scss'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilLockUnlocked } from '@coreui/icons'

// const Register = ({ onSubmit }) => {
//   const [firstName, setFirstName] = useState('')
//   const [lastName, setLastName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const nav = useNavigate()

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     if (!firstName) {
//       toast.warning('Please enter your first name')
//       return
//     }

//     if (!lastName) {
//       toast.warning('Please enter your last name')
//       return
//     }

//     const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
//     if (!email || !emailRegex.test(email)) {
//       toast.warning('Please enter a valid email')
//       return
//     }

//     if (!password) {
//       toast.warning('Please enter a password')
//       return
//     }

//     new AuthApiController()
//       .register({ name: `${firstName} ${lastName}`, email, password, role: 'manager' })
//       .then((res) => {
//         if (res.message) {
//           toast.error(res.message)
//         } else {
//           const access_token = res.token
//           localStorage.setItem('skipee_access_token', access_token)
//           toast.success('Registration successful')
//           onSubmit()
//         }
//       })
//   }

//   const checkAuthentication = () => {
//     if (window.location.href.includes('login') || window.location.href.includes('register')) {
//       const token = localStorage.getItem('skipee_access_token')

//       if (token) {
//         nav('/dashboard')
//       }
//     }
//   }

//   useEffect(() => {
//     checkAuthentication()
//   }, [])

//   return (
//     <div className="d-flex min-vh-100 login-container">
//       <CRow className="m-0 p-0">
//         <CCol xs={12} md={5} className="m-0 p-0 d-none d-md-block">
//           <CImage fluid src={loginBg} className="bg-image" />
//         </CCol>
//         <CCol md={7} className="m-0 p-0">
//           <CContainer fluid className="d-flex flex-column align-items-center m-0 p-0">
//             {/* <div className="header-title mt-2">
//           <h2 className="heading-text">Admin Login</h2>
//         </div> */}
//             <CImage src={loginLogo} className="logo-img mt-2" />
//             <h3 className="large-heading-text mt-5 w-md-75 px-4 text-start">Register</h3>
//             <p className="text-start w-75 px-4 fira-sans-semibold">
//               Please complete to create your account
//             </p>
//             <CForm className="w-75 mt-5 px-4">
//               <div>
//                 <CFormInput
//                   onChange={(e) => setFirstName(e.target.value)}
//                   value={firstName}
//                   placeholder="First Name"
//                   autoComplete="off"
//                   size="lg"
//                   className="input-comp"
//                 />
//               </div>
//               <div className="mt-4">
//                 <CFormInput
//                   onChange={(e) => setLastName(e.target.value)}
//                   value={lastName}
//                   placeholder="Last Name"
//                   autoComplete="off"
//                   size="lg"
//                   className="input-comp"
//                 />
//               </div>
//               <div className="mt-4">
//                 <CFormInput
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   autoComplete="off"
//                   className="input-comp"
//                 />
//               </div>
//               <div className="mt-4">
//                 <CFormInput
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   autoComplete="current-password"
//                   className="input-comp"
//                 />
//                 <p className={'text-start'}>Minimum 8 characters</p>
//               </div>
//               <CButton color="primary" className="signin-btn w-100 px-4 mt-5" onClick={handleSubmit}>
//                 Continue
//               </CButton>
//               <p className="mt-2 text-start signup-text">
//                 Already have an account?{' '}
//                 <Link to="/login">
//                   <span className="text-black">Sign In</span>
//                 </Link>
//               </p>
//             </CForm>
//           </CContainer>
//         </CCol>
//       </CRow>
//     </div>
//   )
// }

const Register = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!firstName) {
      toast.warning('Please enter your first name')
      return
    }

    if (!lastName) {
      toast.warning('Please enter your last name')
      return
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (!email || !emailRegex.test(email)) {
      toast.warning('Please enter a valid email')
      return
    }

    if (!password) {
      toast.warning('Please enter a password')
      return
    }

    new AuthApiController()
      .register({ name: `${firstName} ${lastName}`, email, password, role: 'manager' })
      .then((res) => {
        if (res.message) {
          toast.error(res.message)
        } else {
          const access_token = res.token
          localStorage.setItem('skipee_access_token', access_token)
          toast.success('Registration successful')
          onSubmit()
        }
      })
  }

  const checkAuthentication = () => {
    if (window.location.href.includes('login') || window.location.href.includes('register')) {
      const token = localStorage.getItem('skipee_access_token')

      if (token) {
        nav('/dashboard')
      }
    }
  }

  useEffect(() => {
    checkAuthentication()
  }, [])

  return (
    <div>
      {/* <CRow className="m-0 p-0">
        <CCol className="m-0 p-0">
          <CContainer fluid className="d-flex flex-column align-items-center m-0 p-0">
            <div className="header-title mt-2">
          <h2 className="heading-text">Admin Login</h2>
        </div> 
            <CImage src={loginLogo} className="logo-img mt-2" />
            <h3 className="large-heading-text mt-5 w-md-75 px-4 text-start">Register</h3>
            <p className="text-start w-75 px-4 fira-sans-semibold">
              Please complete to create your account
            </p> */}

      <h1 className="logo">Skipee</h1>
      <h2 className="text-center">Register</h2>
      <p className="text-center">
        Register now to start using Skipee and creating events in just a minute.
      </p>
      <CForm className="mt-5 px-4">
        <div>
          <CFormInput
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            placeholder="First Name"
            autoComplete="off"
            size="lg"
            className="input-comp"
          />
        </div>
        <div className="mt-4">
          <CFormInput
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            placeholder="Last Name"
            autoComplete="off"
            size="lg"
            className="input-comp"
          />
        </div>
        <div className="mt-4">
          <CFormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            className="input-comp"
          />
        </div>
        <div className="mt-4">
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
          <p className={'text-start'}>Minimum 8 characters</p>
        </div>
        <CButton color="primary" className="signin-btn w-100 px-4 mt-5" onClick={handleSubmit}>
          Continue
        </CButton>
        <p className="mt-2 text-start signup-text">
          Already have an account?{' '}
          <Link to="/login">
            <span className="text-black">Sign In</span>
          </Link>
        </p>
      </CForm>
      {/* </CContainer>
        </CCol>
      </CRow> */}
    </div>
  )
}

export default Register

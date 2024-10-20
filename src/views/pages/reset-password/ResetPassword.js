import React, { useState } from 'react'
import UserHeader from '../../../components/UserHeader'
import { AppFooter } from '../../../components'
import { CButton, CContainer, CFormInput } from '@coreui/react'
import loginBg from 'src/assets/images/login_image.png'
import { toast } from 'react-toastify'
import { AuthApiController } from '../../../api/AuthApiController'
import { useNavigate, useParams } from 'react-router-dom'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { token } = useParams()
  const nav = useNavigate()
  const handleSubmit = () => {
    if (!password) {
      toast.warning('Please enter a password')
      return
    }

    if (password.length < 8) {
      toast.warning('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.warning('Passwords do not match')
      return
    }

    // You can add your form submit logic here
    new AuthApiController().resetPassword({ token: token, password: password }).then((res) => {
      if (res) {
        toast.success('Password reset successfully! Please login')
        nav('/login')
      }
    })
  }
  return (
    <div
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <UserHeader />
      <CContainer fluid md className="py-5 min-vh-100">
        <div className="apply-form text-center">
          <img
            src="https://img.icons8.com/?size=100&id=TO30mh6lm1FU&format=png&color=000000"
            alt=""
          />
          <h2 className="text-center">Reset Password</h2>
          <p className="text-center">Enter your new password</p>
          <div className="mt-4">
            <CFormInput
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Your New Password"
              autoComplete="off"
              size="lg"
              className="input-comp"
            />
          </div>
          <div className="mt-4">
            <CFormInput
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              placeholder="Confirm New Password"
              autoComplete="off"
              size="lg"
              className="input-comp"
            />
          </div>

          <CButton color="primary" className="signin-btn w-100 px-4 mt-5" onClick={handleSubmit}>
            Continue
          </CButton>
        </div>
      </CContainer>
      <AppFooter />
    </div>
  )
}

export default ResetPassword

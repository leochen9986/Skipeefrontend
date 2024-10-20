import React, { useEffect, useState } from 'react'
import { Stepper, Step, StepLabel, Button } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import Register from './Register'
import ApplyForm from './Appyform'
import { CContainer } from '@coreui/react'
import loginBg from 'src/assets/images/login_image.png'
import UserHeader from '../../../components/UserHeader'
import { AppFooter } from '../../../components'

const OrganizationSetup = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeStep, setActiveStep] = useState(
    parseInt(new URLSearchParams(location.search).get('step') || '0'),
  )

  const checkAuthentication = () => {
    if (window.location.href.includes('login') || window.location.href.includes('register')) {
      const token = localStorage.getItem('skipee_access_token')

      if (token) {
        new AuthApiController().getProfile().then((res) => {
          if (res.message) {
            toast.error(res.message)
            new AuthApiController().logout()
          } else {
            if (res && res.worksIn) {
              nav('/dashboard')
            }
          }
        })
      }
    }
  }

  const handleNext = () => {
    const nextStep = activeStep + 1
    setActiveStep(nextStep)
    navigate(`?step=${nextStep}`)
  }

  const handleBack = () => {
    const prevStep = activeStep - 1
    setActiveStep(prevStep)
    navigate(`?step=${prevStep}`)
  }

  const steps = ['Register', 'Apply']

  useEffect(() => {
    checkAuthentication()
  }, [])

  return (
    <>
      <UserHeader />
      <div
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <CContainer fluid md className="py-5">
          <div className="apply-form">
            <Stepper alternativeLabel activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && <Register onSubmit={handleNext} />}
            {activeStep === 1 && <ApplyForm onError={handleBack} />}

            {/* <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
            </Button>
            <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
            >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button> */}
          </div>
        </CContainer>
      </div>
      <AppFooter />
    </>
  )
}

export default OrganizationSetup

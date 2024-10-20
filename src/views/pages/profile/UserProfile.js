import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CAvatar,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CCardText,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibFSecure,
  cilAddressBook,
  cilCalendar,
  cilDescription,
  cilEnvelopeLetter,
  cilHouse,
  cilImagePlus,
  cilLockLocked,
  cilMoney,
  cilUser,
  cilUserFemale,
  cilUserX,
} from '@coreui/icons'
import { toast } from 'react-toastify'
import { AuthApiController } from '../../../api/AuthApiController'
import { imgdbApiKey } from '../../../assets/constants/constants'
import axios from 'axios'

const UserProfile = ({ profile }) => {
  const [validated, setValidated] = useState(false)

  const handleSubmit = (event) => {}
  return (
    <div className="bg-body-tertiary">
      <CContainer>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>User Profile</CCardHeader>
              {profile ? (
                <CCardBody className="text-center">
                  <CAvatar size="xl" shape="round" color="primary" textColor="white">
                    {profile?.name.charAt(0).toUpperCase()}
                  </CAvatar>
                  <h5 className="my-3">
                    {profile?.name} &nbsp;
                    {/* <CCardText className="mb-3"> */}
                    <CBadge color="secondary" className="ms-2">
                      <CIcon icon={cilLockLocked} className="me-2" />
                      {profile?.role}
                    </CBadge>
                    {/* </CCardText> */}
                  </h5>

                  <p className="text-muted mb-1">
                    <CIcon icon={cilEnvelopeLetter} className="me-2" />
                    {profile?.email}
                  </p>

                  <p className="text-muted mb-1">
                    <CIcon icon={cilUser} className="me-2" />
                    Gender: {profile?.gender}
                  </p>

                  <CRow className="mb-3 mt-3">
                    <CCol className="text-center">
                      <CButton
                        color="primary"
                        size="sm"
                        // onClick={() => (window.location.href = '/reset-password')}
                      >
                        Reset Password
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => new AuthApiController().logout()}
                      >
                        Logout
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardBody>
              ) : (
                <CCardBody>'Loading...'</CCardBody>
              )}
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default UserProfile

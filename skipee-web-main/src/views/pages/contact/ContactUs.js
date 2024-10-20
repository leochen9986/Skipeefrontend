import React, { useState } from 'react'
import UserHeader from '../../../components/UserHeader'
import {
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CButton,
} from '@coreui/react'
import { AppFooter } from '../../../components'
import { AuthApiController } from '../../../api/AuthApiController'
import { toast } from 'react-toastify'

const ContactUs = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [enquiry, setEnquiry] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('name:', name)
    console.log('email:', email)
    console.log('phone:', phone)
    console.log('enquiry:', enquiry)
    // You can add your form submit logic here
    let html_email_body_for_admin = `
    <b>Name:</b> ${name}<br>
    <b>Email:</b> ${email}<br>
    <b>Phone:</b> ${phone}<br>
    <b>Enquiry:</b> ${enquiry}<br>
    `

    new AuthApiController()
      .submitContactUsForm({
        html: html_email_body_for_admin,
      })
      .then((res) => {
        if (res.message) {
          toast.error(res.message)
        } else {
          toast.success('Request submitted successfully')
        }
      })
  }

  return (
    <div className="bg-white">
      <UserHeader />

      <div className="pt-5 pb-5 bg-success">
        <CContainer>
          <h1 className="text-center fw-bold mb-5 mt-5 display-4 text-white">Contact</h1>
        </CContainer>
      </div>
      <div className="text-center">
        <img src="/assets/icon_sc.png" alt="contact" width="100" className="mb-3" />
      </div>
      <div className="py-5 bg-white">
        <CContainer className="bg-light p-5">
          <CContainer fluid className="bg-light">
            <h2 className="fw-bold mb-3 text-center">Contact Us</h2>
            <p className="text-center mb-5">Will get back to you asap! </p>

            <CContainer>
              <CRow className="mb-3">
                <CCol sm={12}>
                  <CFormLabel htmlFor="name" className="col-form-label">
                    Name
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={12}>
                  <CFormLabel htmlFor="email" className="col-form-label">
                    Email
                  </CFormLabel>
                  <CFormInput
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={12}>
                  <CFormLabel htmlFor="phone" className="col-form-label">
                    Phone
                  </CFormLabel>
                  <CFormInput
                    type="tel"
                    id="phone"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={12}>
                  <CFormLabel htmlFor="enquiry" className="col-form-label">
                    What's your enquiry?
                  </CFormLabel>
                  <CFormTextarea
                    id="enquiry"
                    rows="3"
                    value={enquiry}
                    onChange={(e) => setEnquiry(e.target.value)}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={12}>
                  <CButton
                    color="success"
                    size="lg"
                    className="w-100 text-white"
                    onClick={handleSubmit}
                  >
                    Submit
                  </CButton>
                </CCol>
              </CRow>
            </CContainer>
          </CContainer>
        </CContainer>
      </div>

      <AppFooter />
    </div>
  )
}

export default ContactUs

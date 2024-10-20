import React from 'react'
import img from '../../../assets/images/logo/logo.png'
import qr from '../../../assets/images/qr.png'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CCardImage,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilLocationPin } from '@coreui/icons'

const ViewTicket = () => {
  return (
    <>
      <CContainer
        className=" justify-content-center"
        style={{
          backgroundColor: 'green',
          width: '30rem',
          borderRadius: '20px',
          borderStyle: 'solid ',
          borderColor: 'white',
        }}
      >
        <CCard
          className="m-4"
          style={{ backgroundColor: 'green', color: 'white', borderStyle: 'hidden' }}
        >
          <CCardImage
            src="https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFqJTIwbWFoYWx8ZW58MHx8MHx8fDA%3D"
            alt="Random image"
            width="30"
            height="250"
            style={{ borderRadius: '10px', backgroundColor: 'white' }}
          />

          <CCardTitle className="m-2 text-center text-bold">Taj Mahal</CCardTitle>
          <CCardText className=" text-center">
            The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river
            in the Indian city of Agra.
          </CCardText>
          <CCardText className="m-2">
            {' '}
            <CIcon icon={cilCalendar} />
            <strong> Date: 20 AUG 2023 | 10:00 AM</strong>
          </CCardText>
          <hr
            className="mb-0"
            style={{ borderTop: '3px dashed white', borderRadius: '0 0 10px 0' }}
          />
        </CCard>

        <CCard
          className="m-4"
          style={{ backgroundColor: 'green', color: 'white', borderStyle: 'hidden' }}
        >
          <CRow>
            <CCol>
              <CCardTitle className="p-0 mt-0 mb-0">
                <CIcon icon={cilLocationPin} /> Location
              </CCardTitle>
              <CCardText className="p-1 mt-0 mb-2">Agra , India</CCardText>
            </CCol>
            <CCol>
              <CCardTitle className="p-0 mt-0 mb-0"> Email</CCardTitle>
              <CCardText className="p-1 mt-0 mb-2">6zrDz@example.com</CCardText>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CCardTitle className="p-0 mt-1 mb-0">Name</CCardTitle>
              <CCardText className="p-1 mt-0 mb-2">Shubham Kumar</CCardText>
            </CCol>
            <CCol className="w-100">
              <CCardTitle className="p-0 mt-1 mb-0">Ticket Count</CCardTitle>
              <CCardText className="p-1 mt-0 mb-1">12</CCardText>
            </CCol>
          </CRow>
          <hr className="mb-0" style={{ borderTop: '3px dashed white' }} />
        </CCard>
        <CCard
          className="m-2 mt-0"
          style={{ backgroundColor: 'green', color: 'white', borderStyle: 'hidden' }}
        >
          <CCardTitle className="mt-0 text-center text-bold">
            <strong>QR Code</strong>
          </CCardTitle>
          <CCardImage
            src="https://media.istockphoto.com/id/828088276/vector/qr-code-illustration.jpg?s=612x612&w=0&k=20&c=FnA7agr57XpFi081ZT5sEmxhLytMBlK4vzdQxt8A70M="
            alt="Random image"
            style={{ marginLeft: '8rem', width: '10rem', height: '10rem' }}
          />
        </CCard>
        <CRow className="m-3">
          <CButton color="danger">
            <span className="text-white text-bold">Print</span>
          </CButton>
        </CRow>
      </CContainer>
    </>
  )
    }
export default ViewTicket

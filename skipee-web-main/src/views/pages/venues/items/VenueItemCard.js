import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import { VenuApiController } from '../../../../api/VenuApiController'
import { cilEnvelopeClosed, cilMap, cilMoney, cilPhone, cilQrCode } from '@coreui/icons'
import PopupModelBaseVenue from '../../../popup/PopupModelBaseVenue'
import QRCode from 'react-qr-code'
import { kBaseUrl } from '../../../../assets/constants/constants'
import Dashboard from '../../../dashboard/Dashboard'
import { toast } from 'react-toastify'
import searchIcon from 'src/assets/icon_svg/search.svg';
import achiveIcon from 'src/assets/icon_svg/achive.svg';
import QRIcon from 'src/assets/icon_svg/QR.svg';
import emailIcon from 'src/assets/icon_svg/email.svg';
import phoneIcon from 'src/assets/icon_svg/phone.svg';
import './VenueItemCard.scss'

const SingleVenueItem = ({ site }) => {
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupChildren, setPopupChildren] = useState(null)

  return (
    <>
    <br/>
    
    <CContainer >
      <CRow>
        <CCol >
          <CCard className="mb-4" style={{borderRadius:'10px'}}>
            {/* <CCardHeader>
              <strong>{site?.name}</strong>
            </CCardHeader>
            <CCardImage src={site?.imageVenue} className="rounded-top" /> */}
            <CCardBody>
              
              <div style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'flex-start', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
              }}>
              
                <CCardImage 
                  src={site?.logo} 
                  className="rounded-top" 
                  style={{ width: '30%',  
                    height: '150px', 
                    objectFit: 'fill' } }
                />
              
               <div >
               <div style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'flex-start', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
              }}>
               <span style={{ fontWeight: 'normal' }}>{site?.name}</span>{' '}
                    <CButton
                      onClick={() => {
                        setPopupVisible(true)
                        setPopupChildren(
                          <>
                            <div id={site?._id} className="mb-3">
                              <QRCode
                                value={`${kBaseUrl}/#/search?siteId=${site?._id}`}
                                size={256}
                                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                                viewBox={`0 0 256 256`}
                              />
                            </div>
                            <div className="d-flex align-items-center justify-content-center">
                              <CButton
                                color="primary"
                                size="sm"
                                className="d-flex align-items-center justify-content-center"
                                style={{backgroundColor:'#1DB954',border:'none'}}
                                onClick={async (e) => {
                                  e.preventDefault()
                                  const svg = document
                                    .getElementById(site?._id)
                                    .getElementsByTagName('svg')[0]
                                  const svgData = new XMLSerializer().serializeToString(svg)
                                  const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
                                  const svgUrl = URL.createObjectURL(svgBlob)
                                  const link = document.createElement('a')
                                  link.href = svgUrl
                                  link.download = `${site?.name}.svg`
                                  document.body.appendChild(link)
                                  link.click()
                                  document.body.removeChild(link)
                                  URL.revokeObjectURL(svgUrl)
                                  
                                }}
                              >
                                Download QR Code
                              </CButton>
                            </div>
                          </>,
                        )
                      }}
                    >
                       <img 
                        src={QRIcon} 
                        alt="Archive Icon" 
                        style={{ width: '20px', height: '20px', textAlign: 'center' }} 
                      />
                    </CButton>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <img 
                          src={emailIcon} 
                          alt="Archive Icon" 
                          style={{ width: '15px', height: '15px', textAlign: 'center'}} 
                        />
                    <span className="text-muted" style={{ fontSize: '14px' }}>
                      <span className="text-dark" style={{ paddingLeft:'6px'}}>{site?.email}</span>
                    </span>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                  <img 
                          src={phoneIcon} 
                          alt="Archive Icon" 
                          style={{ width: '15px', height: '15px', textAlign: 'center' }} 
                        />
                    <span className="text-muted" style={{ fontSize: '14px' }}>
                      <span className="text-dark"  style={{ paddingLeft:'6px'}}>+</span>
                      <span className="text-dark" >{site?.phone}</span>
                    </span>
                  </div>

                  {/* <div className="d-flex align-items-center mt-3">
                    <CIcon icon={cilMoney} className="text-primary me-2" />
                    <span className="text-muted" style={{ fontSize: '14px' }}>
                      Charges: {site?.percentageCommission} % + £ {site?.baseCommission} Fixed (
                      Min: £ {site?.minCommission} || Max: £ {site?.maxCommission} )
                    </span>
                  </div> */}
                  </div>
                </div>
              

              {/* <CCardText>{site?.description}</CCardText>
              <CCardText>{site?.address}</CCardText>
              <CCardText>Ticket Price: {site?.ticketPrice} JOD</CCardText> */}
            </CCardBody>
            <CCardFooter className="d-flex justify-content-end">
              <div>
              <CButton
                className="custom-button-settings" 
                color="success"
                onClick={() => {
                  setPopupChildren(<CommissionTab site={site} />)
                  setPopupVisible(true)
                }}
              >
                Setting
              </CButton>
              &nbsp;
              <CButton
                className="custom-button-analytics" 
                color="primary"
                onClick={() => {
                  setPopupChildren(<Dashboard site={site} />)
                  setPopupVisible(true)
                }}
              >
                View Analytics
              </CButton>
              &nbsp;
              <CButton
                className="custom-button-archive" 
                onClick={() => {
                  new VenuApiController().deleteSite(site?._id).then(() => {
                    window.location.reload();
                  });
                }}
              >
                <img 
                  src={achiveIcon} 
                  alt="Archive Icon" 
                  style={{ width: '20px', height: '20px', textAlign: 'center' }} 
                />
              </CButton>
              {/* &nbsp;
              <CButton color="warning" href={`/venues/${site?._id}/edit`}>
                Edit
              </CButton>
              &nbsp; */}
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>

      <PopupModelBaseVenue
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false);
        }}
        title={`${site?.name} Analytics`}
        children={(
          <Dashboard showTitle={false} />
        )}
      />

    </CContainer>
    </>
  )
}

export default SingleVenueItem

const CommissionTab = ({ site }) => {
  const [commissionSettings, setCommissionSettings] = useState({
    minCommission: site?.minCommission,
    maxCommission: site?.maxCommission,
    percentageCommission: site?.percentageCommission,
    baseCommission: site?.baseCommission,
  })

  useEffect(() => {
    setCommissionSettings({
      minCommission: site?.minCommission,
      maxCommission: site?.maxCommission,
      percentageCommission: site?.percentageCommission,
      baseCommission: site?.baseCommission,
    })
  }, [site])

  const handleCommissionChange = (e) => {
    const { name, value } = e.target
    setCommissionSettings((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }))
  }

  const saveCommissionSettings = async () => {
    // Replace this with your actual API call
    await new VenuApiController().updateStripeComission(site._id, commissionSettings)

    toast.success('Commission settings saved successfully!')

    window.location.reload()
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Stripe Commission</strong>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CInputGroup className="mb-3">
            <CInputGroupText>Min Commission (£)</CInputGroupText>
            <CFormInput
              type="number"
              name="minCommission"
              value={commissionSettings.minCommission}
              onChange={handleCommissionChange}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>Max Commission (£)</CInputGroupText>
            <CFormInput
              type="number"
              name="maxCommission"
              value={commissionSettings.maxCommission}
              onChange={handleCommissionChange}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>Percentage Commission (%)</CInputGroupText>
            <CFormInput
              type="number"
              name="percentageCommission"
              value={commissionSettings.percentageCommission}
              onChange={handleCommissionChange}
            />
          </CInputGroup>
          <CInputGroup className="mb-3">
            <CInputGroupText>Base Commission (£)</CInputGroupText>
            <CFormInput
              type="number"
              name="baseCommission"
              value={commissionSettings.baseCommission}
              onChange={handleCommissionChange}
            />
          </CInputGroup>
          <CButton color="primary" onClick={saveCommissionSettings}>
            Save Commission Settings
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

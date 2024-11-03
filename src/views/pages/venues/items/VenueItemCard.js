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
// import SettingPopUp from '../../../popup/SettingPopUp'
import PopupModelBase from '../../../popup/PopupModelBase'
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
import SettingPopUp from './SettingPopUp'

const SingleVenueItem = ({ site }) => {
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupChildren, setPopupChildren] = useState(null)
  const [popupVisibleV, setPopupVisibleV] = useState(false)
  const [popupChildrenV, setPopupChildrenV] = useState(null)
  const [popupVisibleS, setPopupVisibleS] = useState(false)
  const [popupTitle, setPopupTitle] = useState('');

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
                  style={{ width: '45%',  
                    height: '150px', 
                    objectFit: 'fill',
                  paddingRight:"10%" } }
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
                          </>
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
            <CCardFooter className="d-flex justify-content-end" style={{backgroundColor:'#EDEDEE'}}>
              <div>
              <CButton
                className="custom-button-settings" 
                color="success"
                onClick={() => {
                  setPopupTitle(`${site?.name} Settings`); 
                  setPopupVisibleS(true); // Show the popup
                }}
                // onClick={() => {
                //   setPopupChildren(<CommissionTab site={site} />)
                //   setPopupVisible(true)
                // }}
              >
                Setting
              </CButton>
              &nbsp;
              {/* <CButton
                className="custom-button-analytics" 
                color="primary"
                onClick={() => {
                  setPopupChildrenV(<Dashboard site={site} />)
                  setPopupVisibleV(true)
                }}
              >
                View Analytics
              </CButton> */}
              <CButton
                className="custom-button-analytics" 
                color="primary"
                onClick={() => {
                  setPopupTitle(`${site?.name} Analytics`);
                  setPopupChildrenV(<Dashboard showTitle={false} site={site} />); // Set the children for the Dashboard
                  setPopupVisibleV(true); // Show the popup
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
        visible={popupVisibleV}
        onClose={() => {
          setPopupVisibleV(false);
        }}
        title={popupTitle} 
        children={popupChildrenV} 
      />

      <SettingPopUp
        visible={popupVisibleS}
        onClose={() => {
          setPopupVisibleS(false);
        }}
        title={popupTitle} 
        site ={site}
      />

      <PopupModelBase
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false);
        }}
        // title={`${site?.name}'s QR`}
        children={popupChildren}

      />

    </CContainer>
    </>
  )
}

export default SingleVenueItem

const CommissionTab = ({ site }) => {
  const [commissionSettings, setCommissionSettings] = useState({
    minCommission: site?.minCommission || 0,
    maxCommission: site?.maxCommission || 0,
    percentageCommission: site?.percentageCommission || 0,
    baseCommission: site?.baseCommission || 0,
  });

  useEffect(() => {
    // Update the commission settings when the `site` prop changes
    if (site) {
      setCommissionSettings({
        minCommission: site.minCommission,
        maxCommission: site.maxCommission,
        percentageCommission: site.percentageCommission,
        baseCommission: site.baseCommission,
      });
    }
  }, [site]);

  const handleCommissionChange = (e) => {
    const { name, value } = e.target;
    setCommissionSettings((prevSettings) => ({
      ...prevSettings,
      [name]: parseFloat(value),
    }));
  };
  const saveCommissionSettings = async () => {
      // try {
      //   await new VenuApiController().updateStripeComission(site._id, commissionSettings);
      //   toast.success('Commission settings saved successfully!');
      //   window.location.reload();
      // } catch (error) {
      //   console.error('Failed to save commission settings', error);
      //   toast.error('Failed to save commission settings');
      console.log("okayu");
    // }
  };

  return (
    <>    
    <CCard>
      <CCardHeader>
        <strong>{site?.name} Settings</strong>
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
        </CForm>
      </CCardBody>
      <CCardFooter>
        <CButton color="primary" onClick={saveCommissionSettings}>
          Save Settings
        </CButton>
      </CCardFooter>
    </CCard>
    </>

  )
}

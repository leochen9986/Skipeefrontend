import React, { useEffect, useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
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
} from '@coreui/react';
import { VenuApiController } from '../../../../api/VenuApiController';
import PopupModelBaseVenue from '../../../popup/PopupModelBaseVenue';
import PopupModelBase from '../../../popup/PopupModelBase';
import QRCode from 'react-qr-code';
import { kBaseUrl } from '../../../../assets/constants/constants';
import Dashboard from '../../../dashboard/Dashboard';
import { toast } from 'react-toastify';
import achiveIcon from 'src/assets/icon_svg/achive.svg';
import QRIcon from 'src/assets/icon_svg/QR.svg';
import emailIcon from 'src/assets/icon_svg/email.svg';
import phoneIcon from 'src/assets/icon_svg/phone.svg';
import './VenueItemCard.scss';
import SettingPopUp from './SettingPopUp';

const SingleVenueItem = ({ site }) => {
  console.log(site);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupChildren, setPopupChildren] = useState(null);
  const [popupVisibleV, setPopupVisibleV] = useState(false);
  const [popupChildrenV, setPopupChildrenV] = useState(null);
  const [popupVisibleS, setPopupVisibleS] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleArchiveSite = () => {
    new VenuApiController()
      .archiveSite(site?._id)
      .then(() => {
        toast.success('Site archived successfully!');
        setShowConfirmModal(false); // Close the modal
        window.location.reload();
      })
      .catch((err) => {
        console.error('Failed to archive site', err);
        toast.error('Failed to archive site');
        setShowConfirmModal(false); // Close the modal even on error
      });
  };

  return (
    <>
      <br />

      <CContainer>
        <CRow>
          <CCol>
            <CCard className="mb-4" style={{ borderRadius: '10px' }}>
              <CCardBody>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <CCardImage
                    src={site?.logo}
                    className="rounded-top"
                    style={{
                      width: '45%',
                      height: '150px',
                      objectFit: 'fill',
                      paddingRight: '10%',
                    }}
                  />

                  <div>
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontWeight: 'normal' }}>{site?.name}</span>{' '}
                      <CButton
                        onClick={() => {
                          setPopupVisible(true);
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
                                  style={{ backgroundColor: '#1DB954', border: 'none' }}
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    const svg = document
                                      .getElementById(site?._id)
                                      .getElementsByTagName('svg')[0];
                                    const svgData = new XMLSerializer().serializeToString(svg);
                                    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
                                    const svgUrl = URL.createObjectURL(svgBlob);
                                    const link = document.createElement('a');
                                    link.href = svgUrl;
                                    link.download = `${site?.name}.svg`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    URL.revokeObjectURL(svgUrl);
                                  }}
                                >
                                  Download QR Code
                                </CButton>
                              </div>
                            </>
                          );
                        }}
                      >
                        <img
                          src={QRIcon}
                          alt="QR Icon"
                          style={{ width: '20px', height: '20px', textAlign: 'center' }}
                        />
                      </CButton>
                    </div>
                    <div className="d-flex align-items-center mt-3">
                      <img
                        src={emailIcon}
                        alt="Email Icon"
                        style={{ width: '15px', height: '15px', textAlign: 'center' }}
                      />
                      <span className="text-muted" style={{ fontSize: '14px', paddingLeft: '6px' }}>
                        {site?.email}
                      </span>
                    </div>
                    <div className="d-flex align-items-center mt-3">
                      <img
                        src={phoneIcon}
                        alt="Phone Icon"
                        style={{ width: '15px', height: '15px', textAlign: 'center' }}
                      />
                      <span className="text-muted" style={{ fontSize: '14px', paddingLeft: '6px' }}>
                        +{site?.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </CCardBody>
              <CCardFooter className="card-footer">
  <CButton
    className="custom-button-settings"
    onClick={() => {
      setPopupTitle(`${site?.name} Settings`);
      setPopupVisibleS(true);
    }}
  >
    Setting
  </CButton>
  <CButton
    className="custom-button-analytics"
    onClick={() => {
      setPopupTitle(`${site?.name} Analytics`);
      setPopupChildrenV(<Dashboard showTitle={false} site={site} />);
      setPopupVisibleV(true);
    }}
  >
    View Analytics
  </CButton>
  <CButton
    className="custom-button-archive"
    onClick={() => setShowConfirmModal(true)}
  >
    <img
      src={achiveIcon}
      alt="Archive Icon"
      style={{ width: '20px', height: '20px' }}
    />
  </CButton>
</CCardFooter>
            </CCard>
          </CCol>
        </CRow>

        {/* Confirmation Modal */}
        <CModal
          visible={showConfirmModal} // Use 'visible' instead of 'show'
          onClose={() => setShowConfirmModal(false)}
          color="warning"
        >
          <CModalHeader closeButton>
            <CModalTitle>Confirm Archive</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Are you sure you want to archive the site <strong>{site?.name}</strong>?
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </CButton>
            <CButton color="warning" onClick={handleArchiveSite}>
              Yes, Archive
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Other Popups */}
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
          site={site}
        />

        <PopupModelBase
          visible={popupVisible}
          onClose={() => {
            setPopupVisible(false);
          }}
          children={popupChildren}
        />
      </CContainer>
    </>
  );
};

export default SingleVenueItem;

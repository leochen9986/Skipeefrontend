import React, { useEffect, useState } from 'react';
import {
  CButton,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';
import './SettingPopUp.scss';
import { VenuApiController } from '../../../../api/VenuApiController';
import { toast } from 'react-toastify';

const SettingPopUp = ({ visible, onClose, title, site }) => {
  const [commissionSettings, setCommissionSettings] = useState({
    minCommission: 0,
    maxCommission: 0,
    percentageCommission: 0,
    baseCommission: 0,
  });

  const [skipping, setSkipping] = useState(false);
  const [ticketing, setTicketing] = useState(false);

  useEffect(() => {
    if (site) {
      setCommissionSettings({
        minCommission: site?.minCommission || 0,
        maxCommission: site?.maxCommission || 0,
        percentageCommission: site?.percentageCommission || 0,
        baseCommission: site?.baseCommission || 0,
      });

      // Initialize skipping and ticketing values based on site data (if available)
      setSkipping(site?.skipping || false);
      setTicketing(site?.ticketing || false);
    }
  }, [site]);

  const handleCommissionChange = (e) => {
    const { name, value } = e.target;
    setCommissionSettings((prevSettings) => ({
      ...prevSettings,
      [name]: parseFloat(value),
    }));
  };

  const saveSettings = async () => {
    if (!site || !site._id) {
      console.log(site);
      console.error('Site or site._id is undefined');
      toast.error('Unable to save settings. Site information is missing.');
      return;
    }
  
    try {
      const updatedSettings = {
        ...commissionSettings,
        skipping,
        ticketing,
      };
      
      await new VenuApiController().updateStripeComission(site._id, updatedSettings);
      toast.success('Settings saved successfully!');
      // window.location.reload(); // Reload the page or update the state as needed
    } catch (error) {
      console.error('Failed to save settings', error);
      toast.error('Failed to save settings');
    }
  };

  return (
    <CModal visible={visible} onClose={onClose} size='lg'>
      <CModalHeader>
        <CModalTitle className='modal-title-venue'>{title ? title : ''}</CModalTitle>
      </CModalHeader>
      <CModalBody className="p-3 ">
        <div>
          <strong>Permission</strong>
          <div className="settings-container">
            {/* Skipping Row */}
            <div className="setting-row">
              <h3 className="setting-label">Skipping</h3>
              <label className="toggle-container">
                <input
                  type="checkbox"
                  checked={skipping}
                  onChange={() => setSkipping(!skipping)}
                  className="toggle-input"
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* Ticketing Row */}
            <div className="setting-row">
              <h3 className="setting-label">Ticketing</h3>
              <label className="toggle-container">
                <input
                  type="checkbox"
                  checked={ticketing}
                  onChange={() => setTicketing(!ticketing)}
                  className="toggle-input"
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div style={{ padding: '16px 16px 16px 0px' }}>
            <strong>Commission Structure</strong>
          </div>
          <div className="mb-3">
            <h3 className="setting-label">Min Commission (£)</h3>
            <CFormInput
              type="number"
              name="minCommission"
              value={commissionSettings.minCommission}
              onChange={handleCommissionChange}
              placeholder="0"
              size="lg"
              className="setting-input"
            />
          </div>
          <div className="mb-3">
            <h3 className="setting-label">Max Commission (£)</h3>
            <CFormInput
              type="number"
              name="maxCommission"
              value={commissionSettings.maxCommission}
              onChange={handleCommissionChange}
              placeholder="0"
              size="lg"
              className="setting-input"
            />
          </div>
          <div className="mb-3">
            <h3 className="setting-label">Percentage Commission (%)</h3>
            <CFormInput
              type="number"
              name="percentageCommission"
              value={commissionSettings.percentageCommission}
              onChange={handleCommissionChange}
              placeholder="0"
              size="lg"
              className="setting-input"
            />
          </div>
          <div className="mb-3">
            <h3 className="setting-label">Base Commission (£)</h3>
            <CFormInput
              type="number"
              name="baseCommission"
              value={commissionSettings.baseCommission}
              onChange={handleCommissionChange}
              placeholder="0"
              size="lg"
              className="setting-input"
            />
          </div>
        </div>
      </CModalBody>
      <CModalFooter style={{ backgroundColor: '#EDEDEE' }}>
        <CButton className="save-settings-btn" onClick={saveSettings}>
          Save Settings
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default SettingPopUp;

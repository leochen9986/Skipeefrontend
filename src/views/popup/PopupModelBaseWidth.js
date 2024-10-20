import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import React from 'react';

const PopupModelBaseWidth = ({ visible, onClose, title, children }) => {
  return (
    <CModal visible={visible} onClose={onClose} size="xl"> {/* Set size to 'xl' for extra large */}
      <CModalHeader className='modal-header-acc' onClose={onClose}>
        <CModalTitle className='modal-title-acc-skp' id="LiveDemoExampleLabel">{title ? title : ''}</CModalTitle>
      </CModalHeader>
      <CModalBody className="p-3" >{children}</CModalBody>
    </CModal>
  );
};

export default PopupModelBaseWidth;

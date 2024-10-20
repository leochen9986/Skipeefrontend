import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import React from 'react'

const PopupModelBaseVenue = ({ visible, onClose, title, children }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader onClose={() => setVisible(false)} >
        <CModalTitle className='modal-title-venue' id="LiveDemoExampleLabel">{title ? title : ''}</CModalTitle>
      </CModalHeader>
      <CModalBody className="p-3 ">{children}</CModalBody>
    </CModal>
  )
}

export default PopupModelBaseVenue

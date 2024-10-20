import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React from 'react'

const PopupModelBaseVenue = ({ visible, onClose, title, children }) => {
  return (
    <CModal visible={visible} onClose={onClose} size='l'>
      <CModalHeader onClose={() => setVisiblev(false)} >
        <CModalTitle className='modal-title-venue' id="LiveDemoExampleLabel">{title ? title : ''}</CModalTitle>
      </CModalHeader>
      <CModalBody className="p-3 ">{children}</CModalBody>
    </CModal>
  )
}

export default PopupModelBaseVenue

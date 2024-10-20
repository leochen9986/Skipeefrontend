import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import React from 'react'

const PopupModelBase = ({ visible, onClose, title, children }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader className='modal-header-acc' onClose={() => setVisible(false)} >
        <CModalTitle className='modal-title-acc' id="LiveDemoExampleLabel">{title ? title : ''}</CModalTitle>
      </CModalHeader>
      <CModalBody className="p-3">{children}</CModalBody>
    </CModal>
  )
}

export default PopupModelBase

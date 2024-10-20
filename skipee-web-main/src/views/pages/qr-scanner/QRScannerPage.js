import React from 'react'
import UserHeader from '../../../components/UserHeader'
import { CContainer } from '@coreui/react'
import { QrScanner } from '@yudiel/react-qr-scanner'
import { toast } from 'react-toastify'

const QRScannerPage = () => {
  return (
    <>
      <UserHeader />

      <CContainer xxl>
        <QrScanner
          onDecode={(result) => toast.success(result)}
          onError={(error) => toast.error(error?.message)}
        />
      </CContainer>
    </>
  )
}

export default QRScannerPage

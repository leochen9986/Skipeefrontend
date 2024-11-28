import React from 'react'
import { CContainer, CFooter } from '@coreui/react'
import { useNavigate } from 'react-router-dom'


const AppFooter = () => {
  return (
    <CFooter className="app-footer " style={{backgroundColor:'#1DB954'}}>
      <CContainer className="d-flex space-between">
        <div>
          <a href="#" target="_blank" rel="noopener noreferrer">
            Skipee
          </a>
          <span className="ms-1">&copy; 2024. All Rights Reserved</span>
        </div>
        <div className="ms-auto">
          <a href="#/privacy-policy" rel="noopener noreferrer" style={{color:'white'}}>
            Privacy Policy
          </a>
          <span className="mx-1">&middot;</span>
          <a href="#/terms-and-conditions" rel="noopener noreferrer" style={{color:'white'}}>
            {' '}
            Terms &amp; Conditions
          </a>
        </div>
      </CContainer>
    </CFooter>
  )
}

export default React.memo(AppFooter)

import React, { useEffect, useState } from 'react'
import {
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CFormInput,
  CTabs,
  CTabPanel,
  CTabContent,
  CTabList,
  CTab,  
} from '@coreui/react'
import { toast } from 'react-toastify'
import { VenuApiController } from '../../../api/VenuApiController'
import SingleVenueItem from './items/VenueItemCard'
import { AuthApiController } from '../../../api/AuthApiController'

const ListVenues = () => {
  const [sites, setSites] = useState([])
  const [profile, setProfile] = useState(null)
  
  useEffect(() => {
    new AuthApiController().getProfile().then((res) => {
      if (res.message) {
        toast.error(res.message)
        new AuthApiController().logout()
      } else {
        if (res && !res.worksIn) {
          nav('/apply-now')
        }
        console.log('account page', res)
        setProfile(res)
      }
    })
    
  }, [])

  const getAllSites = async () => {
    new VenuApiController()
      .getAllSites()
      .then((res) => {
        setSites(res)
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.response.data.message)
      })
  }

  useEffect(() => {
    getAllSites()
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '20px', backgroundColor: 'white' }}>
        <div className='title-bold'>Manage Venue</div>
        <div style={{ display: 'flex', alignItems: 'right', justifyContent: 'flex-end', gap: '20px', width: '100%' }}>
          <div style={{ position: 'relative', width: '40%' }}>
            <CFormInput
              type="text"
              style={{
                backgroundColor: '#EDEDEE',
                border: 'none',
                borderRadius: '50px',
                color: '#909094',
                paddingLeft: '3%',
                paddingRight: '40px',
                height: '40px',
                width: '100%',
                fontSize: '15px',
                fontWeight: '500',
              }}
              placeholder="Search by Name"
              autoComplete="off"
              className="input-comp custom-search-icon"
            />
          </div>
        </div>
      </div>
      <div className="py-5 mb-5 paper">
        <CTabs activeItemKey={1}>
          <CTabList variant="underline-border" color="success">
            <CTab aria-controls="all-events-pane" itemKey={1} className='tab-color'>
              Active
            </CTab>
            <CTab aria-controls="upcoming-tab-pane" itemKey={2} className='tab-color'>
              Archived
            </CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel className="py-3" aria-labelledby="all-events-pane" itemKey={1} >
              <ActiveTab sites={sites} profile={profile} />
            </CTabPanel>
            <CTabPanel className="py-3" aria-labelledby="upcoming-tab-pane" itemKey={2}>
              {/* <AdminAccountTab siteId={profile?.worksIn?._id} /> */}
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </div>
    </div>
  )
}

const ActiveTab = ({ sites, profile }) => {
  return (
    <CContainer >
      <CRow xs={12}>
        <CCol>
        <CCardBody>
          <div style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'flex-start', 
                alignItems: 'flex-start', 
                flexWrap: 'wrap', 
              }}>
            {sites && sites.length > 0 ? (
              sites.map((site) => {
                return (
                  <div
                    key={site._id}
                    style={{ 
                      flex: '0 0 auto', // Prevents flex items from growing/shrinking 
                      margin: '0', 
                      padding: '0' ,
                      width:'50%'
                    }}
                  >
                    <SingleVenueItem site={site} />
                  </div>
                );
              })
            ) : (
              <div>No venues available.</div>
            )}
          </div>
        </CCardBody>
        </CCol>
      </CRow>
    </CContainer>
    
  )
}

export default ListVenues

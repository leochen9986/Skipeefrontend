import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CImage,
  CSpinner,
  CFormSelect,
  CFormInput,
} from '@coreui/react'
import { DashboardApiController } from '../../../api/DashboardApiController'
import { toast } from 'react-toastify'
import searchIcon from 'src/assets/icon_svg/search.svg';
import dropdown_sortIcon from 'src/assets/icon_svg/dropdown_sort.svg';
import PageTopBar from '../../../components/PageTopBar'
import './AllReportsPage.scss'

const IncidentReportsPage = ({ profile }) => {
  const [incidentReports, setIncidentReports] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch incident reports from the server
    if (profile) fetchIncidentReports()
  }, [profile])



  const fetchIncidentReports = () => {
    const filter = {}
    if (profile.role !== 'admin') filter['siteId'] = profile.worksIn._id
    // console.log(profile)
    setLoading(true)
    // Replace with your API call to fetch the incident reports
    new DashboardApiController().getReportsData(filter).then((res) => {
      if (res.message) {
        toast.error(res.message)
      } else {
        setIncidentReports(res)
      }
      setLoading(false)
    })
    // setIncidentReports([
    //   {
    //     _id: '66b4bc7b1cd3e160a59dc44c',
    //     reportedBy: {
    //       _id: '667bc4c1c131ed352b54f70d',
    //       name: 'John Doe',
    //       email: 'testuser@gmail.com',
    //       role: 'admin',
    //       isActive: true,
    //       lastSeen: '2024-08-08T12:09:49.848Z',
    //       gender: 'male',
    //       createdAt: '2024-06-26T07:35:29.187Z',
    //       updatedAt: '2024-08-08T12:09:49.849Z',
    //       birthDate: '2000-07-09T09:38:43.785Z',
    //       worksIn: '667bea6dabe4af6e8a3412a6',
    //     },
    //     incidentDate: '2024-06-26T07:35:29.187Z',
    //     description: 'Someone got injured while dancing in the club.',
    //     site: {
    //       _id: '667bea6dabe4af6e8a3412a6',
    //       name: 'Moon DG club',
    //       email: 'manager@moondg.club',
    //       phone: '9234567890',
    //       logo: 'https://img.freepik.com/premium-vector/night-club-neon-signs-style-text-vector_118419-3603.jpg',
    //       owner: '667bc4c1c131ed352b54f70d',
    //       createdAt: '2024-06-26T10:16:13.064Z',
    //       updatedAt: '2024-06-28T09:05:41.458Z',
    //       approved: true,
    //     },
    //     investigationNotes: 'string',
    //     createdAt: '2024-08-08T12:39:23.596Z',
    //     updatedAt: '2024-08-08T12:39:23.596Z',
    //   },
    // ]);
  }

  if (loading)
    return (
      <>
        <div className="d-flex justify-content-center align-item-center">
          <CSpinner />
        </div>
      </>
    )

  return (
    <>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start',padding:'20px'}}>
        <div className='title-bold'>Incident Reports</div>
        <div style={{ display: 'flex', alignItems: 'right', justifyContent: 'flex-end', gap:'20px',width: '100%' }}>
        
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
          // value={searchQuery}
          // onChange={handleSearchChange}
          autoComplete="off"
          className="input-comp custom-search-icon"
        />
      </div>

      {/* Sort Dropdown */}
      <div style={{ width: '10%', position: 'relative' }}> 
      <CFormSelect
        style={{
          backgroundColor: '#EDEDEE',
          border: 'none',
          borderRadius: '50px',
          color: '#909094',
          paddingLeft: '10%', 
          paddingRight: '30px', 
          height: '40px',
          width: '100%',
          fontSize: '15px',
          fontWeight: '500',
          appearance: 'none',
        }}
        aria-label="Sort"
        className="input-comp custom-select-icon"
      >
        <option value="">Sort</option>
        <option value="nameAsc">Name (A-Z)</option>
        <option value="nameDesc">Name (Z-A)</option>
        <option value="dateAsc">Date (Oldest First)</option>
        <option value="dateDesc">Date (Newest First)</option>
      </CFormSelect>
        
      </div>



        <PageTopBar
        // startDate={startDate}
        // endDate={endDate}
        // setDateRange={setDateRange}
        picker={true}
        currentPage="orders"
        
      />
      </div>
      </div>
    <CContainer>
      <CRow>
        
          
            
              {incidentReports.length === 0 && !loading && <p>No incident reports found.</p>}
              {incidentReports.map((report) => (
                 <CCol md={6} key={report._id}>
                <CCard key={report._id} className="mb-3">
                  <CCardHeader>
                  <strong>Incident Date:</strong> {new Date(report.incidentDate).toLocaleDateString()} at {new Date(report.incidentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol md={3} className='card-label'>
                        <strong>Reported By</strong>
                      </CCol>
                      </CRow>
                      <CRow>
                      <CCol md={9} className='card-content'>
                        {report.reportedBy?.name} ({report.reportedBy?.email},{' '}
                        {report.reportedBy?.role})
                      </CCol>
                    </CRow>
                    {/* <CRow>
                      <CCol md={3}>
                        <strong>Last Seen:</strong>
                      </CCol>
                      <CCol md={9}>{new Date(report.reportedBy?.lastSeen).toLocaleString()}</CCol>
                    </CRow> */}
                    <CRow>
                      <CCol md={3} className='card-label'>
                        <strong>Site</strong>
                      </CCol >
                      </CRow>
                      <CRow>
                      <CCol md={9} className='card-content'>{report.site?.name}</CCol>
                      <CCol md={9}>
                        <CImage src={report.site?.logo} alt={report.site?.name} width={100} />
                      </CCol>
                    </CRow>
                    {/* <CRow>
                      <CCol md={3}>
                        <strong>Site Logo:</strong>
                      </CCol>
                      <CCol md={9}>
                        <CImage src={report.site?.logo} alt={report.site?.name} width={100} />
                      </CCol>
                    </CRow> */}
                    <CRow>
                      <CCol md={3}  className='card-label'>
                        <strong>Site Email</strong>
                      </CCol>
                      </CRow>
                      <CRow>
                      <CCol md={9}className='card-content'>{report.site?.email}</CCol>
                    </CRow>
                    <CRow>
                      <CCol md={3}  className='card-label'>
                        <strong>Site Phone</strong>
                      </CCol>
                      </CRow>
                      <CRow>
                      <CCol md={9}className='card-content'>{report.site?.phone}</CCol>
                    </CRow>
                    <CRow>
                      <CCol md={3} className='card-label'>
                        <strong>Description</strong>
                      </CCol>
                      </CRow>
                      <CRow>
                      <CCol md={9}className='card-content'>{report.description}</CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
                </CCol>
              ))}
            
          
        
      </CRow>
    </CContainer>
    </>
  )
}

export default IncidentReportsPage

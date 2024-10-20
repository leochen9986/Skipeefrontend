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
  CTabs,
  CTabPanel,
  CTabContent,
  CTabList,
  CTab, 
  CButton ,
} from '@coreui/react'
import Select from 'react-select';
import { DashboardApiController } from '../../../api/DashboardApiController'
import { toast } from 'react-toastify'
import searchIcon from 'src/assets/icon_svg/search.svg';
import dropdown_sortIcon from 'src/assets/icon_svg/dropdown_sort.svg';
import PageTopBar from '../../../components/PageTopBar'

const STPage = ({ profile }) => {
  const [tabs, setTabs] = useState([
    { key: 1, label: 'Active', content: <div>Active Content</div> },
    { key: 2, label: 'Archived', content: <div>Archived Content</div> }
  ]);
  const [activeTab, setActiveTab] = useState(1);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  // Fetch countries from API
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        const countryOptions = data.map((country) => ({
          value: country.cca2,
          label: country.name.common,
        }));
        setCountries(countryOptions);
      });
  }, []);

  // Fetch states dynamically based on selected country
  const fetchStates = (countryCode) => {
    // Example: using GeoDB Cities API for states
    fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${countryCode}/regions`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Replace with your actual API key
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      const stateOptions = data.data.map((state) => ({
        value: state.isoCode,
        label: state.name,
      }));
      setStates(stateOptions);
    });
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);  // Reset state when country changes
    fetchStates(selectedOption.value);  // Fetch states for the selected country
  };

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
  };

  const addNewTab = () => {
    if (selectedCountry && selectedState) {
      const newKey = tabs.length + 1;
      const newTab = {
        key: newKey,
        label: `${selectedState.label}, ${selectedCountry.label}`,
        content: <div>Content for {selectedState.label}, {selectedCountry.label}</div>
      };
      setTabs([...tabs, newTab]);
      setActiveTab(newKey);
      setSelectedCountry(null);
      setSelectedState(null);
    }
  }

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
    setLoading(true)
    new DashboardApiController().getReportsData(filter).then((res) => {
      if (res.message) {
        toast.error(res.message)
      } else {
        setIncidentReports(res)
      }
      setLoading(false)
    })
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
        <div className='title-bold'>Skipping</div>
        <div style={{ display: 'flex', alignItems: 'right', justifyContent: 'flex-end', gap:'20px',width: '100%' }}>
        
      <PageTopBar
        picker={true}
        // startDate={startDate}
        // endDate={endDate}
        // setDateRange={setDateRange}
        currentPage="dashboard"
      />
      </div>
      </div>

      <div>
      <div style={{ marginBottom: '20px' }}>
        <Select
          value={selectedCountry}
          onChange={handleCountryChange}
          options={countries}
          placeholder="Select Country"
        />

        <Select
          value={selectedState}
          onChange={handleStateChange}
          options={states}
          placeholder="Select State"
          isDisabled={!selectedCountry}
          style={{ marginLeft: '10px' }}
        />

        <CButton
          color="success"
          onClick={addNewTab}
          className="ml-3"
          disabled={!selectedCountry || !selectedState}
        >
          Add Tab
        </CButton>
      </div>

      <CTabs activeItemKey={activeTab} onActiveTabChange={setActiveTab}>
        <CTabList variant="underline-border" color="success">
          {tabs.map((tab) => (
            <CTab
              key={tab.key}
              aria-controls={`tab-pane-${tab.key}`}
              itemKey={tab.key}
              className='tab-color'
            >
              {tab.label}
            </CTab>
          ))}
        </CTabList>

        <CTabContent>
          {tabs.map((tab) => (
            <CTabPanel
              key={tab.key}
              className="py-3"
              aria-labelledby={`tab-pane-${tab.key}`}
              itemKey={tab.key}
            >
              {tab.content}
            </CTabPanel>
          ))}
        </CTabContent>
      </CTabs>
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


const ActiveTab = ({ profile }) => {
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
          </div>
        </CCardBody>
        </CCol>
      </CRow>
    </CContainer>
    
  )
}

export default STPage

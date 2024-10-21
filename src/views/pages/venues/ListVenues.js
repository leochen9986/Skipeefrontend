import React, { useEffect, useState } from 'react';
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
} from '@coreui/react';
import { toast } from 'react-toastify';
import { VenuApiController } from '../../../api/VenuApiController';
import SingleVenueItem from './items/VenueItemCard';
import { AuthApiController } from '../../../api/AuthApiController';

const ListVenues = () => {
  const [sites, setSites] = useState([]);
  const [archivedSites, setArchivedSites] = useState([]); // State for archived sites
  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [activeTab, setActiveTab] = useState('1'); // Use strings for itemKey

  useEffect(() => {
    new AuthApiController().getProfile().then((res) => {
      if (res.message) {
        toast.error(res.message);
        new AuthApiController().logout();
      } else {
        if (res && !res.worksIn) {
          nav('/apply-now');
        }
        setProfile(res);
      }
    });
  }, []);

  const getAllSites = async () => {
    new VenuApiController()
      .getAllSites()
      .then((res) => {
        setSites(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  // Fetch archived sites
  const getArchivedSites = async () => {
    console.log('Fetching archived sites...');
    new VenuApiController()
      .getArchivedSites()
      .then((res) => {
        console.log('Archived sites fetched:', res);
        setArchivedSites(res);
      })
      .catch((err) => {
        console.log('Error fetching archived sites:', err);
        toast.error(err.response.data.message);
      });
  };

  useEffect(() => {
    console.log('Active tab changed to', activeTab);
    if (activeTab === '1') {
      getAllSites(); // Load active sites
    } else if (activeTab === '2') {
      getArchivedSites(); // Load archived sites
    }
  }, [activeTab]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter the sites based on the search query
  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArchivedSites = archivedSites.filter((site) =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              value={searchQuery} // Bind search input to state
              onChange={handleSearchChange} // Handle input change
              autoComplete="off"
              className="input-comp custom-search-icon"
            />
          </div>
        </div>
      </div>
      <div className="py-5 mb-5 paper">
        <CTabs
          activeItemKey={activeTab}
          onActiveTabChange={(key) => {
            console.log('Tab changed to', key);
            setActiveTab(key);
          }}
        >
          <CTabList variant="underline-border" color="success">
            <CTab itemKey="1" className="tab-color">
              Active
            </CTab>
            <CTab itemKey="2" className="tab-color">
              Archived
            </CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel className="py-3" itemKey="1">
              <ActiveTab sites={filteredSites} profile={profile} /> {/* Pass filtered sites */}
            </CTabPanel>
            <CTabPanel className="py-3" itemKey="2">
              <ArchivedTab sites={filteredArchivedSites} profile={profile} /> {/* Archived sites */}
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </div>
    </div>
  );
};

const ActiveTab = ({ sites, profile }) => {
  return (
    <CContainer>
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
                sites.map((site) => (
                  <div
                    key={site._id}
                    style={{ 
                      flex: '0 0 auto', 
                      margin: '0', 
                      padding: '0',
                      width: '50%',
                    }}
                  >
                    <SingleVenueItem site={site} />
                  </div>
                ))
              ) : (
                <div>No venues available.</div>
              )}
            </div>
          </CCardBody>
        </CCol>
      </CRow>
    </CContainer>
  );
};

const ArchivedTab = ({ sites, profile }) => {
  console.log('ArchivedTab sites:', sites);
  return (
    <CContainer>
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
                sites.map((site) => (
                  <div
                    key={site._id}
                    style={{ 
                      flex: '0 0 auto', 
                      margin: '0', 
                      padding: '0',
                      width: '50%',
                    }}
                  >
                    <SingleVenueItem site={site} />
                  </div>
                ))
              ) : (
                <div>No archived venues available.</div>
              )}
            </div>
          </CCardBody>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ListVenues;

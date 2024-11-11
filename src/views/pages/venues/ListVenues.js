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
import ReactPaginate from 'react-paginate';
import './ListVenues.scss'

const ListVenues = () => {
  const [sites, setSites] = useState([]);
  const [archivedSites, setArchivedSites] = useState([]); // State for archived sites
  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [activeTab, setActiveTab] = useState('1'); // Use strings for itemKey
  const [users, setUsers] = useState([]); // State to hold users for the dropdown
  const [selectedUser, setSelectedUser] = useState(''); // State for selected user

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);

  const getPaginatedSites = async (ownerId) => {
    try {
      const res = await new VenuApiController().getPaginatedSites(
        ownerId,
        currentPage,
        itemsPerPage,
        searchQuery
      );
      setSites(res.sites);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const getPaginatedArchivedSites = async (ownerId) => {
    try {
      const res = await new VenuApiController().getPaginatedArchivedSites(
        ownerId,
        currentPage,
        itemsPerPage,
        searchQuery
      );
      setArchivedSites(res.sites);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };


  useEffect(() => {
    getUsers();

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

  const getUsers = async () => {
    try {
      const response = await new AuthApiController().getAllUsers();
      
      setUsers(response);
    } catch (err) {
      console.log(err);
      toast.error('Failed to fetch users');
    }
  };


  const getAllSites = async (userId) => {
    try {
      const res = await new VenuApiController().getAllSites(userId);
      setSites(res);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  // Fetch archived sites
  const getArchivedSites = async (userId) => {
    try {
      const res = await new VenuApiController().getArchivedSites(userId);
      setArchivedSites(res);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

useEffect(() => {
  if (activeTab === '1') {
    getPaginatedSites(selectedUser);
    getPaginatedArchivedSites(selectedUser);
  } else if (activeTab === '2') {
    getPaginatedArchivedSites(selectedUser);
  }
}, [activeTab, selectedUser, currentPage, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedUser, searchQuery]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };


  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter the sites based on the search query
  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const filteredArchivedSites = archivedSites.filter((site) =>
  //   site.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

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
            {/* Filter Dropdown */}
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              style={{
                backgroundColor: '#EDEDEE',
                border: 'none',
                borderRadius: '50px',
                color: '#909094',
                paddingLeft: '15px',
                height: '40px',
                fontSize: '15px',
                fontWeight: '500',
              }}
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

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
              <ActiveTab sites={sites} profile={profile} />
            </CTabPanel>
            <CTabPanel className="py-3" itemKey="2">
              <ArchivedTab sites={archivedSites} profile={profile} />
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </div>

            {/* Pagination component at the bottom before the footer */}
            {sites.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
            previousClassName={'page-item'}
            nextClassName={'page-item'}
            pageClassName={'page-item'}
            breakClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextLinkClassName={'page-link'}
            pageLinkClassName={'page-link'}
            breakLinkClassName={'page-link'}
            disabledClassName={'disabled'}
            forcePage={currentPage - 1}
          />
        </div>
      )}
      
    </div>
  );
};

const ActiveTab = ({ sites, profile }) => {
  return (
    <CContainer>
      <CRow xs={12}>
        <CCol>
          <CCardBody>
          <div className="venue-card-main">
          {sites && sites.length > 0 ? (
            sites.map((site) => (
              <div key={site._id} className="venue-card">
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
          <div className="venue-card-main">
          {sites && sites.length > 0 ? (
            sites.map((site) => (
              <div key={site._id} className="venue-card">
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

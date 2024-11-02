import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CCol,
  CContainer,
  CRow,
  CSpinner,
  CFormSelect,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { AuthApiController } from '../../../api/AuthApiController';
import searchIcon from 'src/assets/icon_svg/search.svg';
import dropdown_sortIcon from 'src/assets/icon_svg/dropdown_sort.svg';

const UserRequests = ({ profile }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'status-success';
      case 'Pending':
        return 'status-warning';
      case 'Declined':
        return 'status-danger';
      default:
        return '';
    }
  };

  const getAllRequests = async () => {
    new AuthApiController().viewAllRequests().then((res) => {
      if (res.message) {
        toast.error(res.message);
      } else {
        setRequests(res);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getAllRequests();
  }, []);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Handle Sort Option Change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Filtered and Sorted Requests based on Search and Sort
  const filteredRequests = requests
    .filter((request) =>
      request.email.toLowerCase().includes(searchQuery) // Filter by search
    )
    .sort((a, b) => {
      if (sortOption === 'nameAsc') {
        return a.email.localeCompare(b.email); // Sort A-Z
      } else if (sortOption === 'nameDesc') {
        return b.email.localeCompare(a.email); // Sort Z-A
      } else if (sortOption === 'dateAsc') {
        return new Date(a.createdAt) - new Date(b.createdAt); // Sort Oldest First
      } else if (sortOption === 'dateDesc') {
        return new Date(b.createdAt) - new Date(a.createdAt); // Sort Newest First
      }
      return 0; // No sort
    });

  return (
    <>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', padding: '20px' }}>
        <div className="title-bold">User Requests</div>
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
              value={searchQuery}
              onChange={handleSearchChange}
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
              value={sortOption}
              onChange={handleSortChange}
              className="input-comp custom-select-icon"
            >
              <option value="">Sort</option>
              <option value="nameAsc">Name (A-Z)</option>
              <option value="nameDesc">Name (Z-A)</option>
              <option value="dateAsc">Date (Oldest First)</option>
              <option value="dateDesc">Date (Newest First)</option>
            </CFormSelect>
          </div>
        </div>
      </div>

      <div>
        <br />
        <br />
        <div className="table-responsive" style={{ marginTop: '-50px' }}>
          <CTable className="order-table" style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{ backgroundColor: '#EDEDEE', color: '#909094', textAlign: 'center' }} scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell style={{ backgroundColor: '#EDEDEE', color: '#909094', textAlign: 'center' }} scope="col">Requested At</CTableHeaderCell>
                <CTableHeaderCell style={{ backgroundColor: '#EDEDEE', color: '#909094', textAlign: 'center', paddingTop: '30px', paddingBottom: '30px' }} scope="col">Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            {!loading && (
              <CTableBody>
                {filteredRequests.map((request, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell style={{ paddingTop: '20px', paddingBottom: '20px', textAlign: 'left' }}>
                      {request.email}
                    </CTableDataCell>
                    <CTableDataCell>
                      {new Date(request.createdAt).toLocaleDateString('en-GB')}
                    </CTableDataCell>
                    <CTableDataCell>
                      <span className={`status-badge ${getStatusClass(request.approved ? 'Approved' : 'Declined')}`}>
                        {request.approved ? 'Approved' : 'Declined'}
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            )}
          </CTable>
        </div>
      </div>
    </>
  );
};

export default UserRequests;

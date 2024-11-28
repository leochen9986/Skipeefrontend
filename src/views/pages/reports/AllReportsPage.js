import React, { useState, useEffect } from 'react';
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
} from '@coreui/react';
import { DashboardApiController } from '../../../api/DashboardApiController';
import { toast } from 'react-toastify';
import PageTopBar from '../../../components/PageTopBar';
import './AllReportsPage.scss';

const IncidentReportsPage = ({ profile }) => {
  const [incidentReports, setIncidentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    // Fetch incident reports from the server
    if (profile) fetchIncidentReports();
  }, [profile]);

  const fetchIncidentReports = () => {
    const filter = {};
    if (profile.role !== 'admin') filter['siteId'] = profile.worksIn._id;

    setLoading(true);
    new DashboardApiController().getReportsData(filter).then((res) => {
      if (res.message) {
        toast.error(res.message);
      } else {
        setIncidentReports(res);
      }
      setLoading(false);
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const setDateRange = (update) => {
    const [start, end] = update;
    setStartDate(start);
    setEndDate(end);
  };

  const filteredAndSortedReports = incidentReports
    ?.filter((report) => {
      // Filter based on search query (checking reportedBy name and site name)
      const reportedByName = report.reportedBy?.name?.toLowerCase() || '';
      const siteName = report.site?.name?.toLowerCase() || '';
      const matchesSearch =
        searchQuery === '' ||
        reportedByName.includes(searchQuery.toLowerCase()) ||
        siteName.includes(searchQuery.toLowerCase());

      // Filter based on selected date range
      const reportDate = new Date(report.incidentDate);
      const matchesDateRange =
        (!startDate || reportDate >= startDate) && (!endDate || reportDate <= endDate);

      return matchesSearch && matchesDateRange;
    })
    .sort((a, b) => {
      // Sort logic based on the sortOption
      if (sortOption === 'nameAsc') {
        return a.reportedBy?.name?.localeCompare(b.reportedBy?.name || '') || 0;
      } else if (sortOption === 'nameDesc') {
        return b.reportedBy?.name?.localeCompare(a.reportedBy?.name || '') || 0;
      } else if (sortOption === 'dateAsc') {
        return new Date(a.incidentDate) - new Date(b.incidentDate);
      } else if (sortOption === 'dateDesc') {
        return new Date(b.incidentDate) - new Date(a.incidentDate);
      }
      return 0;
    });

  if (loading)
    return (
      <div className="d-flex justify-content-center align-item-center">
        <CSpinner />
      </div>
    );

  return (
    <>
<div style={{ width: '100%', padding: '20px' }}>
  <div className="title-bold">Incident Reports</div>

  {/* Container for search, sort, and date picker */}
  <div className="search-sort-container">
    {/* Search Bar */}
    <div className="search-container-order">
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
    <div className="sort-container">
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

    {/* Date Picker */}
    <div className="date-picker-container">
      <PageTopBar
        startDate={startDate}
        endDate={endDate}
        setDateRange={setDateRange}
        picker={true}
        currentPage="orders"
      />
    </div>
  </div>
</div>

      <CContainer>
        <CRow>
          {filteredAndSortedReports.length === 0 && !loading && <p>No incident reports found.</p>}
          {filteredAndSortedReports.map((report) => (
            <CCol md={6} key={report._id}>
              <CCard className="mb-3">
                <CCardHeader>
                  <strong>Incident Date:</strong> {new Date(report.incidentDate).toLocaleDateString()} at{' '}
                  {new Date(report.incidentDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol md={3} className="card-label">
                      <strong>Reported By</strong>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={9} className="card-content">
                      {report.reportedBy?.name} ({report.reportedBy?.email}, {report.reportedBy?.role})
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={3} className="card-label">
                      <strong>Site</strong>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={9} className="card-content">{report.site?.name}</CCol>
                    <CCol md={9}>
                      <CImage src={report.site?.logo} alt={report.site?.name} width={100} />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={3} className="card-label">
                      <strong>Site Email</strong>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={9} className="card-content">{report.site?.email}</CCol>
                  </CRow>
                  <CRow>
                    <CCol md={3} className="card-label">
                      <strong>Site Phone</strong>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={9} className="card-content">{report.site?.phone}</CCol>
                  </CRow>
                  <CRow>
                    <CCol md={3} className="card-label">
                      <strong>Description</strong>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={9} className="card-content">{report.description}</CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </CContainer>
    </>
  );
};

export default IncidentReportsPage;

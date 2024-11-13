import React, { useState, useEffect,useRef } from 'react'
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
  CCardFooter,
  CTable ,
  CTableHead ,
  CTableRow ,
  CTableHeaderCell ,
  CTableBody ,
  CTableDataCell ,
  CForm ,
} from '@coreui/react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Select from 'react-select';
import { DashboardApiController } from '../../../api/DashboardApiController'
import { toast } from 'react-toastify'
import searchIcon from 'src/assets/icon_svg/search.svg';
import dropdown_sortIcon from 'src/assets/icon_svg/dropdown_sort.svg';
import location_pinIcon from 'src/assets/icon_svg/location_pin.svg';
import location_pin_greyIcon from 'src/assets/icon_svg/location_pin_grey.svg';
import deleteIcon from 'src/assets/icon_svg/delete.svg';
import opening_timeIcon from 'src/assets/icon_svg/opening_time.svg';
import editIcon from 'src/assets/icon_svg/edit.svg';
import last_entryIcon from 'src/assets/icon_svg/last_entry.svg';
import chosen_fileIcon from 'src/assets/icon_svg/chosen_file.svg';
import PageTopBarST from '../../../components/PageTopBarST'
import PopupModelBaseVenue from 'src/views/popup/PopupModelBaseVenue.js'
import { VenuApiController } from '../../../api/VenuApiController'
import './STPage.scss'
import { ViewTicketPrice } from '../../forms/range/Range'
import { AuthApiController } from '../../../api/AuthApiController'
import PopupModelBaseWidth from '../../popup/PopupModelBaseWidth';
import PopupModelBase from '../../popup/PopupModelBase'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const TKPage = ({ site }) => {
  const [profile, setProfile] = useState(null)
  const [sites, setSites] = useState([]);
  const [activeSiteId, setActiveSiteId] = useState(null); // Currently selected siteId

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
        fetchOwnedSites(res._id);
      }
    })
    
  }, [])



  const fetchOwnedSites = (userId) => {
    new VenuApiController().getSitesByOwner(userId, 'ticketing').then((res) => {
      if (res.message) {
        toast.error(res.message);
      } else {
        setSites(res);

        // Create tabs data
        const tabsData = res.map((site, index) => ({
          key: index + 1, // Start from 1, since 0 is "All"
          label: site.name + " (" + site.location + ")" || site.name,
          siteId: site._id,
        }));

        // Add the "All" tab at the beginning
        setTabs([ ...tabsData]);

        if (tabsData.length > 0) {
          setActiveSiteId(tabsData[0].siteId);
        }
      }
      setLoading(false);
    });
  };


    // Update the active siteId when the active tab changes
    const handleTabChange = (newTabKey) => {
      setActiveTab(newTabKey);
      const selectedSite = tabs.find((tab) => tab.key === newTabKey);
      if (selectedSite) {
        setActiveSiteId(selectedSite.siteId); // Set the siteId for the selected tab
      }
    };

  // if (loading || !profile) {
  //   return (
  //     <div className="d-flex justify-content-center align-items-center">
  //       <CSpinner />
  //     </div>
  //   );
  // }

  const [tabs, setTabs] = useState([
  ]);
  const [activeTab, setActiveTab] = useState(1);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [popupVisibleV, setPopupVisibleV] = useState(false);
  const [popupChildrenV, setPopupChildrenV] = useState(null);
  const [popupVisibleW, setPopupVisibleW] = useState(false);
  const [popupChildrenW, setPopupChildrenW] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupChildren, setPopupChildren] = useState(null);

  // Fetch countries from CountriesNow API
  useEffect(() => {
    fetchCountries();
  }, []);


  const fetchCountries = () => {
    fetch('https://countriesnow.space/api/v0.1/countries')
      .then((response) => response.json())
      .then((data) => {
        const countryOptions = data.data.map((country) => ({
          value: country.country,
          label: country.country,
        }));
        setCountries(countryOptions);
      })
      .catch((error) => {
        console.error("Error fetching countries: ", error);
      });
  };

  // Fetch states dynamically based on selected country
  const fetchStates = (countryName) => {
    console.log("Selected country name for states fetch:", countryName);

    fetch('https://countriesnow.space/api/v0.1/countries/states', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ country: countryName }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from API for states:", data);
        if (data.data && Array.isArray(data.data.states)) {
          const stateOptions = data.data.states.map((state) => ({
            value: state.name,
            label: state.name,
          }));
          setStates(stateOptions);
          console.log("Processed states:", stateOptions);
        } else {
          console.error("No states found for this country.");
          setStates([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching states: ", error);
        setStates([]);
      });
  };

  
  const handleCountryChange = (selectedOption) => {
    console.log("Selected Country:", selectedOption); // Debugging Line
    setSelectedCountry(selectedOption);
    setSelectedState(null); // Reset state when country changes
    fetchStates(selectedOption.label); // Fetch states for the selected country
  };

  const handleStateChange = (selectedOption) => {
    console.log("Selected State:", selectedOption); // Debugging Line
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
  };

  // Function to trigger the popup and display content inside it
  const showPopup = () => {
    setPopupChildrenV(
      <AddNewLocation
        onClose={() => {
          setPopupVisibleV(false);
        }}
        onSiteCreated={(newSite) => {
          // Update sites and tabs
          setSites([...sites, newSite]);
          const newKey = tabs.length + 1;
          const newTab = {
            key: newKey,
            label: newSite.location || newSite.name,
            siteId: newSite._id,
          };
          setTabs([...tabs, newTab]);
          setActiveTab(newKey);
          setPopupVisibleV(false);
        }}
      />
    );
    setPopupVisibleV(true);
  };
  const closePopup = () => {
    setPopupVisibleV(false);
    setPopupChildrenV(null);
  };


  // Example of using the functions in a popup
  const popupContent = (
    <div>
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
      />
      
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', width: '100%' , paddingTop:'5%'}}>
        <CButton
          color="success"
          style={{color:'white'}}
          onClick={() => {
            addNewTab(); // Add tab from inside the popup
            closePopup(); // Close popup after adding the tab
          }}
          disabled={!selectedCountry || !selectedState}
        >
          Add Tab
        </CButton>
      </div>
    </div>
  )
  const [incidentReports, setIncidentReports] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch incident reports from the server
    if (profile) fetchIncidentReports()
  }, [profile])


  useEffect(() => {
    console.log("Selected Country Updated:", selectedCountry);
    console.log("Selected State Updated:", selectedState);
  }, [selectedCountry, selectedState]);

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
  

  if (loading) {
    return (
      <CContainer
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  return (
    <>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start',padding:'20px'}}>
        <div className='title-bold'>Ticketing</div>
        <div style={{ display: 'flex', alignItems: 'right', justifyContent: 'flex-end', gap:'20px',width: '100%' }}>
        
      <PageTopBarST
        picker={true}
        // startDate={startDate}
        // endDate={endDate}
        // setDateRange={setDateRange}
        currentPage="dashboard"
      />
      </div>
      </div>
    <div>
 

        <CTabs activeItemKey={activeTab} onActiveTabChange={setActiveTab}>
        <CTabList variant="underline-border" color="success">
          {tabs.map((tab) => (
            <CTab
              key={tab.key}
              aria-controls={`tab-pane-${tab.key}`}
              itemKey={tab.key}
              className="tab-color align"
            >
              <img
                src={activeTab === tab.key ? location_pinIcon : location_pin_greyIcon}
                alt="Location Icon"
                style={{ marginRight: '5px' }}
              />
              {tab.label}
            </CTab>
          ))}
          <CButton
            color="success"
            className="ml-3 add-loc-btn"
            onClick={showPopup}
          >
            <span style={{ fontSize: '30px', fontWeight: '200' }}>+</span>&nbsp;&nbsp; Add New Location
          </CButton>
        </CTabList>

          <CTabContent>
            {tabs.map((tab) => (
              <CTabPanel
                key={tab.key}
                className="py-3"
                aria-labelledby={`tab-pane-${tab.key}`}
                itemKey={tab.key}
              >
                <EventsTab profile={profile} siteId={tab.siteId} siteIds={sites.map(s => s._id)} />
              </CTabPanel>
            ))}
          </CTabContent>
        </CTabs>

    
    </div>
    {/* <CContainer fluid className='container-events'>
      <CRow className="events-row">
        {incidentReports.length === 0 && !loading && <p>No events reports found.</p>}
        {incidentReports.map((report) => (
          <CCol md={6} key={report._id} className="events-col">
            <CCard key={report._id} className="mb-3">
              <CCardBody>
                <CRow>
                  <CCol md={3} className="card-label">
                    <strong>Reported By</strong>
                  </CCol>
                </CRow>
              </CCardBody>
              <CCardFooter>
                <strong>Incident Date:</strong> {new Date(report.incidentDate).toLocaleDateString()} at{' '}
                {new Date(report.incidentDate).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}a
              </CCardFooter>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </CContainer> */}


    <PopupModelBaseVenue
  visible={popupVisibleV}
  onClose={() => {
    setPopupVisibleV(false);
  }}
>
  {popupChildrenV}
</PopupModelBaseVenue>
    </>
  )
  
}


const EventsTab = ({ profile, siteId, siteIds }) => {
  const [activeTab, setActiveTab] = useState(1); // Track the active tab

  // Prepare the query object
  const query = {
    status: ['upcoming', 'on hold'], 
    // If siteId is provided, use it; otherwise, use siteIds (array of all site IDs)
    siteId: siteId,
    siteIds: siteId ? undefined : siteIds,
  };

  return (
    <CTabs activeItemKey={activeTab} onActiveTabChange={setActiveTab}>
      <CTabList variant="underline-border" color="success" className="tab-list-events">
        <CTab aria-controls="all-events-pane" itemKey={1} className="tab-color-events">
          Upcoming Events
        </CTab>
        <CTab aria-controls="upcoming-tab-pane" itemKey={2} className="tab-color-events">
          Past Events
        </CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel className="py-3" aria-labelledby="all-events-pane" itemKey={1}>
          {profile ? (
            <AllEventsTab query={{ ...query, status: ['upcoming', 'on hold'] }} profile={profile} siteId={siteId}/>
          ) : (
            <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <CSpinner color="primary" />
            </div>
          )}
        </CTabPanel>
        <CTabPanel className="py-3" aria-labelledby="upcoming-tab-pane" itemKey={2}>
          {profile ? (
            <PastEventsTab query={{ ...query, status: 'completed' }} profile={profile} />
          ) : (
            <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <CSpinner color="primary" />
            </div>
          )}
        </CTabPanel>
      </CTabContent>
    </CTabs>
  );
};



const AllEventsTab = ({ query, profile ,siteId}) => {
  const [eventsList, setEventsList] = useState([]);
  const [popupVisibleW, setPopupVisibleW] = useState(false);
  const [popupChildrenW, setPopupChildrenW] = useState(null);
  const [isToggled, setIsToggled] = useState(true);

  const handleAddTicketingClose = () => {
    setPopupVisibleW(false); // Close the Add Skipping modal
    loadEvents(); // Refresh the events list
  };

  
  const handleToggle = (event) => {
    // Determine the new status
    const newStatus = event.status === 'upcoming' ? 'on hold' : 'upcoming';
  
    // Make an API call to update the event status
    new VenuApiController()
      .updateEvent(event._id, {name:event.name, status: newStatus })
      .then((res) => {
        if (res && !res.message) {
          // Update the local eventsList state to reflect the new status
          setEventsList((prevEvents) =>
            prevEvents.map((evt) =>
              evt._id === event._id ? { ...evt, status: newStatus } : evt
            )
          );
          toast.success('Event status updated successfully.');
        } else {
          toast.error('Failed to update event status.');
        }
      })
      .catch((error) => {
        console.error('Error updating event status:', error);
        toast.error('An error occurred while updating event status.');
      });
  };


  const loadEvents = () => {
    if (!query || Object.keys(query).length === 0 || !query.siteId) {
      // If query is undefined, empty, or siteId is undefined, don't send the API request
      return;
    }
    
    

    new VenuApiController().getAllEvents(query).then((res) => {
      if (res && !res.message) {
        setEventsList(res);
      } else {
        if (query) {
          console.log(query.length); // Safely log the length if query exists
        }
      }
    });
  };

  useEffect(() => {
    if (query) {
      loadEvents();
    }
  }, [query]);

  return (
    <>
      {eventsList.length === 0 ? (
        <div className="no-event-container">
        <img src="/src/assets/images/noEventWidget.svg" alt="noEvent" />
      </div>
      ) : (
        <CContainer fluid className="container-events">
          <CRow className="events-row">
            {eventsList.map((event, index) => (
              <CCol md={4} className="events-col" key={index}>
                <CCard className="mb-3">
                  <CCardBody className="card-body-event">
                    {/* Event Content */}
                    <CRow>
                      <CCol md={12} className="card-label" style={{ width: '100%' }}>
                        {/* Image Display */}
                        {event.image ? (
                          <div style={{ width: '100%', height: '250px', marginBottom: '10px' }}>
                            <img
                              src={event.image}
                              alt="Event"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px',
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '250px',
                              backgroundColor: '#f4f4f4',
                              borderRadius: '8px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <span style={{ color: '#ccc', fontSize: '14px' }}>No Image Available</span>
                          </div>
                        )}
  
                        {/* Event Name and Toggle */}
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <strong style={{ color: '#4E4E4E' }}>Event Name</strong>
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <strong className="reported-by-text">{event.name}</strong>
                            <label className="toggle-container">
                              <input
                                type="checkbox"
                                checked={event.status === 'upcoming'} // Reflect the event's current status
                                onChange={() => handleToggle(event)}
                                className="toggle-input"
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </div>
                        </div>
                      </CCol>
                    </CRow>
                  </CCardBody>
                  <CCardFooter className="card-footer">
                    <div style={{ padding: '3% 0px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="footer-label">Date</span>
                        <span className="footer-content">
                          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                      </div>
                      {event.tickets[1] && (
                        <div key={1}>
                          <div className="footer-space">
                            <span className="footer-label">Price</span>
                            <span className="footer-content">
                              £{parseFloat(event.tickets[1].price).toFixed(2)}
                            </span>
                          </div>
                          <div className="footer-space">
                            <span className="footer-label">
                              <img
                                src={opening_timeIcon}
                                style={{ height: '13px', width: '13px' }}
                                alt="Opening Time"
                              />{' '}
                              Opening Time
                            </span>
                            <span className="footer-content">
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                          <div className="footer-space">
                            <span className="footer-label">
                              <img
                                src={last_entryIcon}
                                style={{ height: '13px', width: '13px' }}
                                alt="Last Entry"
                              />{' '}
                              Last Entry
                            </span>
                            <span className="footer-content">{event.lastEntryTime}</span>
                          </div>
                        </div>
                      )}

                    </div>
                  </CCardFooter>
                </CCard>
              </CCol>
            ))}
          </CRow>
        </CContainer>
      )}
  
      {/* Add Events Button and Popup */}
      <div className="add-events-btn">
        <CButton
          color="success text-white"
          siteId={siteId}
          onClick={() => {
            setPopupChildrenW(<AddTicketing siteId={siteId} onClose={handleAddTicketingClose}/>);
            setPopupVisibleW(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            borderRadius: '15px',
            padding: '0px 20px',
            backgroundColor: 'black',
            border: 'none',
            height: '43px',
          }}
        >
          Add Ticketing
          <span style={{ fontSize: '2rem', marginLeft: '5px', fontWeight: '200' }}>+</span>
        </CButton>
      </div>
  
      <PopupModelBaseWidth
        visible={popupVisibleW}
        onClose={() => {
          setPopupVisibleW(false);
        }}
        title="Add Ticketing"
        children={popupChildrenW}
      />
    </>
  );
  
};

const PastEventsTab = ({ query, event, onProceed }) => {
  const [eventsList, setEventsList] = React.useState([]);

  const loadEvents = () => {
    if (!query || Object.keys(query).length === 0 || !query.siteId) {
      // If query is undefined, empty, or siteId is undefined, don't send the API request
      return;
    }
    
    // API call
    new VenuApiController().getAllEvents(query).then((res) => {
      if (res && !res.message) {
        setEventsList(res);
      } else {
        if (query) {
          console.log(query.length); // Safely log the length if query exists
        }
      }
    });
  };

  useEffect(() => {
    loadEvents();
  }, [query]);

  return (
    <>
      {eventsList.length === 0 ? (
        <div style={{ justifyContent: 'center', alignContent: 'center', display: 'flex' }}>
          <img src="/src/assets/images/noEventWidget.svg" alt="noEvent" width="60%" />
        </div>
      ) : (
        <div className="table-responsive">
          <CTable className="order-table" style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="table-header-cell" scope="col">Event Name</CTableHeaderCell>
                <CTableHeaderCell className="table-header-cell" scope="col">Date</CTableHeaderCell>
                <CTableHeaderCell className="table-header-cell" scope="col">Opening Time</CTableHeaderCell>
                <CTableHeaderCell className="table-header-cell" scope="col">Last Entry</CTableHeaderCell>
                <CTableHeaderCell className="table-header-cell" scope="col">Price</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {eventsList.map((event, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{event.name}</CTableDataCell>
                  <CTableDataCell>
                    {`${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long' })} ${new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}
                  </CTableDataCell>
                  <CTableDataCell>{event.startTime} - {event.endTime}</CTableDataCell>
                  <CTableDataCell>{/* Last entry data here */}</CTableDataCell>
                  {event.tickets.map((ticket, ticketIndex) => (
                    <CTableDataCell key={ticketIndex}>£{parseFloat(ticket.price).toFixed(2)}</CTableDataCell>
                  ))}
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      )}
    </>
  );
};

const AddTicketing = ({ siteId,onClose }) => {
  const [eventData, setEventData] = useState({});
  const [loading, setLoading] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupChildren, setPopupChildren] = useState(null);
  const [popupTitle, setPopupTitle] = useState('');
  const fileInputRefs = useRef({});
  const [singleEvents, setSingleEvents] = useState([]);
  let hasErrorOccurred = false;

  const [isSaving, setIsSaving] = useState(false); // Track save status

  // Adjusted daysOfWeek array
  const daysOfWeek = [
    { name: 'Monday', index: 1 },
    { name: 'Tuesday', index: 2 },
    { name: 'Wednesday', index: 3 },
    { name: 'Thursday', index: 4 },
    { name: 'Friday', index: 5 },
    { name: 'Saturday', index: 6 },
    { name: 'Sunday', index: 0 },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await new VenuApiController().getAllEvents({ siteId });

        // Initialize eventData
        const initialEventData = {};

        // Initialize eventsByDay with empty data for each day
        daysOfWeek.forEach(({ name: dayName, index: dayIndex }) => {
          initialEventData[dayName] = {
            name: '',
            startTime: '',
            endTime: '',
            price: '',
            lastEntryTime: '',
            limitQuantity: false,
            status: false,
            image: null,
            quantity: 300,
            tickets: [],
            eventId: null,
            isExistingEvent: false,
            isSingleEvent: false,
          };
        });

        const fetchedSingleEvents = [];
        

        if (res && !res.message) {
          // Process the fetched events
          res.forEach((event) => {
            if (event.status === 'completed') {
              return; // Skip completed events
            }

            if (!event.singleEvent) {
              // Group recurring events by day of the week
              const eventDate = new Date(event.date);
              const dayIndex = eventDate.getDay();
              const dayName = daysOfWeek.find((day) => day.index === dayIndex)?.name;
              
              if (dayName) {
                initialEventData[dayName] = {
                  name: event.name,
                  startTime: event.startTime,
                  endTime: event.endTime,
                  price: event.tickets?.[1]?.price || '',
                  lastEntryTime: event.lastEntryTime || '',
                  limitQuantity: event.limitQuantity || false,
                  status: event.status === 'upcoming',
                  image: event.image || null,
                  quantity: event.tickets?.[1]?.totalQuantity || 300, // Use existing quantity or default
                  tickets: event.tickets,
                  eventId: event._id,
                  isExistingEvent: false,
                };
              }
            } else {

              // Single event handling
              fetchedSingleEvents.push({
                name: event.name,
                date: new Date(event.date).toISOString(),
                startTime: event.startTime,
                endTime: event.endTime,
                price: event.tickets?.[1]?.price || '',
                lastEntryTime: event.lastEntryTime || '',
                limitQuantity: event.limitQuantity || false,
                status: event.status === 'upcoming',
                image: event.image || null,
                quantity: event.tickets?.[1]?.totalQuantity || 300,
                tickets: event.tickets,
                eventId: event._id,
                isExistingEvent: true,
              });

              console.log(fetchedSingleEvents);
            }
          });
        }
  
        // Update the state with the processed data
        setEventData(initialEventData);
        setSingleEvents(fetchedSingleEvents);
        console.log(eventData);
      } catch (error) {
        toast.error('Failed to load events');
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [siteId]);

  const handleInputChange = (dayName, field, value) => {
    const timeToDate = (timeStr, referenceDate = new Date()) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const date = new Date(referenceDate); // Use the provided date
      date.setHours(hours, minutes, 0, 0);
      return date;
    };
  
    setEventData((prevData) => {
      const updatedEventData = {
        ...prevData[dayName],
        [field]: value,
      };
  
      if (updatedEventData.startTime && updatedEventData.endTime && updatedEventData.lastEntryTime) {
        const startTime = timeToDate(updatedEventData.startTime);
        let endTime = timeToDate(updatedEventData.endTime, startTime);
  
        // If endTime is earlier than startTime, it spans the next day
        if (endTime <= startTime) {
          endTime.setDate(endTime.getDate() + 1); // Move endTime to the next day
        }
  
        let lastEntryTime = timeToDate(updatedEventData.lastEntryTime, startTime);
  
        // Handle lastEntryTime when the event spans midnight
        if (lastEntryTime < startTime) {
          lastEntryTime.setDate(lastEntryTime.getDate() + 1); // Set to next day if before startTime
        } else if (lastEntryTime > endTime) {
          // If lastEntryTime somehow exceeds endTime (which shouldn't normally happen), reset it
          toast.error("Last Entry Time must be between Start Time and End Time.");
          updatedEventData.lastEntryTime = ''; // Reset to indicate invalid input
          return { ...prevData, [dayName]: updatedEventData }; // Exit early
        }
  
        const isLastEntryValid = lastEntryTime >= startTime && lastEntryTime <= endTime;
  
        if (!isLastEntryValid) {
          toast.error("Last Entry Time must be between Start Time and End Time.");
          updatedEventData.lastEntryTime = ''; // Reset lastEntryTime if invalid
        }
      }
  
      return {
        ...prevData,
        [dayName]: updatedEventData,
      };
    });
  };

  const handleToggleChange = (dayName, field, value) => {
    handleInputChange(dayName, field, value);
  
    if (field === 'limitQuantity' && !value) {
      // When limitQuantity is toggled off, clear the quantity
      handleInputChange(dayName, 'quantity', '');
    }
  };

  const handleButtonClick = (dayName) => {
    if (fileInputRefs.current[dayName]) {
      fileInputRefs.current[dayName].click();
    }
  };

  const handleFileChange = async (e, dayName) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Upload to Firebase and get download URL
        const downloadURL = await uploadImageToFirebase(file);

        // Update the local state
        handleInputChange(dayName, 'image', downloadURL);
      } catch (error) {
        toast.error('Failed to upload image');
        console.error(error);
      }
    }
  };

  const uploadImageToFirebase = async (file) => {
    const storageRef = ref(storage, `event-images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleDeleteImage = (dayName) => {
    // Remove image from state
    handleInputChange(dayName, 'image', null);
  };

  const handleSave = async (dayName, showToast = true) => {
    const updatedEvent = eventData[dayName];
  
    try {
      if (!updatedEvent.name || updatedEvent.name.trim() === '') {
        updatedEvent.name = dayName;
      }
      const fieldNames = {
        startTime: 'Start Time',
        endTime: 'End Time',
        price: 'Price',
      };
  
      if (updatedEvent.status) {
        // Validate required fields
        const requiredFields = ['startTime', 'endTime', 'price'];
        const missingFields = requiredFields.filter((field) => !updatedEvent[field]);
  
        if (missingFields.length > 0) {
          // Map the missing field names to their display names
          const missingFieldNames = missingFields.map(field => fieldNames[field] || field);
          toast.error(`Please fill in required fields: ${missingFieldNames.join(', ')}`);
          return;
        }
      }
  
      if (updatedEvent.eventId) {
        // Update existing event
        const eventUpdateData = {
          name: updatedEvent.name,
          startTime: updatedEvent.startTime,
          endTime: updatedEvent.endTime,
          lastEntryTime: updatedEvent.lastEntryTime,
          status: updatedEvent.status ? 'upcoming' : 'on hold',
          image: updatedEvent.image,
          limitQuantity: updatedEvent.limitQuantity,
        };
  
        await new VenuApiController().updateEvent(updatedEvent.eventId, eventUpdateData);
  
        // Ensure tickets array is properly structured
        updatedEvent.tickets = updatedEvent.tickets || [];
  
        // Check if "Ticketing" ticket already exists
        const ticketingTicket = updatedEvent.tickets.find(ticket => ticket.type === 'queue');
  
        const ticketData = {
          name: 'Ticketing',
          type: 'queue',
          price: parseFloat(updatedEvent.price),
          totalQuantity: updatedEvent.limitQuantity ? parseInt(updatedEvent.quantity) || 300 : 999999,
          availableQuantity: updatedEvent.limitQuantity ? parseInt(updatedEvent.quantity) || 300 : 999999,
          saleStartTime: getSaleStartTime(dayName, updatedEvent.startTime).toISOString(),
          saleEndTime: getSaleEndTime(dayName, updatedEvent.startTime, updatedEvent.endTime).toISOString(),
        };
  
        if (ticketingTicket) {
          // Update the existing "Ticketing" ticket
          await new VenuApiController().updateTicket(ticketingTicket._id, ticketData);
        } else {
          // Create "Skips" and "Ticketing" tickets if none exist
          const ticketsData = [
            ticketData,
          ];
  
          for (const data of ticketsData) {
            const newTicket = await new VenuApiController().addTicket(updatedEvent.eventId, data);
            updatedEvent.tickets.push(newTicket);
          }
        }
  
        if (showToast) {
          toast.success('Event updated successfully.');
        }
      } else if (updatedEvent.status) {
        // Create new event
        const eventDataToCreate = {
          name: updatedEvent.name,
          startTime: updatedEvent.startTime,
          endTime: updatedEvent.endTime,
          lastEntryTime: updatedEvent.lastEntryTime,
          image: updatedEvent.image,
          limitQuantity: updatedEvent.limitQuantity,
          status: 'upcoming',
          siteId: siteId,
          date: getNextDateOfDay(dayName).toISOString(),
          isSingleEvent: false,
        };
  
        const eventResponse = await new VenuApiController().createEvent(eventDataToCreate);
        if (eventResponse && !eventResponse.message) {
          const eventId = eventResponse._id;
  
          // Create both "Skips" and "Ticketing" tickets for the new event
          const ticketsData = [
            {
              name: 'Skips',
              type: 'skip',
              price: 0,
              totalQuantity: updatedEvent.limitQuantity ? parseInt(updatedEvent.quantity) || 300 : 999999,
              availableQuantity: updatedEvent.limitQuantity ? parseInt(updatedEvent.quantity) || 300 : 999999,
              saleStartTime: getSaleStartTime(dayName, updatedEvent.startTime).toISOString(),
              saleEndTime: getSaleEndTime(dayName, updatedEvent.startTime, updatedEvent.endTime).toISOString(),
            },
            {
              name: 'Ticketing',
              type: 'queue',
              price: parseFloat(updatedEvent.price),
              totalQuantity: updatedEvent.limitQuantity ? parseInt(updatedEvent.quantity) || 300 : 999999,
              availableQuantity: updatedEvent.limitQuantity ? parseInt(updatedEvent.quantity) || 300 : 999999,
              saleStartTime: getSaleStartTime(dayName, updatedEvent.startTime).toISOString(),
              saleEndTime: getSaleEndTime(dayName, updatedEvent.startTime, updatedEvent.endTime).toISOString(),
            },
          ];
  
          updatedEvent.tickets = [];
  
          for (const data of ticketsData) {
            const newTicket = await new VenuApiController().addTicket(eventId, data);
            updatedEvent.tickets.push(newTicket);
          }
  
          if (showToast) {
            toast.success('Event and tickets created successfully.');
          }
  
          setEventData((prevData) => ({
            ...prevData,
            [dayName]: {
              ...prevData[dayName],
              eventId: eventId,
              isExistingEvent: true,
              tickets: updatedEvent.tickets,
            },
          }));
        } else {
          hasErrorOccurred = true;
          toast.error('Failed to create event.');
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event.');
      hasErrorOccurred = true;
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true); // Disable button
    hasErrorOccurred = false; // Reset the error flag
    for (const dayName of Object.keys(eventData)) {
      await handleSave(dayName, false);
    }
    if (!hasErrorOccurred) {
    toast.success('All changes saved successfully.');
    }
    setIsSaving(false);
    onClose();
  };

  const getNextDateOfDay = (dayName) => {
    const dayIndex = daysOfWeek.find((day) => day.name === dayName).index;
    const today = new Date();
    const todayIndex = today.getDay();
  
    let nextDate = new Date(today);
  
    // Check if the selected day is today
    if (dayIndex === todayIndex) {
      // Set nextDate to today if it's the same day
      return nextDate;
    }
  
    // Otherwise, calculate the next occurrence of the day
    let daysAhead = (dayIndex - todayIndex + 7) % 7;
    if (daysAhead === 0) daysAhead = 7; // Ensure it goes to the next week if today is the same day but we didn't set it to today above
  
    nextDate.setDate(today.getDate() + daysAhead);
    return nextDate;
  };

  const getSaleStartTime = (dayName, startTime) => {
    const nextDate = getNextDateOfDay(dayName);
    const [startHours, startMinutes] = startTime.split(':');
    nextDate.setHours(startHours, startMinutes, 0, 0);
    return nextDate;
  };
  
  const getSaleEndTime = (dayName, startTime, endTime) => {
    const nextDate = getNextDateOfDay(dayName);
    const [startHours, startMinutes] = startTime.split(':');
    const [endHours, endMinutes] = endTime.split(':');
  
    // Set the end time
    const endDate = new Date(nextDate);
    endDate.setHours(endHours, endMinutes, 0, 0);
  
    // Check if end time is earlier than start time (indicating it falls on the next day)
    if (parseInt(endHours) < parseInt(startHours) || 
       (parseInt(endHours) === parseInt(startHours) && parseInt(endMinutes) < parseInt(startMinutes))) {
      endDate.setDate(endDate.getDate() + 1); // Move end time to the next day
    }
  
    return endDate;
  };

  const createTicketForEvent = async (eventId, updatedEvent, dayName) => {
    try {
      const ticketData = {
        name: 'Ticketing',
        type: 'queue',
        price: parseFloat(updatedEvent.price),
        totalQuantity: updatedEvent.limitQuantity
          ? parseInt(updatedEvent.quantity) || 300
          : 999999,
        availableQuantity: updatedEvent.limitQuantity
          ? parseInt(updatedEvent.quantity) || 300
          : 999999,
        saleStartTime: getSaleStartTime(dayName, updatedEvent.startTime).toISOString(),
        saleEndTime: getSaleEndTime(dayName,updatedEvent.startTime, updatedEvent.endTime).toISOString(),
      };
  
      const ticketResponse = await new VenuApiController().addTicket(eventId, ticketData);
      return ticketResponse;
    } catch (error) {
      console.error('Error creating ticket:', error);
      return null;
    }
  };

  const handleSingleEventInputChange = (index, field, value) => {
    setSingleEvents((prevEvents) => {
      const updatedEvents = [...prevEvents];
      updatedEvents[index] = {
        ...updatedEvents[index],
        [field]: value,
      };
      return updatedEvents;
    });
  };

  const handleSingleEventToggleChange = (index, field, value) => {
    handleSingleEventInputChange(index, field, value);
  
    if (field === 'limitQuantity' && !value) {
      // When limitQuantity is toggled off, clear the quantity
      handleSingleEventInputChange(index, 'quantity', '');
    }
  };

  const singleFileInputRefs = useRef({});

const handleSingleEventButtonClick = (index) => {
  if (singleFileInputRefs.current[index]) {
    singleFileInputRefs.current[index].click();
  }
};

const handleSingleEventFileChange = async (e, index) => {
  const file = e.target.files[0];
  if (file) {
    try {
      // Upload to Firebase and get download URL
      const downloadURL = await uploadImageToFirebase(file);

      // Update the local state
      handleSingleEventInputChange(index, 'image', downloadURL);
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    }
  }
};

const handleDeleteSingleEventImage = (index) => {
  // Remove image from state
  handleSingleEventInputChange(index, 'image', null);
};

const handleSingleEventSave = async (index, showToast = true) => {
  const updatedEvent = singleEvents[index];
  try {
    if (updatedEvent.status) {
      // Validate required fields
      const requiredFields = ['name', 'startTime', 'endTime', 'price', 'date'];
      const missingFields = requiredFields.filter((field) => !updatedEvent[field]);

      if (missingFields.length > 0) {
        toast.error(`Please fill in required fields: ${missingFields.join(', ')}`);
        return;
      }
    }

    if (updatedEvent.eventId) {
      // Update existing event
      const eventUpdateData = {
        name: updatedEvent.name,
        date: updatedEvent.date,
        startTime: updatedEvent.startTime,
        endTime: updatedEvent.endTime,
        lastEntryTime: updatedEvent.lastEntryTime,
        status: updatedEvent.status ? 'upcoming' : 'on hold',
        image: updatedEvent.image,
        limitQuantity: updatedEvent.limitQuantity,
        isSingleEvent: true,
      };

      await new VenuApiController().updateEvent(updatedEvent.eventId, eventUpdateData);

      // Update only the "Ticketing" ticket
      if (updatedEvent.tickets && updatedEvent.tickets.length > 0) {
        const ticketingTicket = updatedEvent.tickets.find(ticket => ticket.type === 'queue');
        if (ticketingTicket) {
          const saleStartTime = getSaleStartTimeForSingleEvent(
            updatedEvent.date,
            updatedEvent.startTime
          );
          const saleEndTime = getSaleEndTimeForSingleEvent(
            updatedEvent.date,
            updatedEvent.startTime,
            updatedEvent.endTime
          );

          const ticketUpdateData = {
            name: 'Ticketing',
            type: 'queue',
            price: parseFloat(updatedEvent.price),
            totalQuantity: updatedEvent.limitQuantity
              ? parseInt(updatedEvent.quantity) || 300
              : 999999,
            availableQuantity: updatedEvent.limitQuantity
              ? parseInt(updatedEvent.quantity) || 300
              : 999999,
            saleStartTime: saleStartTime.toISOString(),
            saleEndTime: saleEndTime.toISOString(),
          };

          await new VenuApiController().updateTicket(ticketingTicket._id, ticketUpdateData);
        } else {
          // If the "Ticketing" ticket doesn't exist, create it
          const ticketData = {
            name: 'Ticketing',
            type: 'queue',
            price: parseFloat(updatedEvent.price),
            totalQuantity: updatedEvent.limitQuantity
              ? parseInt(updatedEvent.quantity) || 300
              : 999999,
            availableQuantity: updatedEvent.limitQuantity
              ? parseInt(updatedEvent.quantity) || 300
              : 999999,
            saleStartTime: saleStartTime.toISOString(),
            saleEndTime: saleEndTime.toISOString(),
          };

          const newTicket = await new VenuApiController().addTicket(updatedEvent.eventId, ticketData);
          updatedEvent.tickets.push(newTicket);
        }
      }
      if (showToast) {
        toast.success('Single event updated successfully.');
      }
    } else if (updatedEvent.status) {
      // Create new event
      const eventDataToCreate = {
        name: updatedEvent.name,
        date: updatedEvent.date,
        startTime: updatedEvent.startTime,
        endTime: updatedEvent.endTime,
        lastEntryTime: updatedEvent.lastEntryTime,
        image: updatedEvent.image,
        limitQuantity: updatedEvent.limitQuantity,
        status: 'upcoming',
        siteId: siteId,
        isSingleEvent: true,
      };

      const eventResponse = await new VenuApiController().createEvent(eventDataToCreate);
      if (eventResponse && !eventResponse.message) {
        const eventId = eventResponse._id;
        // Create ticket for the new event
        const ticketResponse = await createTicketForSingleEvent(eventId, updatedEvent);

        if (ticketResponse) {
          if (showToast) {
            toast.success('Single event and ticket created successfully.');
          }
          // Update singleEvents with new eventId and ticket
          setSingleEvents((prevEvents) => {
            const updatedEvents = [...prevEvents];
            updatedEvents[index] = {
              ...updatedEvents[index],
              eventId: eventId,
              isExistingEvent: true,
              tickets: [ticketResponse],
            };
            return updatedEvents;
          });
        } else {
          toast.error('Failed to create event ticket.');
        }
      } else {
        toast.error('Failed to create event.');
      }
    }
  } catch (error) {
    console.error(error);
    toast.error('Failed to save single event.');
  }
};


const createTicketForSingleEvent = async (eventId, updatedEvent) => {
  try {
    // Validate input parameters
    if (!eventId) throw new Error("Invalid event ID");
    if (!updatedEvent || !updatedEvent.date || !updatedEvent.startTime || !updatedEvent.endTime) {
      throw new Error("Missing required event data");
    }

    // Calculate sale start and end times
    const saleStartTime = getSaleStartTimeForSingleEvent(updatedEvent.date, updatedEvent.startTime);
    const saleEndTime = getSaleEndTimeForSingleEvent(
      updatedEvent.date,
      updatedEvent.startTime,
      updatedEvent.endTime
    );

    // Ensure price and quantity are valid
    const price = parseFloat(updatedEvent.price);
    if (isNaN(price)) throw new Error("Invalid price value");

    const totalQuantity = updatedEvent.limitQuantity
      ? parseInt(updatedEvent.quantity) || 300
      : 999999;
    const availableQuantity = updatedEvent.limitQuantity
      ? parseInt(updatedEvent.quantity) || 300
      : 999999;

    // Ticket data for the "Skips" ticket
    const skipsTicketData = {
      name: 'Skips',
      type: 'skip',
      price: price, // Assuming "Skips" tickets are free or have a default price of 0
      totalQuantity: totalQuantity,
      availableQuantity: availableQuantity,
      saleStartTime: saleStartTime.toISOString(),
      saleEndTime: saleEndTime.toISOString(),
    };

    // Ticket data for the "Queue Ticket"
    const queueTicketData = {
      name: 'Ticketing',
      type: 'queue',
      price: price,
      totalQuantity: totalQuantity,
      availableQuantity: availableQuantity,
      saleStartTime: saleStartTime.toISOString(),
      saleEndTime: saleEndTime.toISOString(),
    };

    // Create the "Skips" ticket
    const skipsTicketResponse = await new VenuApiController().addTicket(eventId, skipsTicketData);
    if (!skipsTicketResponse) throw new Error("Failed to create Skips ticket");

    // Create the "Queue Ticket"
    const queueTicketResponse = await new VenuApiController().addTicket(eventId, queueTicketData);
    if (!queueTicketResponse) throw new Error("Failed to create Queue Ticket");

    return { success: true, tickets: [skipsTicketResponse, queueTicketResponse] };
  } catch (error) {
    console.error('Error creating tickets:', error.message);
    return { success: false, error: error.message };
  }
};

const handleAddSESkipClose = () => {
  setPopupVisible(false); // Close the Add Single Event modal
  // Optionally, refresh the events within AddSkipping if needed
  setLoading(true);
  fetchEvents();
};


const getSaleStartTimeForSingleEvent = (date, startTime) => {
  const [startHours, startMinutes] = startTime.split(':');
  const saleStartTime = new Date(date);
  saleStartTime.setHours(startHours, startMinutes, 0, 0);
  return saleStartTime;
};

const getSaleEndTimeForSingleEvent = (date, startTime, endTime) => {
  const [startHours, startMinutes] = startTime.split(':');
  const [endHours, endMinutes] = endTime.split(':');

  const saleStartTime = new Date(date);
  saleStartTime.setHours(startHours, startMinutes, 0, 0);

  const saleEndTime = new Date(date);
  saleEndTime.setHours(endHours, endMinutes, 0, 0);

  // Check if end time is earlier than start time (crosses midnight)
  if (
    parseInt(endHours) < parseInt(startHours) ||
    (parseInt(endHours) === parseInt(startHours) &&
      parseInt(endMinutes) < parseInt(startMinutes))
  ) {
    saleEndTime.setDate(saleEndTime.getDate() + 1);
  }

  return saleEndTime;
};

const handleSaveAllSingleEvents = async () => {
  setIsSaving(true); // Disable button
  for (let index = 0; index < singleEvents.length; index++) {
    await handleSingleEventSave(index, false);
  }
  if (!hasErrorOccurred) {
  toast.success('All single events saved successfully.');
  }
  setIsSaving(false);
};


if (loading) {
  return (
    <CContainer
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <CSpinner color="primary" />
    </CContainer>
  )
}
  return (
    <>
      <div className="table-responsive">
        <CTable className="order-table" style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell className="table-header-cell addskp">Day</CTableHeaderCell>
              <CTableHeaderCell className="table-header-cell addskp">Event Name</CTableHeaderCell>
              <CTableHeaderCell className="table-header-cell addskp">Status</CTableHeaderCell>
              <CTableHeaderCell className="table-header-cell addskp">Opening Times</CTableHeaderCell>
              <CTableHeaderCell className="table-header-cell addskp">Price</CTableHeaderCell>
              <CTableHeaderCell className="table-header-cell addskp">Last Entry Time</CTableHeaderCell>
              <CTableHeaderCell className="table-header-cell addskp">Limit Quantity</CTableHeaderCell>
              <CTableHeaderCell className="table-header-cell addskp">Event Image</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {daysOfWeek.map(({ name: dayName }) => {
              const event = eventData[dayName];
              const isDisabled = !event.status;

              return (
                <CTableRow key={dayName}>
                  {/* Day Name */}
                  <CTableDataCell>{dayName}</CTableDataCell>
                  {/* Event Name */}
                  <CTableDataCell>
                    <CFormInput
                      value={event.name}
                      onChange={(e) => handleInputChange(dayName, 'name', e.target.value)}
                      placeholder="Event Name"
                      disabled={isDisabled}
                      style={{ backgroundColor: isDisabled ? '#f0f0f0' : 'white' }}
                    />
                  </CTableDataCell>
                  {/* Status Toggle */}
                  <CTableDataCell>
                    <label className="toggle-container">
                      <input
                        type="checkbox"
                        checked={event.status}
                        onChange={(e) => handleToggleChange(dayName, 'status', e.target.checked)}
                        className="toggle-input"
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </CTableDataCell>
                  {/* Opening Times */}
                  <CTableDataCell>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {/* Start Time Picker */}
                      <DatePicker
                        selected={
                          event.startTime
                            ? new Date(`1970-01-01T${event.startTime}:00`)
                            : null
                        }
                        onChange={(date) => {
                          const timeString = date.toTimeString().slice(0, 5);
                          handleInputChange(dayName, 'startTime', timeString);
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Start Time"
                        dateFormat="HH:mm"
                        disabled={isDisabled}
                        placeholderText="Start Time"
                      />
                      {/* End Time Picker */}
                      <DatePicker
                        selected={
                          event.endTime
                            ? new Date(`1970-01-01T${event.endTime}:00`)
                            : null
                        }
                        onChange={(date) => {
                          const timeString = date.toTimeString().slice(0, 5);
                          handleInputChange(dayName, 'endTime', timeString);
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="End Time"
                        dateFormat="HH:mm"
                        disabled={isDisabled}
                        placeholderText="End Time"
                      />
                    </div>
                  </CTableDataCell>
                  {/* Price */}
                  <CTableDataCell>
                    <CFormInput
                      type="number"
                      value={event.price}
                      onChange={(e) => handleInputChange(dayName, 'price', e.target.value)}
                      disabled={isDisabled}
                      placeholder="Price"
                      style={{ backgroundColor: isDisabled ? '#f0f0f0' : 'white' }}
                    />
                  </CTableDataCell>
                  {/* Last Entry Time */}
                  <CTableDataCell>
                    <DatePicker
                      selected={
                        event.lastEntryTime
                          ? new Date(`1970-01-01T${event.lastEntryTime}:00`)
                          : null
                      }
                      onChange={(date) => {
                        const timeString = date.toTimeString().slice(0, 5);
                        handleInputChange(dayName, 'lastEntryTime', timeString);
                      }}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Last Entry Time"
                      dateFormat="HH:mm"
                      disabled={isDisabled}
                      placeholderText="Last Entry Time"
                    />
                  </CTableDataCell>
                  {/* Limit Quantity */}
                  <CTableDataCell>
                    <label className="toggle-container">
                    <input
                      type="checkbox"
                      checked={event.limitQuantity}
                      onChange={(e) =>
                        handleToggleChange(dayName, 'limitQuantity', e.target.checked)
                      }
                      className="toggle-input"
                      disabled={isDisabled}
                    />
                      <span className="toggle-slider"></span>
                    </label>
                    {event.limitQuantity && !isDisabled && (
                      <CButton
                        size="sm"
                        style={{ marginLeft: '5px', backgroundColor: 'transparent' }}
                        onClick={() => {
                          setPopupTitle('Enter Quantity');
                          setPopupChildren(
                            <EnterQuantity
                              initialQuantity={event.quantity || 300}
                              onSave={(quantity) => {
                                handleInputChange(dayName, 'quantity', quantity);
                                setPopupVisible(false);
                              }}
                            />
                          );
                          setPopupVisible(true);
                        }}
                      >
                        <img src={editIcon} style={{ width: '15px', height: '15px' }} alt="Edit" />
                      </CButton>
                    )}
                  </CTableDataCell>
                  {/* Event Image */}
                  <CTableDataCell>
                    {event.image ? (
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <img
                          src={event.image}
                          alt="Event"
                          style={{
                            width: 'auto',
                            height: '50px',
                            objectFit: 'cover',
                            border: '5px solid #EDEDEE',
                            borderRadius: '10px',
                          }}
                        />
                        <CButton
                          size="l"
                          style={{ backgroundColor: '#E31B54' }}
                          onClick={() => handleDeleteImage(dayName)}
                          // disabled={isDisabled}
                        >
                          <img
                            src={deleteIcon}
                            alt="Delete file"
                            style={{ width: '15px', height: '15px' }}
                          />
                        </CButton>
                      </div>
                    ) : (
                      <>
                        <CButton
                          size="l"
                          style={{ backgroundColor: '#EDEDEE' }}
                          onClick={() => handleButtonClick(dayName)}
                          // disabled={isDisabled}
                        >
                          <img
                            src={chosen_fileIcon}
                            alt="Choose file"
                            style={{ width: '15px', height: '15px' }}
                          />
                        </CButton>
                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={(el) => (fileInputRefs.current[dayName] = el)}
                          onChange={(e) => handleFileChange(e, dayName)}
                          style={{ display: 'none' }}
                        />
                      </>
                    )}
                  </CTableDataCell>
                </CTableRow>
              );
            })}
{singleEvents.length > 0 && (
  <CTableRow>
    <CTableDataCell colSpan="8" style={{ textAlign: 'center', fontWeight: 'bold' }}>
      Single Events
    </CTableDataCell>
  </CTableRow>
)}

{singleEvents.map((event, index) => {
  const isDisabled = !event.status;

  return (
    <CTableRow key={`single-event-${index}`}>
      {/* Event Date */}
      <CTableDataCell>
        {new Date(event.date).toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </CTableDataCell>
      {/* Event Name */}
      <CTableDataCell>
        <CFormInput
          value={event.name}
          onChange={(e) => handleSingleEventInputChange(index, 'name', e.target.value)}
          placeholder="Event Name"
          disabled={isDisabled}
          style={{ backgroundColor: isDisabled ? '#f0f0f0' : 'white' }}
        />
      </CTableDataCell>
      {/* Status Toggle */}
      <CTableDataCell>
        <label className="toggle-container">
          <input
            type="checkbox"
            checked={event.status}
            onChange={(e) => handleSingleEventToggleChange(index, 'status', e.target.checked)}
            className="toggle-input"
          />
          <span className="toggle-slider"></span>
        </label>
      </CTableDataCell>
      {/* Opening Times */}
      <CTableDataCell>
        <div style={{ display: 'flex', gap: '5px' }}>
          {/* Start Time Picker */}
          <DatePicker
            selected={
              event.startTime
                ? new Date(`1970-01-01T${event.startTime}:00`)
                : null
            }
            onChange={(date) => {
              const timeString = date.toTimeString().slice(0, 5);
              handleSingleEventInputChange(index, 'startTime', timeString);
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Start Time"
            dateFormat="HH:mm"
            disabled={isDisabled}
            placeholderText="Start Time"
          />
          {/* End Time Picker */}
          <DatePicker
            selected={
              event.endTime
                ? new Date(`1970-01-01T${event.endTime}:00`)
                : null
            }
            onChange={(date) => {
              const timeString = date.toTimeString().slice(0, 5);
              handleSingleEventInputChange(index, 'endTime', timeString);
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="End Time"
            dateFormat="HH:mm"
            disabled={isDisabled}
            placeholderText="End Time"
          />
        </div>
      </CTableDataCell>
      {/* Price */}
      <CTableDataCell>
        <CFormInput
          type="number"
          value={event.price}
          onChange={(e) => handleSingleEventInputChange(index, 'price', e.target.value)}
          disabled={isDisabled}
          placeholder="Price"
          style={{ backgroundColor: isDisabled ? '#f0f0f0' : 'white' }}
        />
      </CTableDataCell>
      {/* Last Entry Time */}
      <CTableDataCell>
        <DatePicker
          selected={
            event.lastEntryTime
              ? new Date(`1970-01-01T${event.lastEntryTime}:00`)
              : null
          }
          onChange={(date) => {
            const timeString = date.toTimeString().slice(0, 5);
            handleSingleEventInputChange(index, 'lastEntryTime', timeString);
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Last Entry Time"
          dateFormat="HH:mm"
          disabled={isDisabled}
          placeholderText="Last Entry Time"
        />
      </CTableDataCell>
      {/* Limit Quantity */}
      <CTableDataCell>
        <label className="toggle-container">
          <input
            type="checkbox"
            checked={event.limitQuantity}
            onChange={(e) =>
              handleSingleEventToggleChange(index, 'limitQuantity', e.target.checked)
            }
            className="toggle-input"
            disabled={isDisabled}
          />
          <span className="toggle-slider"></span>
        </label>
        {event.limitQuantity && !isDisabled && (
          <CButton
            size="sm"
            style={{ marginLeft: '5px', backgroundColor: 'transparent' }}
            onClick={() => {
              setPopupTitle('Enter Quantity');
              setPopupChildren(
                <EnterQuantity
                  initialQuantity={event.quantity || 300}
                  onSave={(quantity) => {
                    handleSingleEventInputChange(index, 'quantity', quantity);
                    setPopupVisible(false);
                  }}
                />
              );
              setPopupVisible(true);
            }}
          >
            <img src={editIcon} style={{ width: '15px', height: '15px' }} alt="Edit" />
          </CButton>
        )}
      </CTableDataCell>
      {/* Event Image */}
      <CTableDataCell>
        {event.image ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <img
              src={event.image}
              alt="Event"
              style={{
                width: 'auto',
                height: '50px',
                objectFit: 'cover',
                border: '5px solid #EDEDEE',
                borderRadius: '10px',
              }}
            />
            <CButton
              size="l"
              style={{ backgroundColor: '#E31B54' }}
              onClick={() => handleDeleteSingleEventImage(index)}
              // disabled={isDisabled}
            >
              <img
                src={deleteIcon}
                alt="Delete file"
                style={{ width: '15px', height: '15px' }}
              />
            </CButton>
          </div>
        ) : (
          <>
            <CButton
              size="l"
              style={{ backgroundColor: '#EDEDEE' }}
              onClick={() => handleSingleEventButtonClick(index)}
              // disabled={isDisabled}
            >
              <img
                src={chosen_fileIcon}
                alt="Choose file"
                style={{ width: '15px', height: '15px' }}
              />
            </CButton>
            {/* Hidden file input */}
            <input
              type="file"
              ref={(el) => (singleFileInputRefs.current[index] = el)}
              onChange={(e) => handleSingleEventFileChange(e, index)}
              style={{ display: 'none' }}
            />
          </>
        )}
      </CTableDataCell>
    </CTableRow>
          );
        })}

          </CTableBody>
        </CTable>
      </div>

      {/* Add Single Event and Save Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          gap: '25px',
          marginTop: '20px',
        }}
      >
        <CButton
          color="success text-white"
          style={{
            flex: 1,
            marginRight: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            borderRadius: '15px',
            padding: '0px 20px',
            backgroundColor: 'black',
            border: 'none',
            height: '43px',
          }}
          onClick={() => {
            setPopupTitle('Add Single Event Skip');
            setPopupChildren(
              <AddSESkip
                siteId={siteId}
                onClose={handleAddSESkipClose}
                onEventAdded={() => {
                  // Refresh events after adding a new one
                  setLoading(true);
                  setPopupVisible(false);
                  // Re-fetch events
                  const fetchEvents = async () => {
                    try {
                      const res = await new VenuApiController().getAllEvents({ siteId });
                      // Update eventData accordingly (same as in useEffect)
                      // ...
                      setLoading(false);
                    } catch (error) {
                      console.error(error);
                      setLoading(false);
                    }
                  };
                  fetchEvents();
                }}
              />
            );
            setPopupVisible(true);
          }}
        >
          Add Single Event
        </CButton>
        <CButton
          color="success text-white"
          style={{
            flex: 1,
            marginLeft: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            borderRadius: '15px',
            padding: '0px 20px',
            backgroundColor: '#1DB954',
            border: 'none',
            height: '43px',
          }}
          onClick={async () => {
            await handleSaveAll();
            await handleSaveAllSingleEvents();
          }}
          disabled={isSaving}
        >
          Save All
        </CButton>
      </div>

      {/* Popup for Enter Quantity and Add Single Event */}
      {popupVisible && (
        <PopupModelBase
          visible={popupVisible}
          onClose={() => {
            setPopupVisible(false);
          }}
          title={popupTitle}
          children={popupChildren}
        />
      )}
    </>
  );
};

const EnterQuantity = ({ initialQuantity, onSave }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!quantity) {
      toast.warning('Please enter quantity limit');
      return;
    }

    onSave(quantity);
  };

  // Restrict non-numeric input
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
    }
  };

  return (
    <CForm className="w-100 px-4" style={{ backgroundColor: 'white' }}>
      <div className="mb-3">
        <CFormInput
          type="number"
          onChange={handleQuantityChange}
          value={quantity}
          placeholder="Enter quantity limit"
          autoComplete="quantitylimit"
          size="lg"
          className="setting-input"
        />
      </div>

      <div style={{ padding: '15px 0px' }}>
        <CButton color="success text-white" className="model-save-btn" onClick={handleSubmit}>
          Save
        </CButton>
      </div>
    </CForm>
  );
};





const AddSESkip = ({ siteId,onClose, onEventAdded }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(null); // Use null to start with no date selected
  const [price, setPrice] = useState('');
  const [tickets, setTickets] = useState(''); // Total quantity of tickets
  const [openingTime, setOpeningTime] = useState('');
  const [openingEndTime, setOpeningEndTime] = useState('');
  const [lastEntryTime, setLastEntryTime] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  console.log(siteId);

  // Handle file upload to Firebase
  const uploadImageToFirebase = async (file) => {
    const storageRef = ref(storage, `event-images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

    // New functions for calculating sale times
    const getSaleStartTimeForSingleEvent = (date, startTime) => {
      const [startHours, startMinutes] = startTime.split(':');
      const saleStartTime = new Date(date);
      saleStartTime.setHours(startHours, startMinutes, 0, 0);
      return saleStartTime;
    };
  
    const getSaleEndTimeForSingleEvent = (date, startTime, endTime) => {
      const [startHours, startMinutes] = startTime.split(':');
      const [endHours, endMinutes] = endTime.split(':');
  
      const saleStartTime = new Date(date);
      saleStartTime.setHours(startHours, startMinutes, 0, 0);
  
      const saleEndTime = new Date(date);
      saleEndTime.setHours(endHours, endMinutes, 0, 0);
  
      // Check if end time is earlier than start time (crosses midnight)
      if (
        parseInt(endHours) < parseInt(startHours) ||
        (parseInt(endHours) === parseInt(startHours) &&
          parseInt(endMinutes) < parseInt(startMinutes))
      ) {
        saleEndTime.setDate(saleEndTime.getDate() + 1);
      }
  
      return saleEndTime;
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name) {
      toast.warning('Please enter event name');
      return;
    }
    if (!date) {
      toast.warning('Please select a date');
      return;
    }
    if (!price) {
      toast.warning('Please enter event price');
      return;
    }
    if (!tickets) {
      toast.warning('Please enter the number of tickets');
      return;
    }
    if (!openingTime || !openingEndTime) {
      toast.warning('Please enter valid opening and closing times');
      return;
    }

    try {
      // Upload image if available
      let imageUrl = '';
      if (file) {
        imageUrl = await uploadImageToFirebase(file);
      }

      // Prepare event data
      const eventData = {
        name,
        date: date.toISOString(),
        startTime: openingTime,
        endTime: openingEndTime,
        lastEntryTime,
        image: imageUrl,
        siteId: siteId,
        status: 'upcoming',
        singleEvent: true,
      };

      // Create the Event
      const eventResponse = await new VenuApiController().createEvent(eventData);
      if (eventResponse && !eventResponse.message) {
        const eventId = eventResponse._id;

        // Calculate saleStartTime and saleEndTime using new functions
        const saleStartTime = getSaleStartTimeForSingleEvent(date, openingTime);
        const saleEndTime = getSaleEndTimeForSingleEvent(
          date,
          openingTime,
          openingEndTime
        );


        // Prepare ticket data
        const ticketsData = [
          {
            name: 'Skips',
            type: 'skip',
            price: parseFloat(price), // Assuming Skips are free or have a different price logic
            totalQuantity: parseInt(tickets),
            availableQuantity: parseInt(tickets),
            saleStartTime: saleStartTime.toISOString(),
            saleEndTime: saleEndTime.toISOString(),
          },
          {
            name: 'Ticketing', // Or 'Queue Ticket' if that's your naming convention
            type: 'queue',
            price: parseFloat(price),
            totalQuantity: parseInt(tickets),
            availableQuantity: parseInt(tickets),
            saleStartTime: saleStartTime.toISOString(),
            saleEndTime: saleEndTime.toISOString(),
          },
        ];

        // Add both tickets to the event
        for (const ticketData of ticketsData) {
          const ticketResponse = await new VenuApiController().addTicket(eventId, ticketData);
          if (!ticketResponse || ticketResponse.message) {
            toast.error('Failed to create event tickets.');
            return;
          }
        }

        toast.success('Event and tickets created successfully.');

        // Call the onEventAdded callback to refresh events
        if (onEventAdded) {
          onEventAdded();
        }
      } else {
        toast.error('Failed to create event.');
      }
    } catch (error) {
      toast.error('Failed to create event.');
      console.error('Error creating event:', error);
    }
  };
  return (
    <CForm className="w-100 px-4" style={{ backgroundColor: 'white' }}>
      {/* Event Name */}
      <div className="mb-3">
        <h3 className="setting-label">Event Name</h3>
        <CFormInput
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Enter event name"
          size="lg"
          className="setting-input"
        />
      </div>

      {/* Date Picker */}
      <div className="mb-3">
        <h3 className="setting-label">Date</h3>
        <DatePicker
          selected={date}
          onChange={(newDate) => setDate(newDate)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date"
          className="setting-input"
        />
      </div>

      {/* Opening Times */}
      <div className="mb-3">
        <h3 className="setting-label">Opening Start Time</h3>
        <DatePicker
          selected={
            openingTime ? new Date(`1970-01-01T${openingTime}:00`) : null
          }
          onChange={(date) => {
            const timeString = date.toTimeString().slice(0, 5);
            setOpeningTime(timeString);
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Start Time"
          dateFormat="HH:mm"
          placeholderText="Select start time"
          className="setting-input"
        />
      </div>

      <div className="mb-3">
          <h3 className="setting-label">Opening End Time</h3>
          <DatePicker
            selected={
              openingEndTime ? new Date(`1970-01-01T${openingEndTime}:00`) : null
            }
            onChange={(date) => {
              const timeString = date.toTimeString().slice(0, 5);
              setOpeningEndTime(timeString);
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="End Time"
            dateFormat="HH:mm"
            placeholderText="Select end time"
            className="setting-input"
          />
        </div>

      {/* Event Price */}
      <div className="mb-3">
        <h3 className="setting-label">Event Price</h3>
        <div className="input-with-symbol">
          <CFormInput
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            placeholder="Enter price"
            size="lg"
            className="setting-input-with-symbol"
            min="0"
            step="0.01"
          />
          <span className="symbol">£</span>
        </div>
      </div>

      {/* Number of Tickets */}
      <div className="mb-3">
        <h3 className="setting-label">Number of Tickets</h3>
        <CFormInput
          type="number"
          onChange={(e) => setTickets(e.target.value)}
          value={tickets}
          placeholder="Enter number of tickets"
          size="lg"
          className="setting-input"
          min="1"
        />
      </div>

      {/* Last Entry Time */}
      <div className="mb-3">
        <h3 className="setting-label">Last Entry Time</h3>
        <DatePicker
          selected={
            lastEntryTime ? new Date(`1970-01-01T${lastEntryTime}:00`) : null
          }
          onChange={(date) => {
            const timeString = date.toTimeString().slice(0, 5);
            setLastEntryTime(timeString);
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Last Entry Time"
          dateFormat="HH:mm"
          placeholderText="Select last entry time"
          className="setting-input"
        />
      </div>

      {/* File Upload */}
      <div className="mb-3">
        <h3 className="setting-label">Event Image (Optional)</h3>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '100%' }}>
          <input
            type="text"
            readOnly
            value={file ? file.name : ''}
            placeholder="No file chosen"
            className="setting-input"
          />
          <button
            type="button"
            onClick={handleButtonClick}
            className="setting-btn"
          >
            <img src={chosen_fileIcon} alt="Choose file" className="setting-input-img" />
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg,.png,.gif"
          style={{ display: 'none' }} // Hide the default input
        />
      </div>

      {/* Save Button */}
      <div style={{ padding: '15px 0px' }}>
        <CButton color="success text-white" className="model-save-btn" onClick={handleSubmit}>
          Save
        </CButton>
      </div>
    </CForm>
  );
};


const AddNewLocation = ({ onClose, onSiteCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('test@gmail.com');
  const [phone, setPhone] = useState('+1234567');
  const [logo, setLogo] = useState(null);
  const fileInputRef = useRef(null);

  // Country and State selection
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const uploadLogoToFirebase = async (file) => {
    try {
      const storageRef = ref(storage, `logos/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading logo to Firebase:", error);
      throw error;
    }
  }

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = () => {
    fetch('https://countriesnow.space/api/v0.1/countries')
      .then((response) => response.json())
      .then((data) => {
        const countryOptions = data.data.map((country) => ({
          value: country.country,
          label: country.country,
        }));
        setCountries(countryOptions);
      })
      .catch((error) => {
        console.error('Error fetching countries: ', error);
      });
  };

  const fetchStates = (countryName) => {
    fetch('https://countriesnow.space/api/v0.1/countries/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: countryName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data.states)) {
          const stateOptions = data.data.states.map((state) => ({
            value: state.name,
            label: state.name,
          }));
          setStates(stateOptions);
        } else {
          setStates([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching states: ', error);
        setStates([]);
      });
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);
    fetchStates(selectedOption.label);
  };

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
  };

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !logo || !selectedCountry || !selectedState) {
      toast.warning('Please fill all required fields and upload a logo.');
      return;
    }

    try {
      // Upload logo to Firebase and get URL
      const logoUrl = await uploadLogoToFirebase(logo);

      const location = `${selectedState.label}, ${selectedCountry.label}`;

      const payload = {
        name,
        email,
        phone,
        logo: logoUrl,
        location,
        skipping: true,  // Set default values or include fields as needed
        ticketing: true,
      };

      const response = await new VenuApiController().createVenue(payload);
      if (response) {
        toast.success('Site created successfully.');
        onSiteCreated(response);
      }
    } catch (error) {
      toast.error('Failed to create site.');
      console.error(error);
    }
  };

  return (
    <CForm className="w-100 px-4" onSubmit={handleSubmit}>
      {/* Site Name */}
      <div className="mb-3">
        <h3 className="setting-label">Name</h3>
        <CFormInput
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Enter site name"
          size="lg"
          className="setting-input"
        />
      </div>

      {/* Email */}
      {/* <div className="mb-3">
        <h3 className="setting-label">Email</h3>
        <CFormInput
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Enter email"
          size="lg"
          className="setting-input"
        />
      </div> */}

      {/* Phone */}
      {/* <div className="mb-3">
        <h3 className="setting-label">Phone</h3>
        <CFormInput
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          placeholder="Enter phone number"
          size="lg"
          className="setting-input"
        />
      </div> */}

      {/* Country Selection */}
      <div className="mb-3">
        <h3 className="setting-label">Country</h3>
        <Select
          value={selectedCountry}
          onChange={handleCountryChange}
          options={countries}
          placeholder="Select Country"
        />
      </div>

      {/* State Selection */}
      <div className="mb-3">
        <h3 className="setting-label">State</h3>
        <Select
          value={selectedState}
          onChange={handleStateChange}
          options={states}
          placeholder="Select State"
          isDisabled={!selectedCountry}
        />
      </div>

      {/* Logo Upload */}
      <div className="mb-3">
        <h3 className="setting-label">Logo</h3>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '100%' }}>
          <input
            type="text"
            readOnly
            value={logo ? logo.name : ''}
            placeholder="No file chosen"
            className="setting-input"
          />
          <button
            type="button"
            onClick={handleButtonClick}
            className="setting-btn"
          >
            <img src={chosen_fileIcon} alt="Choose file" className="setting-input-img" />
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg,.png,.gif"
          style={{ display: 'none' }}
        />
      </div>

      {/* Save and Cancel Buttons */}
      <div style={{ padding: '15px 0px' }}>
        <CButton color="success text-white" className="model-save-btn" type="submit">
          Save
        </CButton>
      </div>

      <div style={{ padding: '5px 0px' }}>
        <CButton color="secondary" className="model-save-btn" onClick={onClose}>
          Cancel
        </CButton>
      </div>
    </CForm>
  );
};
export default TKPage


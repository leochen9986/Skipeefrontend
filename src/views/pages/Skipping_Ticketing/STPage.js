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

const STPage = ({ site }) => {
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
    new VenuApiController().getSitesByOwnerSkipping(userId).then((res) => {
      if (res.message) {
        toast.error(res.message);
      } else {
        setSites(res);

        // Create tabs data
        const tabsData = res.map((site, index) => ({
          key: index + 1, // Start from 1, since 0 is "All"
          label: site.location || site.name,
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
    { key: 1, label: 'Westbury St', content: <div>{/*Archived Content*/}</div> },
    { key: 2, label: 'Frewin Ct', content: <div>{/*Archived Content*/}</div> }
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
            <AllEventsTab query={{ ...query, status: 'upcoming' }} profile={profile} siteId={siteId}/>
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

  
  const handleToggle = (index, type) => {
    const updatedToggles = [...toggles];
    updatedToggles[index][type] = !updatedToggles[index][type];
    setToggles(updatedToggles);
  };


  const loadEvents = () => {
    if (!query || Object.keys(query).length === 0) {
      // If query is undefined or empty, don't send the API request
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
        <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
          <img src="/src/assets/images/noEventWidget.svg" alt="noEvent" width="60%" />
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
                                checked={isToggled}
                                onChange={handleToggle}
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
                      {event.tickets.map((ticket, ticketIndex) => (
                        <div key={ticketIndex}>
                          <div className="footer-space">
                            <span className="footer-label">Price</span>
                            <span className="footer-content">
                              £{parseFloat(ticket.price).toFixed(2)}
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
                            <span className="footer-content">{/* Last entry data here */}</span>
                          </div>
                        </div>
                      ))}
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
            setPopupChildrenW(<AddSkipping siteId={siteId} />);
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
          Add Skipping
          <span style={{ fontSize: '2rem', marginLeft: '5px', fontWeight: '200' }}>+</span>
        </CButton>
      </div>
  
      <PopupModelBaseWidth
        visible={popupVisibleW}
        onClose={() => {
          setPopupVisibleW(false);
        }}
        title="Add Skipping"
        children={popupChildrenW}
      />
    </>
  );
  
};

const PastEventsTab = ({ query, event, onProceed }) => {
  const [eventsList, setEventsList] = React.useState([]);

  const loadEvents = () => {
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



const AddSkipping = ({ siteId }) => {
  const [eventData, setEventData] = useState({});
  const [eventsByDay, setEventsByDay] = useState({});
  const [loading, setLoading] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupChildren, setPopupChildren] = useState(null);
  const [popupTitle, setPopupTitle] = useState('');
  const fileInputRefs = useRef({});

  // Days of the week starting from Sunday (getDay() returns 0-6, Sunday to Saturday)
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await new VenuApiController().getAllEvents({ siteId });
        if (res.message) {
          // toast.error(res.message);
          console.log("noevent");
        } else {
          // Initialize eventsByDay with empty arrays for each day
          const eventsByDayTemp = {};
          daysOfWeek.forEach((day) => {
            eventsByDayTemp[day] = [];
          });

          // Initialize eventData
          const initialEventData = {};

          // Group events by day of the week and initialize eventData
          res.forEach((event) => {
            const eventDate = new Date(event.date);
            const dayName = daysOfWeek[eventDate.getDay()];
            eventsByDayTemp[dayName].push(event);

            initialEventData[event._id] = {
              name: event.name,
              startTime: event.startTime,
              endTime: event.endTime,
              price: event.tickets?.[0]?.price || '',
              lastEntryTime: event.lastEntryTime || '',
              limitQuantity: event.limitQuantity || false,
              status: event.status === 'upcoming',
              image: event.image || null,
              quantity: event.tickets?.[0]?.totalQuantity || '',
              tickets: event.tickets,
            };
          });

          setEventsByDay(eventsByDayTemp);
          setEventData(initialEventData);
        }
      } catch (error) {
        toast.error('Failed to load events');
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [siteId]);

  const handleInputChange = (eventId, field, value) => {
    setEventData((prevData) => ({
      ...prevData,
      [eventId]: {
        ...prevData[eventId],
        [field]: value,
      },
    }));
  };

  const handleSaveAll = async () => {
    // Save all events
    for (const eventId of Object.keys(eventData)) {
      await handleSave(eventId, false); // Pass false to prevent multiple toasts
    }
    toast.success('All changes saved successfully.');
  };

  const handleSave = async (eventId, showToast = true) => {
    const updatedEvent = eventData[eventId];
    try {
      // Prepare data for API call
      const eventUpdateData = {
        name: updatedEvent.name,
        startTime: updatedEvent.startTime,
        endTime: updatedEvent.endTime,
        lastEntryTime: updatedEvent.lastEntryTime,
        status: updatedEvent.status ? 'upcoming' : 'on hold',
        image: updatedEvent.image,
        limitQuantity: updatedEvent.limitQuantity,
      };

      // Update event details
      await new VenuApiController().updateEvent(eventId, eventUpdateData);

      // Update ticket price if necessary
      if (updatedEvent.tickets && updatedEvent.tickets.length > 0) {
        const ticketId = updatedEvent.tickets[0]._id;
        const ticketUpdateData = {
          price: updatedEvent.price,
          totalQuantity: updatedEvent.quantity,
          availableQuantity: updatedEvent.quantity, // Adjust as needed
        };
        await new VenuApiController().updateEventTicket(ticketId, ticketUpdateData);
      }

      if (showToast) {
        toast.success('Event updated successfully.');
      }
    } catch (error) {
      // toast.error('Failed to update event.');
      console.error(error);
    }
  };

  const handleToggleChange = (eventId, field, value) => {
    handleInputChange(eventId, field, value);
    // handleSave(eventId);
  };

  const handleButtonClick = (eventId) => {
    if (fileInputRefs.current[eventId]) {
      fileInputRefs.current[eventId].click();
    }
  };

  const handleFileChange = async (e, eventId) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Upload to Firebase and get download URL
        const downloadURL = await uploadImageToFirebase(file);

        // Update the local state
        handleInputChange(eventId, 'image', downloadURL);

        // Save the event to the backend
        // await handleSave(eventId);
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

  const handleDeleteImage = async (eventId) => {
    try {
      // Remove image from Firebase if necessary
      // Update the local state
      handleInputChange(eventId, 'image', null);

      // Save the event to the backend
      // await handleSave(eventId);
    } catch (error) {
      toast.error('Failed to delete image');
      console.error(error);
    }
  };

  if (loading) {
    return <CSpinner />;
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
            {daysOfWeek.map((day, index) => (
              <React.Fragment key={index}>
                {/* Check if there are events on this day */}
                {eventsByDay[day] && eventsByDay[day].length > 0 ? (
                  eventsByDay[day].map((event, eventIndex) => (
                    <CTableRow key={`${index}-${eventIndex}`}>
                      {/* Only show the day name for the first event of the day */}
                      {eventIndex === 0 ? (
                        <CTableDataCell rowSpan={eventsByDay[day].length}>{day}</CTableDataCell>
                      ) : null}
                      <CTableDataCell>
                        <CFormInput
                          value={eventData[event._id]?.name}
                          onChange={(e) => handleInputChange(event._id, 'name', e.target.value)}
                          onBlur={() => handleSave(event._id)}
                          className="event-name-input"
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        {/* Status toggle */}
                        <label className="toggle-container">
                          <input
                            type="checkbox"
                            checked={eventData[event._id]?.status}
                            onChange={(e) =>
                              handleToggleChange(event._id, 'status', e.target.checked)
                            }
                            className="toggle-input"
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <CFormInput
                            value={eventData[event._id]?.startTime}
                            onChange={(e) =>
                              handleInputChange(event._id, 'startTime', e.target.value)
                            }
                            onBlur={() => handleSave(event._id)}
                            placeholder="Start Time"
                            className="start-time-input"
                          />
                          <CFormInput
                            value={eventData[event._id]?.endTime}
                            onChange={(e) =>
                              handleInputChange(event._id, 'endTime', e.target.value)
                            }
                            onBlur={() => handleSave(event._id)}
                            placeholder="End Time"
                            className="end-time-input"
                          />
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="number"
                          value={eventData[event._id]?.price}
                          onChange={(e) => handleInputChange(event._id, 'price', e.target.value)}
                          onBlur={() => handleSave(event._id)}
                          className="price-input"
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          value={eventData[event._id]?.lastEntryTime}
                          onChange={(e) =>
                            handleInputChange(event._id, 'lastEntryTime', e.target.value)
                          }
                          onBlur={() => handleSave(event._id)}
                          className="last-entry-input"
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        {/* Limit Quantity toggle */}
                        <label className="toggle-container">
                          <input
                            type="checkbox"
                            checked={eventData[event._id]?.limitQuantity}
                            onChange={(e) =>
                              handleToggleChange(event._id, 'limitQuantity', e.target.checked)
                            }
                            className="toggle-input"
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        {eventData[event._id]?.limitQuantity && (
                          <CButton
                            size="sm"
                            style={{ marginLeft: '5px', backgroundColor: 'transparent' }}
                            onClick={() => {
                              setPopupTitle('Enter Quantity');
                              setPopupChildren(
                                <EnterQuantity
                                  eventId={event._id}
                                  initialQuantity={eventData[event._id]?.quantity || ''}
                                  onSave={async (quantity) => {
                                    handleInputChange(event._id, 'quantity', quantity);
                                    await handleSave(event._id);
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
                      <CTableDataCell>
                        {/* Event Image */}
                        {eventData[event._id]?.image ? (
                          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <img
                              src={eventData[event._id].image}
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
                              onClick={() => handleDeleteImage(event._id)}
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
                              onClick={() => handleButtonClick(event._id)}
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
                              ref={(el) => (fileInputRefs.current[event._id] = el)}
                              onChange={(e) => handleFileChange(e, event._id)}
                              style={{ display: 'none' }}
                            />
                          </>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  // If no events on this day, show an empty row with the day name
                  <CTableRow key={index}>
                    <CTableDataCell>{day}</CTableDataCell>
                    <CTableDataCell colSpan="7">No events scheduled.</CTableDataCell>
                  </CTableRow>
                )}
              </React.Fragment>
            ))}
          </CTableBody>
        </CTable>
      </div>

      {/* Add Single Event and Save Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '25px', marginTop: '20px' }}>
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
                onEventAdded={() => {
                  // Refresh events after adding a new one
                  setLoading(true);
                  setPopupVisible(false);
                  // Re-fetch events
                  const fetchEvents = async () => {
                    // ... same as before ...
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
          onClick={handleSaveAll}
        >
          Save
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

const EnterQuantity = () => {
  const [quantity, setQuantity] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!quantity) {
      toast.warning('Please enter quantity limit')
      return
    }

    new AuthApiController().register({ quantity }).then((res) => {
      if (res.message) {
        toast.error(res.message)
      } else {
        toast.success('Quantity saved successfully.')
        setQuantity('')
      }
    })
  }

  // Restrict non-numeric input
  const handleQuantityChange = (e) => {
    const value = e.target.value
    if (!isNaN(value) && value >= 0) {
      setQuantity(value)
    }
  }

  return (
    <CForm className="w-100 px-4" style={{backgroundColor:'white'}}>
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

      <div style={{padding:'15px 0px'}}>
        <CButton color="success text-white" className='model-save-btn' onClick={handleSubmit}>
          Save
        </CButton>
      </div>
    </CForm>
  )
}

const AddSESkip = ({ siteId, onEventAdded }) => {
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
      };

      // Create the Event
      const eventResponse = await new VenuApiController().createEvent(eventData);
      if (eventResponse && !eventResponse.message) {
        const eventId = eventResponse._id;

        // Calculate saleStartTime and saleEndTime
        const saleStartTime = new Date(`${date.toDateString()} ${openingTime}`);
        const saleEndTime = new Date(`${date.toDateString()} ${openingEndTime}`);

        // Prepare ticket data
        const ticketData = {
          name: 'Skip Ticket', // Customize as needed
          type: 'skip',
          price: parseFloat(price),
          totalQuantity: parseInt(tickets),
          availableQuantity: parseInt(tickets),
          saleStartTime: saleStartTime.toISOString(),
          saleEndTime: saleEndTime.toISOString(),
        };

        // Add the ticket to the event
        const ticketResponse = await new VenuApiController().addTickets(eventId, ticketData);
        if (ticketResponse && !ticketResponse.message) {
          toast.success('Event and ticket created successfully.');

          // Call the onEventAdded callback to refresh events
          if (onEventAdded) {
            onEventAdded();
          }
        } else {
          toast.error('Failed to create event ticket.');
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
        <CFormInput
          onChange={(e) => setOpeningTime(e.target.value)}
          value={openingTime}
          placeholder="Enter start time (e.g., 18:00)"
          autoComplete="off"
          size="lg"
          className="setting-input"
        />
      </div>

      <div className="mb-3">
        <h3 className="setting-label">Opening End Time</h3>
        <CFormInput
          onChange={(e) => setOpeningEndTime(e.target.value)}
          value={openingEndTime}
          placeholder="Enter end time (e.g., 23:00)"
          autoComplete="off"
          size="lg"
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
        <CFormInput
          onChange={(e) => setLastEntryTime(e.target.value)}
          value={lastEntryTime}
          placeholder="Enter last entry time (e.g., 22:00)"
          size="lg"
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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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

    if (!name || !email || !phone || !logo || !selectedCountry || !selectedState) {
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
        ticketing: false,
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
      <div className="mb-3">
        <h3 className="setting-label">Email</h3>
        <CFormInput
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Enter email"
          size="lg"
          className="setting-input"
        />
      </div>

      {/* Phone */}
      <div className="mb-3">
        <h3 className="setting-label">Phone</h3>
        <CFormInput
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          placeholder="Enter phone number"
          size="lg"
          className="setting-input"
        />
      </div>

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
        <CButton color="secondary" className="ml-2" onClick={onClose}>
          Cancel
        </CButton>
      </div>
    </CForm>
  );
};
export default STPage



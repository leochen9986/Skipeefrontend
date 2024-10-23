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
      }
      setLoading(false);
    });
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
    status: 'upcoming',
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
            <AllEventsTab query={{ ...query, status: 'upcoming' }} profile={profile} />
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



const AllEventsTab = ({ query, profile }) => {
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
    // API call
    new VenuApiController().getAllEvents(query).then((res) => {
      if (res.message) {
        toast.error(res.message);
      } else {
        setEventsList(res);
      }
    });
  };

  useEffect(() => {
    loadEvents();
  }, [query]);

  return (
    <>
      {eventsList.length === 0 ? (
        <div style={{justifyContent:'center',alignContent:'center',display:'flex'}}>
       
       <img src="/src/assets/images/noEventWidget.svg" alt="noEvent" width="60%"/> 
       </div>
      ) : (
        eventsList.map((event, index) => (
        <CContainer fluid className="container-events" key={index} >
          <CRow className="events-row" >
            <CCol md={6} className="events-col">
              <CCard className="mb-3">
                <CCardBody className='card-body-event'>
                  <CRow>
                    <CCol md={3} className="card-label" style={{width:'100%'}}>
                    <div style={{width:'100%', height:'450%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                      <strong style={{color:'#4E4E4E'}}>Event Name</strong> 
                      <div style={{ display: 'flex', justifyContent: 'space-between' ,width:'100%'}}>
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
                <CCardFooter className="card-footer"> {/* Added class for custom styles */}
                  <div style={{ padding:'3% 0px'}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className='footer-label'>Date</span>
                      <span className='footer-content'>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                    </div>
                    {event.tickets.map((ticket, ticketIndex) => (
                      <div key={ticketIndex}>
                        <div className='footer-space'>
                          <span className='footer-label'>Price</span>
                          <span className='footer-content'>£{parseFloat(ticket.price).toFixed(2)}</span>
                        </div>
                        <div className='footer-space'>
                          <span className='footer-label'><img src={opening_timeIcon} style={{ height: '13px', width: '13px' }} /> Opening Time</span>
                          <span className='footer-content'>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className='footer-space'>
                          <span className='footer-label'><img src={last_entryIcon} style={{ height: '13px', width: '13px' }} /> Last Entry</span>
                          <span className='footer-content'>{/* Last entry data here */}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
        

        
        ))
      )}

<div className='add-events-btn' >
      <CButton
        color="success text-white"
        siteId={profile?.worksIn?._id}
        onClick={() => {
          setPopupChildrenW(<AddTicketing siteId={profile?.worksIn?._id} />);
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
          setPopupVisibleW(false)
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
    // API call
    new VenuApiController().getAllEvents(query).then((res) => {
      if (res.message) {
        toast.error(res.message);
      } else {
        setEventsList(res);
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
        eventsList.map((event, index) => (
        <div className="table-responsive">
            <CTable className="order-table" style={{ border: '1px solid #ddd' ,borderRadius:'8px'}}>
              <CTableHead >
                <CTableRow>
                  <CTableHeaderCell className='table-header-cell' scope="col">Event Name</CTableHeaderCell>
                  <CTableHeaderCell className='table-header-cell' scope="col">Date</CTableHeaderCell>
                  <CTableHeaderCell className='table-header-cell'  scope="col">Opening Time</CTableHeaderCell>
                  <CTableHeaderCell className='table-header-cell' scope="col">Last Entry</CTableHeaderCell>
                  <CTableHeaderCell className='table-header-cell' scope="col">Price</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                        <CTableRow key={index}>
                          <CTableDataCell>{event.name}</CTableDataCell>
                          <CTableDataCell>
                            {`${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long' })} ${new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}
                          </CTableDataCell>
                          <CTableDataCell >{event.startTime} - {event.endTime}</CTableDataCell>
                          <CTableDataCell >{/* Last entry data here */}</CTableDataCell>
                        {event.tickets.map((ticket, ticketIndex) => (
                          <CTableDataCell>£{parseFloat(ticket.price).toFixed(2)}</CTableDataCell>
                        ))}
                        </CTableRow>
              </CTableBody>
            </CTable>
          </div>
                        
        ))
      )}
    </>
  );
};



const AddTicketing = ({ siteId ,profile}) => {
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
  const fileInputRef = useRef(null); 
  const [selectedImages, setSelectedImages] = useState({});
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [popupChildren, setPopupChildren] = React.useState(null);
  const [popupTitle, setPopupTitle] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fileInputRefs = useRef(days.map(() => React.createRef()));

  const [toggles, setToggles] = useState(
    days.map(() => ({ status: true, limitQuantity: false })) // Initial state for toggles
  );

  const handleToggle = (index, type) => {
    const updatedToggles = [...toggles];
    updatedToggles[index][type] = !updatedToggles[index][type];
    setToggles(updatedToggles);
  };

  const handleButtonClick = (index) => {
    // If an image is already selected, reset it
    if (selectedImages[index]) {
      const updatedImages = { ...selectedImages };
      delete updatedImages[index]; // Delete the selected image for this row
      setSelectedImages(updatedImages);
    } else {
      fileInputRefs.current[index].current.click(); // Trigger click on the hidden file input for this row
    }
  };

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a URL for the selected image
      setSelectedImages((prevImages) => ({
        ...prevImages,
        [index]: imageUrl, // Update the state with the selected image URL for this row
      }));
      console.log(`Selected file: ${file.name}`);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <>
      <div className="table-responsive">
        <CTable className="order-table" style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell className='table-header-cell addskp' scope="col">Day</CTableHeaderCell>
              <CTableHeaderCell className='table-header-cell addskp' scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell className='table-header-cell addskp' scope="col">Opening Times</CTableHeaderCell>
              <CTableHeaderCell className='table-header-cell addskp' scope="col">Price</CTableHeaderCell>
              <CTableHeaderCell className='table-header-cell addskp' scope="col">Last Entry Time</CTableHeaderCell>
              <CTableHeaderCell className='table-header-cell addskp' scope="col">Event Name</CTableHeaderCell>
              <CTableHeaderCell className='table-header-cell addskp' scope="col">Limit Quantity</CTableHeaderCell>
              <CTableHeaderCell className='table-header-cell addskp' scope="col">Event Image</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {days.map((day, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{day}</CTableDataCell>
                <CTableDataCell>
                  <label className="toggle-container">
                    <input
                      type="checkbox"
                      checked={toggles[index].status}
                      onChange={() => handleToggle(index, 'status')}
                      className="toggle-input"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </CTableDataCell>
                <CTableDataCell>hello</CTableDataCell>
                <CTableDataCell>hello</CTableDataCell>
                <CTableDataCell>hello</CTableDataCell>
                <CTableDataCell>hello</CTableDataCell>
                <CTableDataCell>
                  <label className="toggle-container">
                    <input
                      type="checkbox"
                      checked={toggles[index].limitQuantity}
                      onChange={() => handleToggle(index, 'limitQuantity')}
                      className="toggle-input"
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  {toggles[index].limitQuantity && (
                    <CButton size="sm" style={{ marginLeft: '5px', backgroundColor: 'transparent' }}
                    siteId={profile?.worksIn?._id}
                    onClick={() => {
                      setPopupTitle('Enter Quantity');
                      setPopupChildren(<EnterQuantity siteId={profile?.worksIn?._id} />);
                      setPopupVisible(true);
                    }}
                    >
                      <img src={editIcon} style={{ width: '15px', height: '15px' }} />
                    </CButton>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                {selectedImages[index] ? ( // Conditional rendering
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <img 
                        src={selectedImages[index]} 
                        alt="Selected" 
                        style={{ 
                          width: 'auto', 
                          height: '50px', 
                          objectFit: 'cover', 
                          border: '5px solid #EDEDEE', 
                          borderRadius: '10px',
                        }} 
                      />
                      <CButton size="l" style={{ backgroundColor: '#E31B54' }} onClick={() => handleButtonClick(index)}>
                        <img 
                          src={deleteIcon} 
                          alt="Delete file" 
                          style={{ width: '15px', height: '15px' }} 
                        />
                      </CButton>
                    </div>
                  ) : (
                    <>
                      <CButton size="l" style={{ backgroundColor: '#EDEDEE' }} onClick={() => handleButtonClick(index)}>
                        <img 
                          src={chosen_fileIcon} 
                          alt="Choose file" 
                          style={{ width: '15px', height: '15px' }} 
                        />
                      </CButton>
                      {/* Hidden file input */}
                      <input 
                        type="file" 
                        ref={fileInputRefs.current[index]} 
                        onChange={(event) => handleFileChange(event, index)} 
                        style={{ display: 'none' }} // Hide the file input
                      />
                    </>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '25px' }}>
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
              setPopupTitle('Add Single Event Ticket');
              setPopupChildren(<AddSESkip siteId={profile?.worksIn?._id} />);
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
            // onClick={handleSubmit} 
          >
            Save
          </CButton>
        </div>
      </div>

      {popupVisible && (
        <div className="modal-overlay" />
      )}
      <PopupModelBase
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false)
        }}
        title={popupTitle}
        children={popupChildren}
      />

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


const AddSESkip = ({ siteId }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [tickets, setTickets] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [lastEntryTime, setLastEntryTime] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      toast.warning('Please enter event name');
      return;
    }

    if (!price) {
      toast.warning('Please enter skip price');
      return;
    }

    if (!tickets) {
      toast.warning('Please enter number of tickets');
      return;
    }

    if (!openingTime || !openingEndTime) {
      toast.warning('Please enter valid opening times');
      return;
    }

    if (!lastEntryTime.match(/^\d{2}:\d{2}$/)) {
      toast.warning('Please enter valid last entry time (e.g., 03:00)');
      return;
    }

    // Further processing here
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
          autoComplete="name"
          size="lg"
          className="setting-input"
        />
      </div>

      {/* Date */}
      <div className="mb-3">
        <h3 className="setting-label">Date</h3>
        <CFormSelect
          onChange={(e) => Date(e.target.value)}
          value={date}
          size="lg"
          className="setting-input custom-select-icon"
        >
          {/* <option value="employee">Employee</option>
          <option value="admin">Admin</option> */}
        </CFormSelect>
      </div>

      {/* Opening Times */}
      <div className="mb-3">
        <h3 className="setting-label">Opening Times</h3>
        <CFormInput
          onChange={(e) => setOpening(e.target.value)}
          value={openingTime}
          placeholder="00:00-00:00"
          autoComplete="00:00-00:00"
          size="lg"
          className="setting-input"
        />
      </div>

      {/* Skip Price */}
      <div className="mb-3">
        <h3 className="setting-label">Skip Price</h3>
        <div className="input-with-symbol">
          <CFormInput
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            placeholder="Enter price"
            autoComplete="price"
            size="lg"
            className="setting-input-with-symbol"
            type="number"
            min="0"
          />
          <span className="symbol">£</span>
        </div>
      </div>

      {/* Number of Tickets Available */}
      <div className="mb-3">
        <h3 className="setting-label">Number of Tickets Available</h3>
        <CFormInput
          onChange={(e) => setTickets(e.target.value)}
          value={tickets}
          placeholder="Enter number of tickets"
          autoComplete="tickets"
          size="lg"
          className="setting-input"
          type="number"
          min="1"
        />
      </div>

      {/* Last Entry Time */}
      <div className="mb-3">
        <h3 className="setting-label">Last Entry Time</h3>
        <CFormInput
          onChange={(e) => setLastEntryTime(e.target.value)}
          value={lastEntryTime}
          placeholder="00:00"
          autoComplete="00:00"
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
            className='setting-input'
          />
          <button
            onClick={handleButtonClick}
            className='setting-btn'
          >
            <img 
              src={chosen_fileIcon} 
              alt="Choose file" 
              className='setting-input-img'
            />
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


export default TKPage



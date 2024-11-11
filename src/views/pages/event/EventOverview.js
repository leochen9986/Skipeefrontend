import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
  CSpinner,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import React, { useEffect } from 'react'
import noEventSvg from 'src/assets/images/noEventWidget.svg'
import PageTopBar from '../../../components/PageTopBar'
import { VenuApiController } from '../../../api/VenuApiController'
import CIcon from '@coreui/icons-react'
import { cilClock, cilLocationPin, cilUser } from '@coreui/icons'
import { cilCalendar, cilMap } from '@coreui/icons'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import PopupModelBase from '../../popup/PopupModelBase'
import { format } from 'date-fns'
import { ViewTicketPrice } from '../../forms/range/Range'

const EventOverview = ({ profile }) => {
  const nav = useNavigate()

  return (
    <>
      <PageTopBar />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Events</h2>
        <CButton onClick={() => nav('/event/create')} color="success text-white">
          Create Event
        </CButton>
      </div>
      <br />

      <div className="py-5 mb-5 paper">
        <CTabs activeItemKey={1}>
          <CTabList variant="underline-border" color="success">
            {/* <CTab aria-controls="all-events-pane" itemKey={1}>
              All
            </CTab> */}
            <CTab aria-controls="upcoming-tab-pane" itemKey={1}>
              Upcoming
            </CTab>
            <CTab aria-controls="draft-tab-pane" itemKey={2}>
              Draft
            </CTab>
            <CTab aria-controls="past-tab-pane" itemKey={3}>
              Past
            </CTab>
          </CTabList>
          <CTabContent>
            {/* <CTabPanel className="py-3" aria-labelledby="all-events-pane" itemKey={1}>
              {profile ? (
                <AllEventsTab query={{ siteId: profile.worksIn._id }} />
              ) : (
                <CSpinner color="primary" />
              )}
            </CTabPanel> */}
            <CTabPanel className="py-3" aria-labelledby="upcoming-tab-pane" itemKey={1}>
              {profile ? (
                <AllEventsTab query={{ siteId: profile.worksIn._id, status: 'upcoming' }} />
              ) : (
                <CSpinner color="primary" />
              )}
            </CTabPanel>
            <CTabPanel className="py-3" aria-labelledby="draft-tab-pane" itemKey={2}>
              {/* <AllEventsTab query={{status: 'draft'}}  /> */}
              {profile ? (
                <AllEventsTab query={{ siteId: profile.worksIn._id, status: 'draft' }} />
              ) : (
                <CSpinner color="primary" />
              )}
            </CTabPanel>
            <CTabPanel className="py-3" aria-labelledby="past-tab-pane" itemKey={3}>
              {/* <AllEventsTab query={{status: 'completed'}} /> */}
              {profile ? (
                <AllEventsTab query={{ siteId: profile.worksIn._id, status: 'completed' }} />
              ) : (
                <CSpinner color="primary" />
              )}
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </div>
    </>
  )
}

const AllEventsTab = ({ query }) => {
  const [eventsList, setEventsList] = React.useState([])
  const [popupVisible, setPopupVisible] = React.useState(false)
  const [popupChildren, setPopupChildren] = React.useState(null)

  const loadEvents = () => {
    // API call
    new VenuApiController().getAllEvents(query).then((res) => {
      if (res.message) {
        toast.error(res.message)
      } else {
        setEventsList(res)
      }
    })
  }

  useEffect(() => {
    loadEvents()
  }, [query])
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {eventsList.length > 0 ? (
          eventsList.map((event, index) => (
            <CCard key={index} className="mb-4 w-100">
              <CCardBody>
                <CRow>
                  <CCol xs={12} md={4} lg={2}>
                    <CCardImage src={event?.image} className="rounded-top" />
                  </CCol>
                  <CCol xs={12} md={8} lg={10} className="p-3">
                    <CCardTitle>
                      <div style={{ display: 'flex' }}>
                        <strong>{event?.name}</strong> &nbsp;
                        <CBadge color={event.status === 'draft' ? 'warning' : `success`}>
                          <span className="text-white" style={{ fontSize: '14px' }}>
                            {event?.status}
                          </span>
                        </CBadge>
                      </div>
                    </CCardTitle>
                    <CCardText className="text-muted" style={{ fontSize: '14px' }}>
                      {event?.description}
                    </CCardText>
                    <div className="d-flex align-items-center mt-3">
                      <CIcon icon={cilMap} className="text-primary me-2" />
                      <span className="text-muted" style={{ fontSize: '14px' }}>
                        <span className="text-dark">
                          {event?.location?.split(',').map((s, i) => (
                            <span key={i}>
                              {s}
                              {i < event?.location?.split(',').length - 1 ? ',' : ''}
                              {'  '}
                            </span>
                          ))}
                        </span>
                      </span>
                    </div>

                    <div className="d-flex align-items-center mt-3">
                      <CIcon icon={cilCalendar} className="text-primary me-2" />
                      <span className="text-muted" style={{ fontSize: '14px' }}>
                        <span className="text-dark">
                          {event.endDate
                            ? 'Recurring Event'
                            : format(new Date(event?.date), 'dd/MM/yyyy')}
                          {' | '}
                          {event?.startTime} - {event?.endTime}
                        </span>
                      </span>
                    </div>

                    <br />

                    <CCardText>
                      <CBadge color="success">
                        <span className="text-white" style={{ fontSize: '14px' }}>
                          Available ticket types: {event?.tickets.length}{' '}
                        </span>
                      </CBadge>
                    </CCardText>
                  </CCol>
                </CRow>

                {/* <CCardText>{site?.description}</CCardText>
              <CCardText>{site?.address}</CCardText>
              <CCardText>Ticket Price: {site?.ticketPrice} JOD</CCardText> */}
              </CCardBody>
              <CCardFooter className="d-flex justify-content-end">
                {event?.status === 'draft' ? (
                  <CButton
                    color="success"
                    className="text-white"
                    href={`/#/event/create/ticket/${event?._id}`}
                  >
                    Continue to create
                  </CButton>
                ) : (
                  <>
                    <CButton color="primary" href={`/#/event/detail/${event?._id}`}>
                      View Details
                    </CButton>
                    &nbsp;
                    <CButton
                      color="info"
                      onClick={() => {
                        setPopupChildren(
                          <>
                            <EventDetailView event={event} />
                          </>,
                        )
                        setPopupVisible(true)
                      }}
                    >
                      Quick View
                    </CButton>
                  </>
                )}
                &nbsp;
                <CButton
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this event?')) {
                      new VenuApiController().deleteEventById(event?._id).then((res) => {
                        if (res.message) {
                          toast.error(res.message)
                        } else {
                          toast.success('Event deleted successfully')
                          loadEvents()
                        }
                      })
                    }
                  }}
                  color="danger"
                  className="text-white"
                >
                  Delete
                </CButton>
              </CCardFooter>
            </CCard>
          ))
        ) : (
          <img src={noEventSvg} alt="noEvent" width="60%" />
        )}
      </div>
      <PopupModelBase
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false)
        }}
        title="Event Detail"
        children={popupChildren}
      />
    </>
  )
}

export const EventDetailView = ({ event, onProceed }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <CCard className="mb-3">
      <CCardImage orientation="top" src={event.image} />
      <CCardBody>
        <CRow>
          <CCol>
            <CCardTitle>{event.name}</CCardTitle>
            <CBadge color={event.status === 'upcoming' ? 'primary' : 'secondary'}>
              {event.status}
            </CBadge>
          </CCol>
          <CCol className="text-end">
            <CCardText>
              <small className="text-muted">Organized by {event.site.name}</small>
            </CCardText>
          </CCol>
        </CRow>

        <CCardText className="mt-3">{event.description || ''}</CCardText>

        <CListGroup flush className="mt-4">
          <CListGroupItem>
            <CIcon icon={cilCalendar} /> Date: {formatDate(event.date)}
          </CListGroupItem>
          <CListGroupItem>
            <CIcon icon={cilClock} /> Time: {event.startTime} - {event.endTime}
          </CListGroupItem>
          <CListGroupItem>
            <CIcon icon={cilLocationPin} /> Location: {event.site.location}
          </CListGroupItem>
          <CListGroupItem>
            <CIcon icon={cilUser} /> Minimum Age: {event.minAgeLimit}+
          </CListGroupItem>
        </CListGroup>

        <CCardTitle className="mt-4">Tickets</CCardTitle>
        <CListGroup>
          {event.tickets.map((ticket) => (
            <CListGroupItem
              key={ticket._id}
              disabled={
                !(
                  new Date(ticket.saleStartTime) < new Date() &&
                  new Date(ticket.saleEndTime) > new Date()
                )
              }
              className="d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (onProceed) {
                  parseFloat(ticket.availableQuantity) > 0
                    ? onProceed(ticket._id)
                    : toast.error('No tickets available')
                }
              }}
            >
              <div>
                <h6>{ticket.name}</h6>
                <small>
                  Sale period: {formatDate(ticket.saleStartTime)} - {formatDate(ticket.saleEndTime)}
                </small>
              </div>
              <div className="text-end">
                <CBadge color="success">
                  <ViewTicketPrice amount={ticket.price} site={event.site} />
                </CBadge>
                {/* <div>
                  <small>{ticket.availableQuantity} available</small>
                </div> */}
              </div>
            </CListGroupItem>
          ))}
        </CListGroup>
      </CCardBody>
    </CCard>
  )
}

export default EventOverview

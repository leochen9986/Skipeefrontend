import {
  cilChevronDoubleRight,
  cilEyedropper,
  cilPencil,
  cilPlus,
  cilSearch,
  cilTag,
  cilTrash,
  cilViewColumn,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCol, CContainer, CProgressBar, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { VenuApiController } from '../../../api/VenuApiController'
import { toast } from 'react-toastify'
import { PiPencilBold, PiPlusCircleBold, PiUserCirclePlusFill } from 'react-icons/pi'
import { format } from 'date-fns'
import { CreateTicketPopup } from './CreateEventTickets'
import PopupModelBase from '../../popup/PopupModelBase'
import EventTicketListPopup from './EventTicketList'
import { ViewTicketPrice } from '../../forms/range/Range'

export const EventDetailPage = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showTicketListPopup, setShowTicketListPopup] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const nav = useNavigate()

  const getEvent = async () => {
    setLoading(true)
    new VenuApiController()
      .getEvent(id)
      .then((res) => {
        if (res.message) {
          console.log(res)
          toast.error(res.message)
        } else {
          setEvent(res)
        }
      })
      .finally(() => setLoading(false))
  }

  const updateTicketDetails = async (ticket, data) => {
    new VenuApiController()
      .updateTicket(ticket._id, data)
      .then((res) => {
        if (res.message) {
          console.log(res)
          toast.error(res.message)
        } else {
          toast.success('Ticket updated successfully')
          getEvent()
        }
      })
      .finally(() => setShowPopup(false))
  }

  useEffect(() => {
    getEvent()
  }, [])

  if (loading)
    return (
      <div
        style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <CProgressBar color="success" animated now={100} />
      </div>
    )

  return (
    <>
      <CContainer>
        <h2>{event.name}</h2>
        <p>{event.description}</p>

        <br />

        <CRow>
          <CCol xs={12} md={4} className="mt-3">
            <div className="paper">
              <h4>
                {event.name} &nbsp;{' '}
                <PiPencilBold
                  className="text-primary"
                  size={20}
                  onClick={() => {
                    nav('/event/edit/' + id)
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </h4>
              <br />
              <p className="subtext" style={{ marginBottom: 0 }}>
                {event.endDate
                  ? 'Recurring Event'
                  : format(new Date(event.date), 'dd/MM/yyyy') +
                    ' | ' +
                    event.startTime +
                    ' - ' +
                    event.endTime}{' '}
              </p>
              <p className="subtext">{event.location}</p>
            </div>
          </CCol>

          <CCol xs={12} md={4} className="mt-3">
            <div className="paper">
              <p style={{ textAlign: 'center' }} className="subtext">
                Tickets Sold
              </p>
              <br />
              <h4 style={{ textAlign: 'center' }}>
                {event.tickets.reduce(
                  (accumulator, currentItem) => accumulator + parseInt(currentItem.totalQuantity),
                  0,
                ) -
                  event.tickets.reduce(
                    (accumulator, currentItem) =>
                      accumulator + parseInt(currentItem.availableQuantity),
                    0,
                  )}{' '}
                /{' '}
                {event.tickets.reduce(
                  (accumulator, currentItem) => accumulator + parseInt(currentItem.totalQuantity),
                  0,
                )}
              </h4>
              <br />
            </div>
          </CCol>
          <CCol xs={12} md={4} className="mt-3">
            <div className="paper">
              <p style={{ textAlign: 'center' }} className="subtext">
                Net Sale
              </p>
              <br />
              <h4 style={{ textAlign: 'center' }}>
                £{' '}
                {event.tickets.reduce(
                  (accumulator, currentItem) =>
                    accumulator +
                    parseFloat(currentItem.price) *
                      (parseInt(currentItem.totalQuantity) -
                        parseInt(currentItem.availableQuantity)),
                  0,
                )}
              </h4>
              <br />
            </div>
          </CCol>
        </CRow>
        <br />
        <CRow>
          <CCol md={4}>
            <br />
            &nbsp;
          </CCol>
          <CCol md={8}>
            <div className="paper">
              <div className="d-flex justify-content-between">
                <h3>Event Tickets</h3>
                <PiPlusCircleBold
                  color="green"
                  size={30}
                  onClick={() => (window.location.href = '/#/event/create/ticket/' + event._id)}
                />
              </div>

              {event.tickets.map((ticket, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      border: '2px solid black',
                      borderRadius: '10px',
                      padding: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <CRow>
                      <CCol xs={12} md={4}>
                        <strong>{ticket.name}</strong>
                      </CCol>
                      <CCol xs={3}>
                        <strong>
                          <ViewTicketPrice amount={ticket.price} site={event.site} />
                        </strong>
                      </CCol>
                      <CCol xs={3}>
                        <strong>
                          {parseInt(ticket.totalQuantity) - parseInt(ticket.availableQuantity)} /{' '}
                          {ticket.totalQuantity}
                        </strong>
                      </CCol>
                      <CCol xs={2}>
                        <CIcon
                          onClick={() => {
                            setSelectedTicket(ticket)
                            setShowTicketListPopup(true)
                          }}
                          icon={cilSearch}
                          className="text-success"
                        />
                        <CIcon
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this ticket?')) {
                              new VenuApiController().deleteTickets(ticket._id).then((res) => {
                                if (res.message) {
                                  console.log(res)
                                  toast.error(res.message)
                                } else {
                                  toast.success('Ticket deleted successfully')
                                  getEvent()
                                }
                              })
                            }
                          }}
                          icon={cilTrash}
                          className="text-danger"
                        />
                        <CIcon
                          icon={cilPencil}
                          className="text-info"
                          onClick={() => {
                            setSelectedTicket(ticket)
                            setShowPopup(true)
                          }}
                        />
                      </CCol>
                    </CRow>
                  </div>
                )
              })}
            </div>
          </CCol>
        </CRow>
      </CContainer>
      {showPopup && (
        <CreateTicketPopup
          onSave={updateTicketDetails}
          onClose={() => setShowPopup(false)}
          site={event?.site}
          ticket={selectedTicket}
        />
      )}
      <EventTicketListPopup
        id={selectedTicket?._id}
        isOpen={showTicketListPopup}
        onClose={() => setShowTicketListPopup(false)}
      />
    </>
  )
}

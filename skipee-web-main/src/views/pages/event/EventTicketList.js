import React, { useEffect, useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CRow,
  CCol,
  CBadge,
  CProgressBar,
} from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'
import './TicketPopup.css'
import { TicketApiController } from '../../../api/TicketApiController'

const EventTicketListPopup = ({ isOpen, onClose, id }) => {
  const [tickets, setTickets] = useState(null)
  const [loading, setLoading] = useState(true)

  const getAllTickets = async () => {
    setLoading(true)
    new TicketApiController()
      .getTicketByEventTicket(id)
      .then((res) => {
        setTickets(res)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        toast.error(err.response.data.message)
      })
  }

  useEffect(() => {
    if (id) {
      getAllTickets()
    }
  }, [id])

  if (loading)
    return (
      <div
        style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <CProgressBar color="success" animated now={100} />
      </div>
    )

  return (
    <CModal visible={isOpen} onClose={onClose} size="lg" alignment="center">
      <CModalHeader>
        <CModalTitle>Purchased Tickets</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          {tickets.map((ticket) => (
            <CCol key={ticket._id} xs={12} md={6} lg={4} className="mb-4">
              <CCard className="h-100 ticket-card">
                <CCardBody>
                  <CCardTitle>{ticket.name}</CCardTitle>
                  <CCardText>
                    <strong>Ticket Type:</strong> {ticket.eventTicket.name}
                    <br />
                    <strong>Users:</strong> {ticket.noOfUser}
                    <br />
                    <strong>Entered:</strong> {ticket.entered}
                    <br />
                    <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
                  </CCardText>
                  <div className="mt-2">
                    <CBadge color={ticket.isScaned ? 'success' : 'warning'} className="me-2">
                      {ticket.isScaned ? 'Scanned' : 'Not Scanned'}
                    </CBadge>
                    <CBadge color={ticket.isConfirmed ? 'info' : 'danger'}>
                      {ticket.isConfirmed ? 'Confirmed' : 'Not Confirmed'}
                    </CBadge>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </CModalBody>
    </CModal>
  )
}

export default EventTicketListPopup

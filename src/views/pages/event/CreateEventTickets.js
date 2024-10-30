import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CButton,
  CCol,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import React, { useState } from 'react'
import './events.scss'
import CIcon from '@coreui/icons-react'
import { cilChevronDoubleRight, cilTag, cilTrash } from '@coreui/icons'
import { toast } from 'react-toastify'
import { VenuApiController } from '../../../api/VenuApiController'
import { useNavigate } from 'react-router-dom'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import { ViewTicketPrice } from '../../forms/range/Range'

const CreateEventTickets = () => {
  const [entryTicket, setEntryTicket] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [ticketType, setTicketType] = useState('')
  const nav = useNavigate()

  const handleSaveTicket = (newTicket) => {
    setEntryTicket([...entryTicket, newTicket])
    setShowPopup(false)
  }

  const handleDeleteTicket = (index) => {
    const newEntryTicket = [...entryTicket]
    newEntryTicket.splice(index, 1)
    setEntryTicket(newEntryTicket)
  }

  const submitTickets = async () => {
    console.log(entryTicket)
    const id = window.location.href.split('/').pop()
    console.log(id)
    new VenuApiController().addTickets(id, entryTicket).then((res) => {
      if (!res.message) {
        toast.success('Tickets added successfully')
        nav(`/event`)
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <>
      <h2>Create Tickets</h2>
      <div className="py-5 paper d-flex justify-content-center align-items-center mb-5">
        <CRow className="w-100 justify-content-center">
          <CCol md={9}>
            <h3 className="input-lbl-md">Create Events Ticket</h3>
            <TicketAccordion
              entryTicket={entryTicket}
              onAddTicket={(type) => {
                setTicketType(type)
                setShowPopup(true)
              }}
              handleDeleteTicket={handleDeleteTicket}
            />
            {/* <TicketTable tickets={entryTicket} onDeleteTicket={handleDeleteTicket} /> */}
            <div className="my-4 d-flex justify-content-end">
              {entryTicket.length > 0 && (
                <CButton color="success" className="signin-btn px-4 mt-5" onClick={submitTickets}>
                  Save and Publish
                </CButton>
              )}
            </div>
          </CCol>
        </CRow>
      </div>
      {showPopup && (
        <CreateTicketPopup
          onSave={handleSaveTicket}
          onClose={() => setShowPopup(false)}
          ticketType={ticketType}
        />
      )}
    </>
  )
}

const TicketAccordion = ({ entryTicket, onAddTicket, handleDeleteTicket }) => {
  return (
    <CAccordion className="accordion-flush" color="success" activeItemKey={1}>
      <CAccordionItem itemKey={0} className="custom-accordion-item">
        <CAccordionHeader className="custom-accordion-header">
          <CIcon icon={cilChevronDoubleRight} className="accordion-icon" />
          <div className="accordion-text">
            <h4 className="accordion-title">Queue skips</h4>
            <p className="accordion-subtitle">Create queue skip passes that people pay for</p>
          </div>
        </CAccordionHeader>
        <CAccordionBody>
          <CButton
            color="success text-white"
            className="add-button my-3"
            onClick={() => onAddTicket('queue')}
          >
            Add Queue Skips
          </CButton>
          <br />
          <TicketTable
            tickets={entryTicket.filter((ticket) => ticket.type === 'queue')}
            onDeleteTicket={handleDeleteTicket}
          />
        </CAccordionBody>
      </CAccordionItem>
      <CAccordionItem itemKey={2} className="custom-accordion-item mt-2">
        <CAccordionHeader className="custom-accordion-header">
          <CIcon icon={cilTag} className="accordion-icon" />
          <div className="accordion-text">
            <h4 className="accordion-title">Entry tickets</h4>
            <p className="accordion-subtitle">Create entry tickets for your venue</p>
          </div>
        </CAccordionHeader>
        <CAccordionBody>
          <CButton
            color="success text-white"
            className="add-button my-3"
            onClick={() => onAddTicket('entry')}
          >
            Add Entry Ticket
          </CButton>
          <br />
          <TicketTable
            tickets={entryTicket.filter((ticket) => ticket.type === 'entry')}
            onDeleteTicket={handleDeleteTicket}
          />
        </CAccordionBody>
      </CAccordionItem>
    </CAccordion>
  )
}

const TicketTable = ({ tickets, onDeleteTicket }) => {
  return (
    <CTable bordered>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">Name</CTableHeaderCell>
          <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
          <CTableHeaderCell scope="col">Price</CTableHeaderCell>
          <CTableHeaderCell scope="col">Sale Start</CTableHeaderCell>
          <CTableHeaderCell scope="col">Sale End</CTableHeaderCell>
          <CTableHeaderCell scope="col">Action</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {tickets.map((ticket, index) => (
          <CTableRow key={index}>
            <CTableDataCell>{ticket.name}</CTableDataCell>
            <CTableDataCell>{ticket.totalQuantity}</CTableDataCell>
            <CTableDataCell>
              <ViewTicketPrice amount={ticket.price} site={ticket.site} />
            </CTableDataCell>
            <CTableDataCell>
              {format(new Date(ticket.saleStartTime), 'dd/MM/yyyy HH:mm')}
            </CTableDataCell>
            <CTableDataCell>
              {format(new Date(ticket.saleEndTime), 'dd/MM/yyyy HH:mm')}
            </CTableDataCell>
            <CTableDataCell>
              <CIcon
                icon={cilTrash}
                style={{ cursor: 'pointer', color: 'red' }}
                onClick={() => onDeleteTicket(index)}
                size="lg"
              />
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

export const CreateTicketPopup = ({ onSave, onClose, ticketType, ticket, site }) => {
  const [ticketName, setTicketName] = useState(ticket ? ticket.name : '')
  const [ticketCount, setTicketCount] = useState(ticket ? ticket.totalQuantity : '')
  const [ticketPrice, setTicketPrice] = useState(ticket ? ticket.price : '')
  const [salesStartTime, setSalesStartTime] = useState(
    ticket ? dayjs(new Date(ticket.saleStartTime)) : null,
  )
  const [salesEndTime, setSalesEndTime] = useState(
    ticket ? dayjs(new Date(ticket.saleEndTime)) : null,
  )

  const handleSave = () => {
    if (
      ticketName === '' ||
      ticketCount === '' ||
      ticketPrice === '' ||
      !salesStartTime ||
      !salesEndTime
    ) {
      toast.warning('Please fill all the fields')
      return
    }

    if (ticket) {
      if (parseInt(ticketCount) < parseInt(ticket.totalQuantity)) {
        toast.warning('Ticket quantity cannot be reduced. It may lead to over booking.')
        return
      }
      onSave(ticket, {
        name: ticketName,
        type: ticket.type,
        totalQuantity: parseInt(ticketCount, 10),
        price: parseFloat(ticketPrice),
        saleStartTime: salesStartTime.toISOString(),
        saleEndTime: salesEndTime.toISOString(),
      })
      return
    }

    const newTicket = {
      type: ticketType,
      name: ticketName,
      totalQuantity: parseInt(ticketCount, 10),
      price: parseFloat(ticketPrice),
      saleStartTime: salesStartTime.toISOString(),
      saleEndTime: salesEndTime.toISOString(),
    }
    onSave(newTicket)
  }

  return (
    <CModal visible={true} onClose={onClose}>
      <CModalHeader>
        {ticketType ? (
          <CModalTitle>Create {ticketType === 'entry' ? 'Entry' : 'Queue Skip'} Ticket</CModalTitle>
        ) : (
          <CModalTitle>Edit Ticket</CModalTitle>
        )}
      </CModalHeader>
      <CModalBody>
        <div className="mb-3">
          <label className="form-label">Ticket name</label>
          <CFormInput
            type="text"
            placeholder={ticketType === 'entry' ? 'General admission' : 'Queue Skip'}
            value={ticketName}
            onChange={(e) => setTicketName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Number of Tickets</label>
          <CFormInput
            type="number"
            placeholder="Available quantity"
            value={ticketCount}
            onChange={(e) => setTicketCount(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ticket price</label>
          <CFormInput
            type="text"
            placeholder="£"
            value={ticketPrice}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, '')
              setTicketPrice(value)
            }}
          />
          {ticketPrice && (
            <p className="text-muted">
              Ticket price: <ViewTicketPrice amount={ticketPrice} site={site} />
            </p>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Sales start</label>
          <br />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              value={salesStartTime}
              onChange={(newValue) => setSalesStartTime(newValue)}
              renderInput={(params) => <CFormInput {...params} />}
            />
          </LocalizationProvider>
        </div>
        <div className="mb-3">
          <label className="form-label">Sales end</label>
          <br />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              value={salesEndTime}
              onChange={(newValue) => setSalesEndTime(newValue)}
              renderInput={(params) => <CFormInput {...params} />}
            />
          </LocalizationProvider>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
        &nbsp;
        <CButton color="primary" onClick={handleSave}>
          Save Ticket
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default CreateEventTickets

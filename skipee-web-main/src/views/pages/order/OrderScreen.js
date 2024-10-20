import {
  CContainer,
  CFormInput,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import PageTopBar from '../../../components/PageTopBar'
import { TicketApiController } from '../../../api/TicketApiController'
import './OrderScreen.scss'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import searchIcon from 'src/assets/icon_svg/search.svg';
import dropdown_sortIcon from 'src/assets/icon_svg/dropdown_sort.svg';

const OrderScreen = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [tickets, setTickets] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const nav = useNavigate()

  const setDateRange = (update) => {
    const [start, end] = update
    setStartDate(start)
    setEndDate(end)
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.length > 0 && tickets) {
      const eventSuggestions = [...new Set(tickets.map((ticket) => ticket.eventTicket.event.name))]
      const nameSuggestions = [...new Set(tickets.map((ticket) => ticket.name))]
      const filteredSuggestions = [...eventSuggestions, ...nameSuggestions].filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase()),
      )
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    setSuggestions([])
  }

  const getAllTickets = () => {
    new TicketApiController().getAllTickets().then((res) => {
      setTickets(res)
    })
  }

  useEffect(() => {
    getAllTickets()
  }, [])

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
  }

  const getStatus = (isConfirmed, isScanned) => {
    if (!isConfirmed) return 'Failed'
    if (!isScanned) return 'Not Completed'
    return 'Completed'
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'status-success'
      case 'Not Completed':
        return 'status-warning'
      case 'Failed':
        return 'status-danger'
      default:
        return ''
    }
  }

  return (
    <>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start',padding:'20px'}}>
        <div className='title-bold'>Orders</div>
        <div style={{ display: 'flex', alignItems: 'right', justifyContent: 'flex-end', gap:'20px',width: '100%' }}>
        
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
        className="input-comp custom-select-icon"
      >
        <option value="">Sort</option>
        <option value="nameAsc">Name (A-Z)</option>
        <option value="nameDesc">Name (Z-A)</option>
        <option value="dateAsc">Date (Oldest First)</option>
        <option value="dateDesc">Date (Newest First)</option>
      </CFormSelect>

        
      </div>



        <PageTopBar
        startDate={startDate}
        endDate={endDate}
        setDateRange={setDateRange}
        picker={true}
        currentPage="orders"
        
      />
      </div>
      </div>

      <CContainer fluid>
        <div className="paper" >

          <br />
          <br />
          <div className="table-responsive"style={{ marginTop:'-50px'}}>
            <CTable className="order-table" style={{ border: '1px solid #ddd' ,borderRadius:'8px'}}>
              <CTableHead >
                <CTableRow>
                  <CTableHeaderCell className='table-header-cell' scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell className='table-header-cell' scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell className='table-header-cell'  scope="col">Order ID</CTableHeaderCell>
                  <CTableHeaderCell className='table-header-cell' scope="col">Order Date</CTableHeaderCell>
                  <CTableHeaderCell className='table-header-cell' scope="col">Event</CTableHeaderCell>
                  <CTableHeaderCell className='table-header-cell' scope="col">Order Amount</CTableHeaderCell>
                  {/* <CTableHeaderCell style={{ backgroundColor: '#EDEDEE', color:'#909094', textAlign:'center'}} scope="col">Event Date</CTableHeaderCell> */}
                  <CTableHeaderCell className='table-header-cell' scope="col">Ticket</CTableHeaderCell>
                  <CTableHeaderCell className='table-header-cell' scope="col">Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {tickets &&
                  tickets
                    .filter((order) => {
                      const orderDate = new Date(order.createdAt)
                      const matchesSearch =
                        searchQuery === '' ||
                        order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        order.eventTicket.event.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      const matchesDateRange =
                        (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate)
                      return matchesSearch && matchesDateRange
                    })
                    .map((order) => {
                      const status = getStatus(order.isConfirmed, order.isScaned)
                      return (
                        <CTableRow key={order.id}>
                          <CTableDataCell style={{fontWeight:'bold'}}>{order.name}</CTableDataCell>
                          <CTableDataCell>{order.phone}</CTableDataCell>
                          <CTableDataCell style={{color:'#909094'}}>{order._id}</CTableDataCell>
                          <CTableDataCell style={{ textAlign: 'left' }}>{formatDate(order.createdAt)}</CTableDataCell>
                          <CTableDataCell onClick={() => nav(`/event/detail/${order.eventTicket.event._id}`)}>
                            <div className="event-info">
                              {order.eventTicket?.event?.image ? (
                                <img
                                  src={order.eventTicket.event.image}
                                  alt={order.eventTicket.event.name}
                                  className="event-image"
                                />
                              ) : (
                                <div className="no-image-placeholder">No Image Available</div>
                              )}
                              <div>
                                <div className="event-name">{order.eventTicket?.event?.name || 'Unknown Event'}</div>
                                <div className="event-location">{order.eventTicket?.event?.location || 'Unknown Location'}</div>
                              </div>
                            </div>
                          </CTableDataCell>

                          <CTableDataCell>£{order.amount}</CTableDataCell>
                          {/* <CTableDataCell>
                            {order.eventTicket?.event?.date ? formatDate(order.eventTicket.event.date) : 'Unknown Date'}
                          </CTableDataCell> */}

                          <CTableDataCell>{order.eventTicket.name}</CTableDataCell>
                          <CTableDataCell>
                            <span className={`status-badge ${getStatusClass(status)}`}>
                              {status}
                            </span>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
              </CTableBody>
            </CTable>
          </div>
        </div>
      </CContainer>
    </>
  )
}

export default OrderScreen

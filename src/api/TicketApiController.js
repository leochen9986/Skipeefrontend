import { kBaseUrl } from '../assets/constants/constants'
import { ApiService } from './ApiService'

export class TicketApiController {
  constructor() {
    this.apiService = new ApiService()
  }

  initiateTicketBooking(data) {
    return this.apiService.post('/tickets', data)
  }

  getAllTickets() {
    return this.apiService.get('/tickets')
  }

  getTicket(id) {
    return this.apiService.get('/tickets/' + id)
  }
  getTicketByEventTicket(id) {
    return this.apiService.get('/tickets/tickets-type/' + id)
  }

  confirmTicketBooked(id) {
    return this.apiService.get('/tickets/confirm/' + id)
  }
}

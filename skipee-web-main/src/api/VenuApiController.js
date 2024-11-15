import { kBaseUrl } from '../assets/constants/constants'
import { ApiService } from './ApiService'

export class VenuApiController {
  constructor() {
    this.apiService = new ApiService()
  }
  createVenue(data) {
    return this.apiService.post('/sites', data)
  }

  getAllSites() {
    return this.apiService.get('/sites')
  }

  deleteSite(id) {
    return this.apiService.delete(`/sites/${id}`)
  }


  // Add the updateVenue method
  updateVenue(id, data) {
    return this.apiService.put(`/sites/${id}`, data)
  }

  async getAllEvents(query) {
    let url = `/sites/events?`
    for (const key in query) {
      url += `${key}=${query[key]}&`
    }
    url = url.slice(0, -1)
    console.log(url)
    return await this.apiService.get(url)
  }

  getEvent(id) {
    return this.apiService.get('/sites/event/' + id)
  }

  requestSiteApproval(id, status) {
    return this.apiService.put(`/sites/${id}/request`, { status })
  }

  getSiteById(id) {
    return this.apiService.get(`/sites/${id}`)
  }

  createEvent(data) {
    return this.apiService.post(`/sites/event`, data)
  }

  updateEvent(id, data) {
    return this.apiService.put(`/sites/event/${id}`, data)
  }

  addTicket(eventId, data) {
    return this.apiService.post(`/sites/event/${eventId}/ticket`, data);
  }
  
  updateTicket(ticketId, data) {
    return this.apiService.put(`/sites/event/ticket/${ticketId}`, data);
  }

  deleteTickets(ticketId) {
    return this.apiService.delete(`/sites/event/${ticketId}/ticket`)
  }

  deleteEventById(id) {
    return this.apiService.delete(`/sites/event/${id}`)
  }

  getMyEmployees() {
    return this.apiService.get('/sites/employees')
  }

  getAccountLinks() {
    return this.apiService.get('/stripe')
  }

  updateStripeComission(id, data) {
    return this.apiService.post('/stripe/commission/' + id , data)
  }
}

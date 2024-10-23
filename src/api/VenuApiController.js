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
    return this.apiService.get('/sites'); // Assuming active sites by default
  }

  // Method to fetch archived sites
  getArchivedSites() {
    return this.apiService.get('/sites?archived=true'); // Filter to get archived sites
  }
  deleteSite(id) {
    return this.apiService.delete(`/sites/${id}`)
  }

  

  async getAllEvents(query) {
    let url = `/sites/events?`
    for (const key in query) {
      url += `${key}=${query[key]}&`
    }
    url = url.slice(0, -1)
    console.log(url)
    return await this.apiService.get(url).then((response) => {
  console.log(response);  // Add this line to log the response
  return response;
});
  }

  async getSitesByOwnerSkipping(ownerId) {
    return await this.apiService.get(`/sites?ownerId=${ownerId}&skipping=true`);
  }
  uploadLogo(siteId, logoData) {
    console.log(logoData);
    return this.apiService.put(`/sites/${siteId}/upload-logo`, logoData);
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

  addTickets(id, data) {
    return this.apiService.post(`/sites/event/${id}/ticket`, data)
  }
  updateTicket(id, data) {
    return this.apiService.put(`/sites/event/${id}/ticket`, data)
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

import { kBaseUrl } from '../assets/constants/constants'
import { ApiService } from './ApiService'

export class VenuApiController {
  constructor() {
    this.apiService = new ApiService()
  }
  createVenue(data) {
    return this.apiService.post('/sites', data)
  }
  // Add the updateVenue method
  updateVenue(id, data) {
    return this.apiService.put(`/sites/${id}`, data)
  }
  getAllSites(ownerId) {
    const url = ownerId ? `/sites?ownerId=${ownerId}` : '/sites';
    return this.apiService.get(url);
  }

  getPaginatedSites(ownerId, page = 1, limit = 6, search = '') {
    let url = `/sites/paginated?page=${page}&limit=${limit}`;

    if (ownerId) {
      url += `&ownerId=${ownerId}`;
    }

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    // Add other filters if needed (e.g., archived, skipping, ticketing)

    return this.apiService.get(url);
  }

    // Add this method
    getPaginatedArchivedSites(ownerId, page = 1, limit = 6, search = '') {
      let url = `/sites/paginated?archived=true&page=${page}&limit=${limit}`;
  
      if (ownerId) {
        url += `&ownerId=${ownerId}`;
      }
  
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
  
      return this.apiService.get(url);
    }
    
  
  // Method to fetch archived sites
  getArchivedSites(ownerId) {
    const url = ownerId ? `/sites?archived=true&ownerId=${ownerId}` : '/sites?archived=true';
    return this.apiService.get(url);
  }

  archiveSite(siteId) {
    return this.apiService.put(`/sites/${siteId}/archive`);
  }
  
  deleteSite(id) {
    return this.apiService.delete(`/sites/${id}`)
  }

  getSitesOwnedByMe() {
    return this.apiService.get('/sites/owned-by-me');
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

  async getSitesByOwner(ownerId, siteType = 'skipping') {
    return await this.apiService.get(`/sites?ownerId=${ownerId}&${siteType}=true`);
  }


  uploadLogo(siteId, logoData) {
    console.log(logoData);
    return this.apiService.put(`/sites/${siteId}/upload-logo`, logoData);
  }

  uploadUserLogo(userId, logoData) {
    console.log(logoData);
    return this.apiService.post(`/users/upload-logo/${userId}`, { logoUrl: logoData["logo"] });
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
    return this.apiService.post(`/sites/event/${id}/ticket`, [data]);
  }

  
  addTicket(eventId, data) {
    return this.apiService.post(`/sites/event/${eventId}/ticket`, data);
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

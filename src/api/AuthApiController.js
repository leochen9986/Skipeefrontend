import { kBaseUrl } from '../assets/constants/constants'
import { ApiService } from './ApiService'

export class AuthApiController {
  constructor() {
    this.apiService = new ApiService()
  }

  async login(data) {
    try {
      const res = await this.apiService.post('/auth/login', data)

      const access_token = res.token
      localStorage.setItem('skipee_access_token', access_token)
      window.location.href = `${kBaseUrl}/#/dashboard`
    } catch (error) {
      console.error('Error during login:', error)
      // You might want to add more specific error handling here
    }
  }

  async logout() {
    try {
      localStorage.removeItem('skipee_access_token')
      window.location.href = `${kBaseUrl}/#/login`
    } catch (error) {
      console.error('Error during logout:', error)
      // You might want to add more specific error handling here
    }
  }

  getProfile() {
    return this.apiService.get('/users')
  }

  register(data) {
    return this.apiService.post('/auth/register', data)
  }

  resetPassword(data) {
    return this.apiService.post('/auth/reset-password', data)
  }

  forgotPassword(data) {
    return this.apiService.post('/auth/forgot-password', data)
  }

  requestJoin(data) {
    return this.apiService.post('/users/request', data)
  }

  viewAllRequests() {
    return this.apiService.get('/users/request')
  }

  approveRequest(id) {
    return this.apiService.get(`/users/approve-request/${id}`)
  }

  submitContactUsForm(data) {
    return this.apiService.post('/email/send', data)
  }
}

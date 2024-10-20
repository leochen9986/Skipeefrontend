import axios from 'axios'
import { toast } from 'react-toastify'
import { kBaseUrl } from '../assets/constants/constants'

export class ApiService {
  constructor() {
    // this.baseUrl = process.env.backendurl
    this.baseUrl = process.env.backendurl

    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('skipee_access_token')}`,
      },
    })
  }

  async get(url) {
    try {
      const response = await this.axios.get(url)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async post(url, data) {
    try {
      console.log(data)
      const response = await this.axios.post(url, data)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async put(url, data) {
    try {
      const response = await this.axios.put(url, data)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async patch(url, data) {
    try {
      const response = await this.axios.patch(url, data)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async delete(url) {
    try {
      const response = await this.axios.delete(url)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  handleError(error) {
    const { response } = error
    const { status, data } = response || {}
    const { message = 'An error occurred.' } = data || {}

    if (status === 401 || status === 403) {
      localStorage.removeItem('skipee_access_token')
      // window.location.href = `${kBaseUrl}/#/home`
    }
    // console.log(response)
    toast.error(message)
  }
}

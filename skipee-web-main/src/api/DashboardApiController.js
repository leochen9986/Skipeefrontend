import { kBaseUrl } from '../assets/constants/constants'
import { ApiService } from './ApiService'

export class DashboardApiController {
  constructor() {
    this.apiService = new ApiService()
  }

  getDashboardData(query) {
    let url = `/dashboard?`
    for (const key in query) {
      url += `${key}=${query[key]}&`
    }
    url = url.slice(0, -1)
    return this.apiService.get(url)
  }

  getReportsData(query) {
    let url = `/reports?`
    for (const key in query) {
      url += `${key}=${query[key]}&`
    }
    url = url.slice(0, -1)
    return this.apiService.get(url)
  }
}

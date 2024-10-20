import React from 'react'
import OrderScreen from './views/pages/order/OrderScreen'
import EventOverview from './views/pages/event/EventOverview'
import CreateEvent from './views/pages/event/CreateEvent'
import CreateEventTickets from './views/pages/event/CreateEventTickets'
import { EventDetailPage } from './views/pages/event/EventDetails'
import { ManageAccountPage } from './views/pages/account/ManageAccount'
import UserRequests from './views/pages/profile/UserRequests'
import IncidentReportsPage from './views/pages/reports/AllReportsPage'
import STPage from './views/pages/Skipping_Ticketing/STPage'
import TKPage from './views/pages/Skipping_Ticketing/TKPage'
import TawkChat from './views/widgets/TwakChat'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

//Pages
// const CreateVenue = React.lazy(() => import('./views/pages/venues/CreateVenu'))
const Venues = React.lazy(() => import('./views/pages/venues/ListVenues'))
const UserProfile = React.lazy(() => import('./views/pages/profile/UserProfile'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  // { path: '/venue/add', name: 'Create venues', element: CreateVenue },
  { path: '/venue', name: 'List venues', element: Venues },
  { path: '/profile', name: 'Profile', element: UserProfile },
  { path: '/order', name: 'My Order', element: OrderScreen },
  { path: '/event', name: 'Events', element: EventOverview },
  { path: '/event/create', name: 'Create Events', element: CreateEvent },
  { path: '/event/edit/:id', name: 'Update Events', element: CreateEvent },
  {
    path: '/event/create/ticket/:evetId',
    name: 'Create Events Ticket',
    element: CreateEventTickets,
  },
  { path: '/event/detail/:id', name: 'Event Detail', element: EventDetailPage },
  { path: '/skipping', name: 'STPage', element: STPage },
  { path: '/ticketing', name: 'TKPage', element: TKPage },
  { path: '/manage-account', name: 'Manage Account', element: ManageAccountPage },
  { path: '/user-requests', name: 'User Requests', element: UserRequests },
  { path: '/reports', name: 'Incident Reports', element: IncidentReportsPage },
  { path: '/help', name: 'Support', element: TawkChat },
]

export default routes

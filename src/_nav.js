import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilCalendar,
  cilCart,
  cilChart,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilHome,
  cilNotes,
  cilPencil,
  cilPeople,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import dashboardIcon from 'src/assets/icon_svg/dashboard.svg';
import manage_accountIcon from 'src/assets/icon_svg/manage_account.svg';
import manage_venueIcon from 'src/assets/icon_svg/manage_venue.svg';
import ordersIcon from 'src/assets/icon_svg/orders.svg';
import reportedIcon from 'src/assets/icon_svg/reported.svg';
import skippingIcon from 'src/assets/icon_svg/skipping.svg';
import ticketingIcon from 'src/assets/icon_svg/ticketing.svg';
import user_requestsIcon from 'src/assets/icon_svg/user_requests.svg';
import 'src/scss/sidebar.scss'; 
import classNames from 'classnames';


const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    adminOnly: false,
    icon: <img src={dashboardIcon}  width="20" height="20" style={{marginRight:"5%"}}/> ,
    //icon: <CImage src={logo} height={45} /> ,
    className: 'c-nav-link',
  },
  {
    component: CNavItem,
    name: 'Skipping',
    to: '/skipping',
    adminOnly: false,
    icon: <img src={skippingIcon}  width="20" height="20" style={{marginRight:"5%"}}/> ,
    //icon: <CImage src={logo} height={45} /> ,
    className: 'c-nav-link',
  },
  {
    component: CNavItem,
    name: 'Ticketing',
    to: '/ticketing',
    adminOnly: false,
    ticketingRequired: true, // Add this line
    icon: <img src={ticketingIcon} width="20" height="20" style={{ marginRight: '5%' }} />,
    className: 'c-nav-link',
  },
  {
    component: CNavItem,
    name: 'Orders',
    to: '/order',
    adminOnly: false,
    icon: <img src={ordersIcon}  width="20" height="20" style={{marginRight:"5%"}}/> ,
    //icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    className: 'c-nav-link',
  },

  
  {
    component: CNavItem,
    name: 'Incident Reports',
    to: '/reports',
    adminOnly: false,
    icon: <img src={reportedIcon}  width="20" height="20" style={{marginRight:"5%"}}/> ,
    //icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    className: 'c-nav-link',
  },

  {
    component: CNavItem,
    name: 'Manage Accounts',
    to: '/manage-account',
    adminOnly: false,
    icon: <img src={manage_accountIcon}  width="20" height="20" style={{marginRight:"5%"}}/> ,
    //icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    className: 'c-nav-link',
  },

  // {
  //   component: CNavItem,
  //   name: 'Events',
  //   to: '/event',
  //   adminOnly: false,
  //   icon: <img src={dashboardIcon}  width="20" height="20" style={{marginRight:"5%"}}/> ,
  //   //icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  // },


  {
    component: CNavItem,
    name: 'User Requests',
    to: '/user-requests',
    adminOnly: true,
    icon: <img src={user_requestsIcon}  width="20" height="20" style={{marginRight:"5%"}}/> ,
    //icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    className: 'c-nav-link',
  },

  {
    component: CNavItem,
    name: 'Manage Venue',
    to: '/venue',
    icon: <img src={manage_venueIcon}  width="20" height="20" style={{marginRight:"5%"}}/> ,
    //icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    adminOnly: true,
    className: 'c-nav-link',
  },
  // {
  //   component: CNavTitle,
  //   name: 'Theme',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Components',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Base',
  //   to: '/base',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Accordion',
  //       to: '/base/accordion',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Breadcrumb',
  //       to: '/base/breadcrumbs',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Cards',
  //       to: '/base/cards',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Carousel',
  //       to: '/base/carousels',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Collapse',
  //       to: '/base/collapses',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'List group',
  //       to: '/base/list-groups',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Navs & Tabs',
  //       to: '/base/navs',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Pagination',
  //       to: '/base/paginations',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Placeholders',
  //       to: '/base/placeholders',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Popovers',
  //       to: '/base/popovers',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Progress',
  //       to: '/base/progress',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Spinners',
  //       to: '/base/spinners',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Tables',
  //       to: '/base/tables',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Tooltips',
  //       to: '/base/tooltips',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Buttons',
  //   to: '/buttons',
  //   icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Buttons',
  //       to: '/buttons/buttons',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Buttons groups',
  //       to: '/buttons/button-groups',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Dropdowns',
  //       to: '/buttons/dropdowns',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Forms',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Form Control',
  //       to: '/forms/form-control',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Select',
  //       to: '/forms/select',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Checks & Radios',
  //       to: '/forms/checks-radios',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Range',
  //       to: '/forms/range',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Input Group',
  //       to: '/forms/input-group',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Floating Labels',
  //       to: '/forms/floating-labels',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Layout',
  //       to: '/forms/layout',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Validation',
  //       to: '/forms/validation',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Icons',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Free',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'NEW',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Flags',
  //       to: '/icons/flags',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Brands',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Notifications',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Alerts',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Badges',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Modal',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Toasts',
  //       to: '/notifications/toasts',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav

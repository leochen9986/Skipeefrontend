import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CAvatar, CBadge, CNavLink, CSidebarNav  } from '@coreui/react'

export const AppSidebarNav = ({ items, profile,onNavLinkClick }) => {
  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )} 
      </>
    )
  }

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink {...(rest.to && { as: NavLink })} {...rest} onClick={onNavLinkClick}> 
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav style={{background: "white",marginLeft:"5%"}} as={SimpleBar} >
      {/* {
        profile &&
          <div className='text-center'>
            <CAvatar color="primary" textColor="white" size="lg">
              {profile?.name.charAt(0).toUpperCase()}
            </CAvatar>
            <h4 className='text-white'>{profile?.name}</h4>
            <p className='text-white'>{profile?.role}</p>
            <br />
            <br/>
            
          </div>
      } */}
      {items &&
        items.filter(item => !item.adminOnly).map((item, index) => ( item.items ? navGroup(item, index) : navItem(item, index)))}
      {
        items && profile && profile.role === 'admin' && items.filter(item => item.adminOnly).map((item, index) => ( item.items ? navGroup(item, index) : navItem(item, index)))
      }      
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  onNavLinkClick: PropTypes.func.isRequired,
}

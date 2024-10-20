import React, { Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import { AuthApiController } from '../api/AuthApiController'

const AppContent = () => {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const nav = useNavigate()

  const getProfile = () => {
    new AuthApiController()
      .getProfile()
      .then((res) => {
        setProfile(res)
      })
      .catch((err) => {
        toast.error(err.message)
        nav('/login')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (
      localStorage.getItem('skipee_access_token') !== null &&
      localStorage.getItem('skipee_access_token') !== undefined &&
      localStorage.getItem('skipee_access_token').length > 8
    ) {
      getProfile()
    } else {
      nav('/login')
    }
  }, [])

  if (loading) {
    return (
      <CContainer className="px-4 d-flex justify-content-center align-items-center" lg>
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  return (
    <CContainer className="px-4" lg style={{backgroundColor:'white'}}>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element profile={profile} />}
                />
              )
            )
          })}
          {/* <Route path="/" element={<Navigate to="home" replace />} /> */}
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)

import React, { useEffect, useState } from 'react'
import { CCol, CRow, CImage, CSpinner, CContainer } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import ticket_icon from 'src/assets/images/icons/ticket-icon.svg'
import money_icon from 'src/assets/images/icons/money-icon.svg'
import MainChart from './MainChart'
import PageTopBar from '../../components/PageTopBar'
import './dashboard.scss'
import { AuthApiController } from '../../api/AuthApiController'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DashboardApiController } from '../../api/DashboardApiController'
import { addDays, format } from 'date-fns'
import skips_soldIcon from 'src/assets/icon_svg/skips_sold.svg';
import total_revenueIcon from 'src/assets/icon_svg/total_revenue.svg';
import chartIcon from 'src/assets/icon_svg/chart.svg';

const Dashboard = ({ site,  showTitle = true  }) => {
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState([null, null])
  const [dashboardData, setDashboardData] = useState({})
  const [label, setLabel] = useState([])
  const [value, setValue] = useState([])
  const [topCustomers, setTopCustomers] = useState([])

  const [startDate, endDate] = dateRange

  const getDashboardData = (filter) => {
    setLoading(true)

    new DashboardApiController().getDashboardData(filter).then((res) => {
      console.log(res)

      if (res && res.message) {
        toast.error(res.message)
      } else {
        setDashboardData(res)
        setLabel(res.chartData.map((data) => data._id))
        setValue(res.chartData.map((data) => data.amount))
        setTopCustomers(res.topCustomers)
        setLoading(false)
      }
    })
  }

  const fetch = async () => {
    const [stDate, enDate] = dateRange
    setLoading(true)
    new AuthApiController()
      .getProfile()
      .then((res) => {
        if (res.message) {
          toast.error(res.message)
          new AuthApiController().logout()
        } else {
          if (res && !res.worksIn) {
            nav('/register?step=1')
          }
          getDashboardData({
            startDate: format(stDate, 'dd/MM/yyyy'),
            endDate: format(enDate, 'dd/MM/yyyy'),
            siteId: site?._id,
          })
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetch()
  }, [dateRange])

  useEffect(() => {
    const today = new Date()
    const oneWeekAgo = addDays(today, -7)
    setDateRange([today, oneWeekAgo])
  }, [nav])

  const colors = ['#FFD966', '#D9EAD3', '#D9D2E9', '#F4CCCC']

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

  if (loading) {
    return (
      <CContainer
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  return (
    <>
      <br />
      <div style={{ display: 'flex', alignItems: 'left', width:'100%'}}>
      {showTitle && (
      <div className="title-bold">Dashboardss Overview</div>
      )}
      <div style={{ width: '100%', display: 'flex', justifyContent: showTitle ? 'flex-end' : 'center', position: 'relative' }}>
      <PageTopBar
        picker={true}
        startDate={startDate}
        endDate={endDate}
        setDateRange={setDateRange}
        currentPage="dashboard"
      />
      </div>
      </div>
      <br />
      {dashboardData && (
        <CContainer fluid>
          <CRow>
            <CCol xs={12}>
              <CRow>
                <CCol xs={12} md={6} className="mb-3">
                  <div className="left-box paper" style={{ border: '2px solid #E2E2E3',height: showTitle ? 'auto' : '178px',}}>
                    {/* <div className='percentage'>^ 12%</div> */}
                    {/* <CImage src={ticket_icon} height={100} width={100} /> */}
                    <div style={{ display: 'flex', alignItems: 'left', width:'100%'}}>
                    <img src={skips_soldIcon}  width="35" height="35"/>
                    <div className="title">Skips Sold</div>
                    </div>
                    <h3 className="value">{dashboardData.ticketCount}</h3>
                  </div>
                </CCol>
                <CCol xs={12} md={6} className="mb-3">
                  <div
                    className="right-box paper"
                    style={{border: '2px solid #E2E2E3' }}
                  >
                    {/* <div className='percentage'>^ 12%</div> */}
                    {/* <CImage src={money_icon} height={100} width={100} /> */}
                    <div style={{ display: 'flex', alignItems: 'left', width:'100%'}}>
                    <img src={total_revenueIcon}  width="35" height="35"/>
                    <div className="title">Total Revenue</div>
                    </div>
                    <h3 className="value">{dashboardData.totalAmount}</h3>
                  </div>
                </CCol>
              </CRow>
              <div className="my-3 paper"style={{ border: '2px solid #E2E2E3'}}>
              <div style={{ display: 'flex', alignItems: 'left', width:'100%'}}>
                    <img src={chartIcon}  width="35" height="35"/>
                    <div className="title">Chart</div>
                    </div>
                <MainChart labels={label} values={value} />
              </div>
            </CCol>
            {/* <CCol xs={12} lg={4}>
            <div className='paper mx-3 mt-4 mt-lg-0'> 
              <h2>Top Customers</h2>
              <div className="ticket-table">
                <CRow className="mb-2">
                  <CCol xs={6}>Name</CCol>
                  <CCol xs={3}>Ticket</CCol>
                  <CCol xs={3}>Revenue</CCol>
                </CRow>
                {topCustomers.map((user, index) => (
                  <div key={index} className='user-list' style={{backgroundColor: `${getRandomColor()}`}}>
                    <CRow>
                      <CCol xs={6} className='user-list-item'>{user.name}</CCol>
                      <CCol xs={3} className='user-list-item'>{user.ticketCount}</CCol>
                      <CCol xs={3} className='user-list-item'>${user.totalAmount}</CCol>
                    </CRow>
                  </div>
                ))}
              </div>
            </div>
          </CCol> */}
          </CRow>
        </CContainer>
      )}
    </>
  )
}

export default Dashboard

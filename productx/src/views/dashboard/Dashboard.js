import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibGoogle,
  cibFacebook,
  cibTwitter,
  cibLinkedin,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'
import ReactECharts from 'echarts-for-react'
import { Spin, DatePicker, Row, Col } from 'antd'
import api from 'src/axiosInstance'
import moment from 'moment'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

const { RangePicker } = DatePicker

const Dashboard = () => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'))
  const [endDate, setEndDate] = useState(moment())
  const [growthStats, setGrowthStats] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchGrowthStats()
  }, [startDate, endDate])

  const fetchGrowthStats = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/manage/user-growth-stats/range', {
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD')
        }
      })

      if (response) {
        setGrowthStats(response.data)
      }
    } catch (error) {
      console.error('获取用户增长数据失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'USA', flag: cilPeople },
      usage: {
        value: 50,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cilUser },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Brazil', flag: cilPeople },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cilUser },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'India', flag: cilPeople },
      usage: {
        value: 74,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cilUser },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'France', flag: cilPeople },
      usage: {
        value: 98,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cilUser },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Spain', flag: cilPeople },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cilUser },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Poland', flag: cilPeople },
      usage: {
        value: 43,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cilUser },
      activity: '1 hour ago',
    },
  ]

  const getUserGrowthOption = () => ({
    title: {
      text: '用户增长趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增用户', '活跃用户', '总用户数']
    },
    xAxis: {
      type: 'category',
      data: growthStats?.map(item => item.date) || []
    },
    yAxis: [
      {
        type: 'value',
        name: '用户数',
      }
    ],
    series: [
      {
        name: '新增用户',
        type: 'bar',
        data: growthStats?.map(item => item.newUsers) || []
      },
      {
        name: '活跃用户',
        type: 'line',
        data: growthStats?.map(item => item.activeUsers) || []
      },
      {
        name: '总用户数',
        type: 'line',
        data: growthStats?.map(item => item.totalUsers) || []
      }
    ]
  })

  const getRegionDistributionOption = () => ({
    title: {
      text: '用户地域分布'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: growthStats?.length > 0 ? 
          Object.entries(JSON.parse(growthStats[growthStats.length - 1].regionDistribution || '{}'))
            .map(([name, value]) => ({ name, value })) : []
      }
    ]
  })

  const getDeviceDistributionOption = () => ({
    title: {
      text: '设备使用分布'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      data: growthStats?.length > 0 ? 
        Object.entries(JSON.parse(growthStats[growthStats.length - 1].deviceDistribution || '{}'))
          .map(([name, value]) => ({ 
            name: name === 'mobile' ? '移动端' : name === 'tablet' ? '平板' : '桌面端',
            value 
          })) : []
    }]
  })

  const getUserSourceOption = () => ({
    title: {
      text: '新用户来源分析'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['广告', '社交媒体', '自然搜索', '推荐']
    },
    yAxis: {
      type: 'value',
      name: '占比(%)'
    },
    series: [{
      data: growthStats?.length > 0 ? 
        Object.values(JSON.parse(growthStats[growthStats.length - 1].newUserSource || '{}')) : [],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }]
  })

  const renderMetricsCards = () => {
    if (!growthStats?.length) return null;
    const latestStats = growthStats[growthStats.length - 1];
    
    const metrics = [
      {
        title: '用户留存率',
        value: `${latestStats?.userRetentionRate || 0}%`,
        color: 'info'
      },
      {
        title: '用户参与度',
        value: (latestStats?.userEngagementScore || 0).toFixed(1),
        color: 'success'
      },
      {
        title: '转化率',
        value: `${latestStats?.conversionRate || 0}%`,
        color: 'warning'
      },
      {
        title: '平均会话时长',
        value: `${Math.floor((latestStats?.avgSessionDuration || 0) / 60)}分${Math.floor((latestStats?.avgSessionDuration || 0) % 60)}秒`,
        color: 'primary'
      },
      {
        title: '跳出率',
        value: `${latestStats?.bounceRate || 0}%`,
        color: 'danger'
      },
      {
        title: '平均订单金额',
        value: `¥${(latestStats?.avgOrderValue || 0).toFixed(2)}`,
        color: 'success'
      }
    ];

    return (
      <CRow>
        {metrics.map((metric, index) => (
          <CCol key={index} sm={6} lg={4} xl={2}>
            <CCard className="mb-4">
              <CCardBody className="text-center">
                <div className="text-medium-emphasis small">{metric.title}</div>
                <div className={`fs-4 fw-semibold text-${metric.color}`}>{metric.value}</div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    )
  }

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setStartDate(dates[0])
      setEndDate(dates[1])
    } else {
      setStartDate(moment().subtract(7, 'days'))
      setEndDate(moment())
    }
  }

  return (
    <>
      <Row className="mb-4">
        <Col>
          <CCard>
            <CCardBody>
              <Row align="middle" gutter={16}>
                <Col>
                  <span>选择时间范围：</span>
                </Col>
                <Col>
                  <RangePicker
                    value={[startDate, endDate]}
                    onChange={handleDateRangeChange}
                    allowClear={false}
                    style={{ width: '280px' }}
                  />
                </Col>
              </Row>
            </CCardBody>
          </CCard>
        </Col>
      </Row>

      {renderMetricsCards()}

      <CRow className="mb-4">
        <CCol sm={12}>
          <CCard>
            <CCardHeader>用户数据分析</CCardHeader>
            <CCardBody>
              <Spin spinning={isLoading}>
                <CRow>
                  <CCol sm={8}>
                    <ReactECharts option={getUserGrowthOption()} style={{height: '400px'}}/>
                  </CCol>
                  <CCol sm={4}>
                    <ReactECharts option={getRegionDistributionOption()} style={{height: '400px'}}/>
                  </CCol>
                </CRow>
              </Spin>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={6}>
          <CCard>
            <CCardHeader>设备使用分析</CCardHeader>
            <CCardBody>
              <ReactECharts option={getDeviceDistributionOption()} style={{height: '300px'}}/>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6}>
          <CCard>
            <CCardHeader>新用户来源分析</CCardHeader>
            <CCardBody>
              <ReactECharts option={getUserSourceOption()} style={{height: '300px'}}/>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard

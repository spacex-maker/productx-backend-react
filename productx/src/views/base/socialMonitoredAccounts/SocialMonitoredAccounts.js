import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd'
import { 
  TwitterOutlined, 
  YoutubeOutlined, 
  RedditOutlined,
} from '@ant-design/icons'
import { FaTelegram } from 'react-icons/fa'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import SocialMonitoredAccountsTable from "./SocialMonitoredAccountsTable"
import UpdateSocialMonitoredAccountsModal from "./UpdateSocialMonitoredAccountsModel"
import SocialMonitoredAccountsCreateFormModal from "./SocialMonitoredAccountsCreateFormModel"

const { Option } = Select

const SocialMonitoredAccounts = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    platform: '',
    accountName: '',
    status: undefined,
    accountDescription: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedAccount, setSelectedAccount] = useState(null)

  const platformOptions = [
    { value: 'Twitter', icon: <TwitterOutlined style={{ color: '#1DA1F2' }} /> },
    { value: 'Telegram', icon: <FaTelegram style={{ color: '#0088cc' }} /> },
    { value: 'YouTube', icon: <YoutubeOutlined style={{ color: '#FF0000' }} /> },
    { value: 'Reddit', icon: <RedditOutlined style={{ color: '#FF4500' }} /> },
  ]

  const statusOptions = [
    { value: true, label: '监控中', color: 'success' },
    { value: false, label: '已停止', color: 'default' },
  ]

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== undefined)
      )
      const response = await api.get('/manage/social-monitored-accounts/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      })

      if (response?.data) {
        setData(response.data)
        setTotalNum(response.totalNum)
      }
    } catch (error) {
      console.error('获取数据失败', error)
      message.error('获取数据失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchChange = (value, name) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
    setCurrent(1) // 重置页码到第一页
  }

  const handleEditClick = (account) => {
    setSelectedAccount(account)
    setIsUpdateModalVisible(true)
  }

  const totalPages = Math.ceil(totalNum / pageSize)

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
    resetSelection,
  } = UseSelectableRows()

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Select
                value={searchParams.platform}
                onChange={(value) => handleSearchChange(value, 'platform')}
                placeholder="平台"
                allowClear
                style={{ width: 150 }}
                optionLabelProp="label"
              >
                {platformOptions.map(platform => (
                  <Option 
                    key={platform.value} 
                    value={platform.value}
                    label={platform.value}
                  >
                    <Space>
                      {React.cloneElement(platform.icon, { 
                        style: { 
                          ...platform.icon.props.style,
                          fontSize: '16px'
                        }
                      })}
                      {platform.value}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Input
                value={searchParams.accountName}
                onChange={(e) => handleSearchChange(e.target.value, 'accountName')}
                placeholder="账号名称"
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.accountDescription}
                onChange={(e) => handleSearchChange(e.target.value, 'accountDescription')}
                placeholder="账号描述"
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSearchChange(value, 'status')}
                placeholder="监控状态"
                allowClear
                style={{ width: 150 }}
              >
                {statusOptions.map(status => (
                  <Option key={status.value} value={status.value}>
                    <Space>
                      <span 
                        style={{ 
                          display: 'inline-block',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: status.color === 'success' ? '#52c41a' : '#d9d9d9',
                          marginRight: '8px'
                        }} 
                      />
                      {status.label}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin /> : '查询'}
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  新增监控账号
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    if (selectedRows.length === 0) {
                      message.warning('请选择要删除的数据');
                      return;
                    }
                    const rowsToDelete = [...selectedRows];
                    HandleBatchDelete({
                      url: '/manage/social-monitored-accounts/delete-batch',
                      selectedRows: rowsToDelete,
                      fetchData,
                      resetSelection,
                    });
                  }}
                  disabled={selectedRows.length === 0}
                >
                  批量删除
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <SocialMonitoredAccountsTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
          />
        </Spin>
      </div>

      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <SocialMonitoredAccountsCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={async (values) => {
          try {
            await api.post('/manage/social-monitored-accounts/create', values)
            message.success('创建成功')
            setIsCreateModalVisible(false)
            createForm.resetFields()
            await fetchData()
          } catch (error) {
            message.error('创建失败')
          }
        }}
        form={createForm}
      />

      <UpdateSocialMonitoredAccountsModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateAccount={async (values) => {
          try {
            await api.post('/manage/social-monitored-accounts/update', values)
            message.success('更新成功')
            setIsUpdateModalVisible(false)
            updateForm.resetFields()
            await fetchData()
          } catch (error) {
            message.error('更新失败')
          }
        }}
        selectedAccount={selectedAccount}
      />
    </div>
  )
}

export default SocialMonitoredAccounts

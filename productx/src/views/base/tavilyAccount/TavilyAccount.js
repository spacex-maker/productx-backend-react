import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import TavilyAccountTable from "./TavilyAccountTable"
import UpdateTavilyAccountModal from "./UpdateTavilyAccountModal"
import TavilyAccountCreateFormModal from "./TavilyAccountCreateFormModal"
import { useTranslation } from 'react-i18next'

const { Option } = Select

const TavilyAccount = () => {
  const { t } = useTranslation()

  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    accountAlias: '',
    currentPlan: undefined,
    isActive: undefined,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [syncingIds, setSyncingIds] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === false) return true
          return value !== '' && value !== null && value !== undefined
        })
      )
      const response = await api.get('/manage/tavily-account/page', {
        params: { 
          currentPage, 
          pageSize, 
          ...filteredParams 
        },
      })

      if (response) {
        setData(response.data)
        setTotalNum(response.totalNum)
      }
    } catch (error) {
      console.error('Failed to fetch data', error)
      message.error(t('fetchDataFailed') || '获取数据失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchChange = (name, value) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  const handleCreateAccount = async (values) => {
    try {
      await api.post('/manage/tavily-account/create', values)
      message.success(t('createSuccess') || '创建成功')
      setIsCreateModalVisible(false)
      createForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error(error.response?.data?.message || t('createFailed') || '创建失败')
    }
  }

  const handleUpdateAccount = async (values) => {
    try {
      await api.post('/manage/tavily-account/update', values)
      message.success(t('updateSuccess') || '更新成功')
      setIsUpdateModalVisible(false)
      updateForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error(error.response?.data?.message || t('updateFailed') || '更新失败')
    }
  }

  const handleEditClick = (account) => {
    setSelectedAccount(account)
    setIsUpdateModalVisible(true)
  }

  const handleSyncAccount = async (id) => {
    setSyncingIds(prev => new Set(prev).add(id))
    try {
      await api.post(`/manage/tavily-account/sync/${id}`)
      message.success(t('syncSuccess') || '同步成功')
      await fetchData()
    } catch (error) {
      message.error(error.response?.data?.message || t('syncFailed') || '同步失败')
    } finally {
      setSyncingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const totalPages = Math.ceil(totalNum / pageSize)

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows()

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.accountAlias}
                onChange={(e) => handleSearchChange('accountAlias', e.target.value)}
                placeholder={t('accountAlias') || '账号别名'}
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.currentPlan}
                onChange={(value) => handleSearchChange('currentPlan', value)}
                placeholder={t('currentPlan') || '套餐计划'}
                allowClear
                style={{ width: 150 }}
              >
                <Option value="Free">Free</Option>
                <Option value="Bootstrap">Bootstrap</Option>
                <Option value="Pro">Pro</Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.isActive}
                onChange={(value) => handleSearchChange('isActive', value)}
                placeholder={t('status') || '状态'}
                allowClear
                style={{ width: 120 }}
              >
                <Option value={true}>{t('active') || '启用'}</Option>
                <Option value={false}>{t('inactive') || '禁用'}</Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin /> : t('search') || '搜索'}
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  {t('add') || '新增'}
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => HandleBatchDelete({
                    url: '/manage/tavily-account/delete',
                    selectedRows,
                    fetchData,
                    t,
                  })}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDelete') || '批量删除'}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <TavilyAccountTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleSyncAccount={handleSyncAccount}
            syncingIds={syncingIds}
            t={t}
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

      <TavilyAccountCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateAccount}
        form={createForm}
        t={t}
      />

      <UpdateTavilyAccountModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateAccount={handleUpdateAccount}
        selectedAccount={selectedAccount}
        t={t}
      />
    </div>
  )
}

export default TavilyAccount

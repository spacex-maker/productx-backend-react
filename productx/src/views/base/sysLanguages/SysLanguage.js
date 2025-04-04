import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Button, Form, Input, message, Spin, Col, Row, Select, Space, Modal } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import SysLanguageTable from "./SysLanguageTable"
import UpdateLanguageModal from "./UpdateLanguageModel"
import SysLanguageCreateFormModal from "./SysLanguageCreateFormModel"
import { useTranslation } from 'react-i18next'

const SysLanguage = () => {
  const { t } = useTranslation()
  
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    languageCode: '',
    languageNameZh: '',
    isDeveloped: true,
    status: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedLanguage, setSelectedLanguage] = useState(null)

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      )
      const response = await api.get('/manage/sys-languages/page', {
        params: { currentPage, pageSize: pageSize, ...filteredParams },
      })

      if (response) {
        setData(response.data)
        setTotalNum(response.totalNum)
      }
    } catch (error) {
      console.error('Failed to fetch data', error)
      message.error('获取数据失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    setCurrent(1);
  };

  const handleSelectChange = (value, field) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
    setCurrent(1);
  };

  const handleCreateLanguage = async (values) => {
    try {
      await api.post('/manage/sys-languages/create', values)
      message.success('创建成功')
      setIsCreateModalVisible(false)
      createForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error('创建失败')
    }
  }

  const handleUpdateLanguage = async (values) => {
    try {
      await api.post('/manage/sys-languages/update', values)
      message.success('更新成功')
      setIsUpdateModalVisible(false)
      updateForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error('更新失败')
    }
  }

  const handleStatusChange = async (ids, status) => {
    if (!Array.isArray(ids)) {
      ids = [ids]
    }
    
    if (ids.length === 0) {
      message.warning(t('pleaseSelect'))
      return
    }

    const confirmContent = (
      <div>
        <p>{status ? t('enableConfirmTitle') : t('disableConfirmTitle')}</p>
        <p>{t('affectedModules')}:</p>
        <ul>
          <li>{t('adminLanguageSetting')}</li>
          <li>{t('appLanguageSetting')}</li>
          <li>{t('privacyPolicy')}</li>
          <li>{t('termsOfService')}</li>
        </ul>
      </div>
    )

    Modal.confirm({
      title: t('confirmTitle'),
      content: confirmContent,
      okText: t('confirm'),
      cancelText: t('cancel'),
      onOk: async () => {
        try {
          await api.post('/manage/sys-languages/change-status', {
            ids: ids,
            status: status
          })
          message.success(t('updateSuccess'))
          await fetchData()
        } catch (error) {
          message.error(t('updateFailed'))
        }
      }
    })
  }

  const handleEditClick = (language) => {
    setSelectedLanguage(language)
    setIsUpdateModalVisible(true)
  }

  const handleEnableStatusChange = async (id, event) => {
    try {
      await api.post('/manage/sys-languages/update-status', {
        ids: [id],
        status: event.target.checked
      })
      message.success('状态更新成功')
      await fetchData()
    } catch (error) {
      console.error('Failed to update status', error)
      message.error('状态更新失败')
    }
  }

  const handleBatchUpdateStatus = async (status) => {
    if (selectedRows.length === 0) {
      message.warning('请选择要修改的记录')
      return
    }

    try {
      await api.post('/manage/sys-languages/update-status', {
        ids: selectedRows,
        status: status
      })
      message.success('批量修改状态成功')
      await fetchData()
    } catch (error) {
      console.error('Failed to batch update status', error)
      message.error('批量修改状态失败')
    }
  }

  const totalPages = Math.ceil(totalNum / pageSize)

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows()

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize)
    setCurrent(1)
  }

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.languageCode}
                onChange={handleSearchChange}
                name="languageCode"
                placeholder={t('languageCode')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.languageNameZh}
                onChange={handleSearchChange}
                name="languageNameZh"
                placeholder={t('chineseName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.isDeveloped}
                onChange={(value) => handleSelectChange(value, 'isDeveloped')}
                placeholder={t('selectDevelopment')}
                style={{ width: 150 }}
                defaultValue={true}
                allowClear={false}
              >
                <Select.Option value={true}>{t('developed')}</Select.Option>
                <Select.Option value={false}>{t('notDeveloped')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSelectChange(value, 'status')}
                placeholder={t('selectStatus')}
                style={{ width: 150 }}
                allowClear
              >
                <Select.Option value={true}>{t('enabled')}</Select.Option>
                <Select.Option value={false}>{t('disabled')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleStatusChange(selectedRows, true)}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchEnable')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleStatusChange(selectedRows, false)}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDisable')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/sys-languages/delete-batch',
                    selectedRows,
                    fetchData,
                  })}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDelete')}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <SysLanguageTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleEnableStatusChange={(id, event) => handleStatusChange(id, event.target.checked)}
          />
        </Spin>
      </div>

      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />

      <SysLanguageCreateFormModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreateLanguage}
        confirmLoading={isLoading}
      />

      <UpdateLanguageModal
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={handleUpdateLanguage}
        initialValues={selectedLanguage}
        confirmLoading={isLoading}
      />
    </div>
  )
}

export default SysLanguage


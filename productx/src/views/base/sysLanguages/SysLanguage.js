import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Button, Form, Input, message, Spin, Col, Row } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import SysLanguageTable from "./SysLanguageTable"
import UpdateLanguageModal from "./UpdateLanguageModel"
import SysLanguageCreateFormModal from "./SysLanguageCreateFormModel"

const SysLanguage = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    languageCode: '',
    languageNameZh: '',
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
        params: { currentPage, size: pageSize, ...filteredParams },
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
    const { name, value } = event.target
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

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
      await api.put('/manage/sys-languages/update', values)
      message.success('更新成功')
      setIsUpdateModalVisible(false)
      updateForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error('更新失败')
    }
  }

  const handleStatusChange = async (id, event) => {
    try {
      await api.put(`/manage/sys-languages/update-status/${id}`, {
        isDeveloped: event.target.checked
      })
      message.success('状态更新成功')
      await fetchData()
    } catch (error) {
      message.error('状态更新失败')
    }
  }

  const handleEditClick = (language) => {
    setSelectedLanguage(language)
    setIsUpdateModalVisible(true)
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
                size="small"
                value={searchParams.languageCode}
                onChange={handleSearchChange}
                name="languageCode"
                placeholder="语言代码"
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.languageNameZh}
                onChange={handleSearchChange}
                name="languageNameZh"
                placeholder="中文名称"
                allowClear
              />
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={fetchData}
                disabled={isLoading}
                block
              >
                {isLoading ? <Spin /> : '查询'}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => setIsCreateModalVisible(true)}
                block
              >
                新增语言
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => HandleBatchDelete({
                  url: '/manage/sys-languages/delete-batch',
                  selectedRows,
                  fetchData,
                })}
                disabled={selectedRows.length === 0}
                block
              >
                批量删除
              </Button>
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
            handleStatusChange={handleStatusChange}
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

      <SysLanguageCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateLanguage}
        form={createForm}
      />

      <UpdateLanguageModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateLanguage={handleUpdateLanguage}
        selectedLanguage={selectedLanguage}
      />
    </div>
  )
}

export default SysLanguage


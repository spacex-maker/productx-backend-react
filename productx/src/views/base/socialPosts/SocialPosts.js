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
import SocialPostsTable from "./SocialPostsTable"
import SocialPostsCreateFormModal from "./SocialPostsCreateFormModel"
import SocialPostsDetailModal from "./SocialPostsDetailModal"

const { Option } = Select

const SocialPosts = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    platform: '',
    authorName: '',
    content: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [selectedPost, setSelectedPost] = useState(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)

  const platformOptions = [
    { value: 'Twitter', icon: <TwitterOutlined style={{ color: '#1DA1F2' }} /> },
    { value: 'Telegram', icon: <FaTelegram style={{ color: '#0088cc' }} /> },
    { value: 'YouTube', icon: <YoutubeOutlined style={{ color: '#FF0000' }} /> },
    { value: 'Reddit', icon: <RedditOutlined style={{ color: '#FF4500' }} /> },
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
      const response = await api.get('/manage/social-posts/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      })

      if (response) {
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

  const handleViewClick = (post) => {
    setSelectedPost(post)
    setIsDetailModalVisible(true)
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
                value={searchParams.authorName}
                onChange={(e) => handleSearchChange(e.target.value, 'authorName')}
                placeholder="账号名称"
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.content}
                onChange={(e) => handleSearchChange(e.target.value, 'content')}
                placeholder="帖子内容"
                allowClear
                style={{ width: 150 }}
              />
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
                  onClick={() => HandleBatchDelete({
                    url: '/manage/social-posts/delete-batch',
                    selectedRows,
                    fetchData,
                  })}
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
          <SocialPostsTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleViewClick={handleViewClick}
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

      <SocialPostsCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={async (values) => {
          try {
            await api.post('/manage/social-posts/create', values)
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

      <SocialPostsDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        post={selectedPost}
      />
    </div>
  )
}

export default SocialPosts

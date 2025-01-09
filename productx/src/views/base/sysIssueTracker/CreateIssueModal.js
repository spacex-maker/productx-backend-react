import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, message, Row, Col, Tooltip, Avatar } from 'antd'
import {
  BugOutlined,
  UserOutlined,
  FlagOutlined,
  FileTextOutlined,
  PushpinOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import api from 'src/axiosInstance'

const { TextArea } = Input
const { Option } = Select

const CreateIssueModal = ({
  isVisible,
  onCancel,
  onSuccess,
  issueTypes,
  issuePriorities,
}) => {
  const [form] = Form.useForm()
  const [managers, setManagers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchManagers = async (search = '') => {
    setLoading(true)
    try {
      const response = await api.get('/manage/manager/list', {
        params: { username: search }
      })
      if (response.data) {
        setManagers(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch managers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchManagers()
  }, [])

  const handleSubmit = async (values) => {
    try {
      await api.post('/manage/sys-issue-tracker/create', values)
      message.success('创建成功')
      form.resetFields()
      onSuccess()
    } catch (error) {
      console.error('Failed to create issue:', error)
      message.error('创建失败')
    }
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BugOutlined style={{ marginRight: 8 }} />
          新建问题
        </div>
      }
      open={isVisible}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => form.submit()}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label={
            <span>
              <PushpinOutlined /> 标题
              <Tooltip title="请输入简洁清晰的问题标题">
                <InfoCircleOutlined style={{ marginLeft: 4 }} />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input maxLength={100} />
        </Form.Item>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              name="type"
              label={<span><FileTextOutlined /> 问题类型</span>}
              rules={[{ required: true, message: '请选择类型' }]}
            >
              <Select>
                {issueTypes.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="priority"
              label={<span><FlagOutlined /> 优先级</span>}
              rules={[{ required: true, message: '请选择优先级' }]}
            >
              <Select>
                {issuePriorities.map(priority => (
                  <Option key={priority.value} value={priority.value}>{priority.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="assignee"
              label={<span><UserOutlined /> 处理人</span>}
              rules={[{ required: true, message: '请选择处理人' }]}
            >
              <Select
                showSearch
                loading={loading}
                filterOption={false}
                onSearch={fetchManagers}
              >
                {managers.map(manager => (
                  <Option key={manager.id} value={manager.id}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar size="small" src={manager.avatar} icon={<UserOutlined />} style={{ marginRight: 4 }} />
                      <span>{manager.username}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={
            <span>
              <FileTextOutlined /> 问题描述
              <Tooltip title="请详细描述问题的具体情况、复现步骤等">
                <InfoCircleOutlined style={{ marginLeft: 4 }} />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: '请输入问题描述' }]}
        >
          <TextArea
            rows={4}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label={<span><FileTextOutlined /> 标签</span>}
        >
          <Select mode="tags" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateIssueModal

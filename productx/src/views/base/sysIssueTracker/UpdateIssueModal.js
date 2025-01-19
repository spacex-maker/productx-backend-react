import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, message, Row, Col, Avatar } from 'antd'
import {
  BugOutlined,
  TagsOutlined,
  UserOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import api from 'src/axiosInstance'
import { useTranslation } from 'react-i18next'

const { TextArea } = Input
const { Option } = Select

const UpdateIssueModal = ({ visible, onCancel, onOk, form, issue, issueTypes, issuePriorities }) => {
  const { t } = useTranslation()
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
      const tags = Array.isArray(values.tags) ? values.tags : []

      await api.put(`/manage/sys-issue-tracker/update`, {
        ...values,
        id: issue?.id,
        tags,
        updateBy: localStorage.getItem('username') || 'system'
      })
      
      message.success(t('updateSuccess'))
      onOk()
    } catch (err) {
      console.error('Failed to update issue:', err)
      message.error(err?.response?.data?.message || t('updateFailed'))
    }
  }

  const statusOptions = [
    { value: 'Open', label: t('open') },
    { value: 'In Progress', label: t('inProgress') },
    { value: 'Resolved', label: t('resolved') },
    { value: 'Closed', label: t('closed') },
    { value: 'Reopened', label: t('reopened') }
  ]

  const typeOptions = [
    { value: 'Bug', label: t('bug') },
    { value: 'Feature Request', label: t('featureRequest') },
    { value: 'Discussion', label: t('discussion') },
    { value: 'Improvement', label: t('improvement') }
  ]

  return (
    <Modal
      title={<span><BugOutlined /> {t('updateIssue')}</span>}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          ...issue,
          tags: issue?.tags || [],
        }}
        preserve={false}
      >
        <Form.Item
          name="title"
          label={<><FileTextOutlined /> {t('title')}</>}
          rules={[{ required: true, message: t('pleaseEnterTitle') }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="type"
              label={<><ExclamationCircleOutlined /> {t('type')}</>}
              rules={[{ required: true, message: t('pleaseSelectType') }]}
            >
              <Select>
                {typeOptions.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="priority"
              label={<><ClockCircleOutlined /> {t('priority')}</>}
              rules={[{ required: true, message: t('pleaseSelectPriority') }]}
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
              name="status"
              label={<><ClockCircleOutlined /> {t('status')}</>}
              rules={[{ required: true, message: t('pleaseSelectStatus') }]}
            >
              <Select>
                {statusOptions.map(status => (
                  <Option key={status.value} value={status.value}>{status.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="assignee"
              label={<><UserOutlined /> {t('assignee')}</>}
              rules={[{ required: true, message: t('pleaseSelectAssignee') }]}
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
          <Col span={12}>
            <Form.Item
              name="tags"
              label={<><TagsOutlined /> {t('tags')}</>}
            >
              <Select mode="tags" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={<><FileTextOutlined /> {t('description')}</>}
          rules={[{ required: true, message: t('pleaseEnterDescription') }]}
        >
          <TextArea
            rows={4}
            maxLength={2000}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateIssueModal

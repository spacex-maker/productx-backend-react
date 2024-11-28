import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, message, Row, Col, Tooltip, Avatar } from 'antd'
import {
  BugOutlined,
  TagsOutlined,
  UserOutlined,
  FlagOutlined,
  FileTextOutlined,
  PushpinOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import api from 'src/axiosInstance'
import styled from 'styled-components'

const { TextArea } = Input
const { Option } = Select

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 8px;
  }

  .ant-form-item-label {
    padding: 0 0 4px;

    > label {
      font-size: 10px;
      height: 16px;
      display: flex;
      align-items: center;
      color: rgba(0, 0, 0, 0.85);

      .anticon {
        margin-right: 4px;
        font-size: 12px;
        color: #8c8c8c;
      }
    }
  }

  .ant-form-item-explain {
    font-size: 10px;
    min-height: 16px;
  }

  .ant-input,
  .ant-select-selector {
    font-size: 10px !important;
    border-radius: 4px !important;
    color: rgba(0, 0, 0, 0.85) !important;
  }

  .ant-input {
    padding: 4px 8px;

    &:hover, &:focus {
      border-color: #1890ff;
      box-shadow: none;
    }

    &::placeholder {
      color: #bfbfbf;
    }
  }

  .ant-select-selection-item {
    font-size: 10px;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.85) !important;
  }

  textarea.ant-input {
    padding: 4px 8px;
  }

  .ant-select-selection-placeholder {
    font-size: 10px;
    color: #bfbfbf !important;
  }

  .ant-select-selector {
    &:hover {
      border-color: #1890ff !important;
    }
  }

  .ant-form-item-required::before {
    line-height: 16px !important;
  }
`

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const StyledSelect = styled(Select)`
  .ant-select-selection-item {
    display: flex !important;
    align-items: center !important;

    .user-avatar {
      margin-right: 4px;
      flex-shrink: 0;
    }
  }
`

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

  // 获取管理员列表
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
    <StyledModal
      title={
        <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}>
          <BugOutlined style={{ marginRight: '6px', color: '#1890ff' }} />
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
      bodyStyle={{ padding: '12px 16px' }}
    >
      <StyledForm
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="small"
      >
        <Form.Item
          name="title"
          label={
            <span>
              <PushpinOutlined /> 标题
              <Tooltip title="请输入简洁清晰的问题标题">
                <InfoCircleOutlined style={{ marginLeft: '4px', color: '#8c8c8c' }} />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入问题标题" maxLength={100} />
        </Form.Item>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              name="type"
              label={<span><FileTextOutlined /> 问题类型</span>}
              rules={[{ required: true, message: '请选择类型' }]}
            >
              <Select placeholder="选择类型">
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
              <Select placeholder="选择优先级">
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
              <StyledSelect
                showSearch
                loading={loading}
                placeholder="搜索处理人"
                filterOption={false}
                onSearch={fetchManagers}
                optionLabelProp="label"
              >
                {managers.map(manager => (
                  <Option
                    key={manager.id}
                    value={manager.id}
                    label={manager.username}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        size={16}
                        src={manager.avatar}
                        icon={<UserOutlined />}
                        className="user-avatar"
                      />
                      <span>{manager.username}</span>
                    </div>
                  </Option>
                ))}
              </StyledSelect>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={
            <span>
              <FileTextOutlined /> 问题描述
              <Tooltip title="请详细描述问题的具体情况、复现步骤等">
                <InfoCircleOutlined style={{ marginLeft: '4px', color: '#8c8c8c' }} />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: '请输入问题描述' }]}
        >
          <TextArea
            rows={4}
            placeholder="请详细描述问题"
            maxLength={500}
            showCount={{
              formatter: ({ count, maxLength }) => (
                <span style={{ fontSize: '10px' }}>{count}/{maxLength}</span>
              )
            }}
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label={<span><TagsOutlined /> 标签</span>}
        >
          <Select
            mode="tags"
            placeholder="输入标签后回车"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </StyledForm>

      <style jsx global>{`
        .ant-modal-content {
          padding: 12px !important;
        }
        .ant-modal-header {
          margin-bottom: 8px !important;
        }
        .ant-modal-title {
          font-size: 12px !important;
          color: rgba(0, 0, 0, 0.85) !important;
        }
        .ant-modal-footer {
          margin-top: 8px !important;
        }
        .ant-modal-footer button {
          font-size: 10px !important;
          height: 22px !important;
          padding: 0 8px !important;
          border-radius: 4px !important;
        }
        .ant-select-dropdown {
          font-size: 10px !important;
          border-radius: 4px !important;
        }
        .ant-select-item {
          min-height: 22px !important;
          line-height: 22px !important;
          font-size: 10px !important;
          color: rgba(0, 0, 0, 0.85) !important;
        }
        .ant-select-dropdown .ant-select-item-option-content {
          display: flex !important;
          align-items: center !important;

          .user-avatar {
            margin-right: 4px;
            flex-shrink: 0;
          }
        }
      `}</style>
    </StyledModal>
  )
}

export default CreateIssueModal

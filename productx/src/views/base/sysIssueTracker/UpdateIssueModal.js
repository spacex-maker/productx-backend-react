import React from 'react'
import { Modal, Form, Input, Select, Upload, message, Button } from 'antd'
import {
  BugOutlined,
  TagsOutlined,
  UserOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  PaperClipOutlined,
  UploadOutlined
} from '@ant-design/icons'
import styled from 'styled-components'
import api from 'src/axiosInstance'

const { TextArea } = Input
const { Option } = Select

const UpdateIssueModal = ({ visible, onCancel, onOk, form, issue, issueTypes, issuePriorities }) => {
  const handleSubmit = async (values) => {
    try {
      // 处理标签数组
      const tags = values.tags ? values.tags.join(',') : ''
      
      // 处理附件
      const attachments = values.attachments ? 
        JSON.stringify(values.attachments.map(file => file.url || file.response.url)) : ''

      await api.put(`/manage/sys-issue-tracker/update`, {
        ...values,
        id: issue?.id,
        tags,
        attachments,
        updateBy: localStorage.getItem('username') || 'system'
      })
      message.success('更新成功')
      onOk()
    } catch (error) {
      console.error('Failed to update issue:', error)
      message.error('更新失败')
    }
  }

  const statusOptions = [
    { value: 'Open', label: '待处理' },
    { value: 'In Progress', label: '处理中' },
    { value: 'Resolved', label: '已解决' },
    { value: 'Closed', label: '已关闭' },
    { value: 'Reopened', label: '重新打开' }
  ]

  const typeOptions = [
    { value: 'Bug', label: 'Bug' },
    { value: 'Feature Request', label: '功能请求' },
    { value: 'Discussion', label: '讨论' },
    { value: 'Improvement', label: '改进' }
  ]

  return (
    <Modal
      title={<span><BugOutlined /> 更新问题</span>}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={500}
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          ...issue,
          tags: issue?.tags ? issue.tags.split(',') : [],
          attachments: issue?.attachments ? JSON.parse(issue.attachments) : []
        }}
        preserve={false}
      >
        {/* 标题 */}
        <Form.Item
          name="title"
          label={<><FileTextOutlined style={{ fontSize: '11px' }} /> 标题</>}
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入问题标题" />
        </Form.Item>

        {/* 类型和优先级一行 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <Form.Item
            name="type"
            label={<><ExclamationCircleOutlined style={{ fontSize: '11px' }} /> 类型</>}
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="选择问题类型">
              {typeOptions.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label={<><ClockCircleOutlined style={{ fontSize: '11px' }} /> 优先级</>}
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="选择优先级">
              {issuePriorities.map(priority => (
                <Option key={priority.value} value={priority.value}>{priority.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* 状态和处理人一行 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <Form.Item
            name="status"
            label={<><ClockCircleOutlined style={{ fontSize: '11px' }} /> 状态</>}
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="选择状态">
              {statusOptions.map(status => (
                <Option key={status.value} value={status.value}>{status.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="assignee"
            label={<><UserOutlined style={{ fontSize: '11px' }} /> 处理人</>}
            rules={[{ required: true, message: '请选择处理人' }]}
          >
            <Select
              showSearch
              placeholder="选择处理人"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="yh">YH</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </div>

        {/* 标签 */}
        <Form.Item
          name="tags"
          label={<><TagsOutlined style={{ fontSize: '11px' }} /> 标签</>}
        >
          <Select 
            mode="tags" 
            placeholder="添加标签" 
          />
        </Form.Item>

        {/* 描述 */}
        <Form.Item
          name="description"
          label={<><FileTextOutlined style={{ fontSize: '11px' }} /> 描述</>}
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <TextArea 
            rows={4}
            placeholder="请输入问题描述"
            showCount
            maxLength={500}
            style={{
              height: '96px',
              minHeight: '96px',
              maxHeight: '96px'
            }}
          />
        </Form.Item>

        {/* 附件 */}
        <Form.Item
          name="attachments"
          label={<><PaperClipOutlined style={{ fontSize: '11px' }} /> 附件</>}
        >
          <Upload
            action="/api/upload"
            listType="text"
            multiple
            maxCount={5}
          >
            <Button icon={<UploadOutlined />} size="small">
              上传附件
            </Button>
          </Upload>
        </Form.Item>
      </Form>

      <style jsx global>{`
        .ant-form-item {
          margin-bottom: 8px;
        }

        .ant-form-item-label {
          padding: 0;
        }

        .ant-form-item-label > label {
          font-size: 10px !important;
          height: 16px !important;
          line-height: 16px !important;
          color: #666666 !important;
        }

        .ant-input, .ant-select-selector, .ant-picker {
          height: 24px !important;
          font-size: 10px !important;
          padding: 0 4px !important;
          color: #000000 !important;
        }

        .ant-select-selection-item {
          line-height: 22px !important;
          font-size: 10px !important;
          color: #000000 !important;
        }

        .ant-input[id="description"] {
          height: 96px !important;
          min-height: 96px !important;
          max-height: 96px !important;
          padding: 4px !important;
          font-size: 10px !important;
          line-height: 1.5 !important;
          resize: none !important;
        }

        textarea.ant-input {
          height: auto;
          min-height: auto;
        }

        .ant-input-textarea {
          .ant-input {
            height: auto;
            min-height: auto;
          }
        }

        .ant-modal-header {
          padding: 8px 12px;
        }

        .ant-modal-body {
          padding: 12px;
        }

        .ant-modal-footer {
          padding: 8px 12px;
        }

        .ant-btn {
          height: 24px !important;
          padding: 0 8px !important;
          font-size: 10px !important;
        }

        .ant-select-selection-item-content {
          color: #000000 !important;
        }

        .ant-select-item-option-content {
          color: #000000 !important;
          font-size: 10px !important;
        }

        .ant-modal-title {
          font-size: 12px !important;
          color: #000000 !important;
        }

        .ant-select-multiple .ant-select-selector {
          height: 24px !important;
          min-height: 24px !important;
          padding: 0 4px !important;
          overflow: hidden !important;
          display: flex !important;
          align-items: center !important;

          .ant-select-selection-overflow {
            display: flex !important;
            align-items: center !important;
            flex-wrap: nowrap !important;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            height: 100% !important;
          }

          .ant-select-selection-overflow-item {
            align-self: center !important;
          }

          .ant-select-selection-item {
            height: 16px !important;
            line-height: 14px !important;
            margin: 0 2px !important;
            padding: 0 4px !important;
            font-size: 10px !important;
            display: flex !important;
            align-items: center !important;
          }

          .ant-select-selection-search {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;

            .ant-select-selection-search-input {
              height: 20px !important;
              min-height: 20px !important;
              line-height: 20px !important;
            }
          }
        }

        // 标签选项样式
        .ant-select-dropdown {
          .ant-select-item {
            min-height: 24px !important;
            line-height: 24px !important;
            padding: 0 8px !important;
            font-size: 10px !important;
          }
        }

        .ant-input::placeholder,
        .ant-select-selection-placeholder {
          color: #999999 !important;
        }
      `}</style>
    </Modal>
  )
}

export default React.memo(UpdateIssueModal)

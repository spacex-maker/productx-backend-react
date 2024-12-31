import React from 'react'
import { Modal, Form, Input, Select, message, Button } from 'antd'
import {
  BugOutlined,
  TagsOutlined,
  UserOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import api from 'src/axiosInstance'
import { useTranslation } from 'react-i18next'

const { TextArea } = Input
const { Option } = Select

const DescriptionEditor = styled.div`
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  background: #fff;
  transition: all 0.2s;

  &:hover {
    border-color: #40a9ff;
  }

  &:focus-within {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  }
`;

const EditorContent = styled.div`
  .ant-input {
    border: none !important;
    box-shadow: none !important;
    font-size: 10px !important;
    padding: 8px !important;
    background: transparent !important;
    resize: vertical !important;
    min-height: 60px !important;
    max-height: 200px !important;

    &:focus {
      box-shadow: none !important;
    }

    &::placeholder {
      color: #bfbfbf !important;
      font-size: 10px !important;
    }
  }
`;

const EditorFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 8px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;

  .counter {
    font-size: 9px;
    color: #999;
  }
`;

const StyledSelect = styled(Select)`
  &.ant-select-multiple .ant-select-selector {
    display: flex;
    align-items: center;
    min-height: 24px;
    padding: 2px 4px;
  }

  &.ant-select-multiple .ant-select-selection-overflow {
    position: static;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px;
    margin: 0 !important;
  }

  &.ant-select-multiple .ant-select-selection-overflow-item {
    position: static;
    display: flex;
    align-items: center;
    margin: 0;
  }

  &.ant-select-multiple .ant-select-selection-item {
    position: static;
    display: inline-flex;
    align-items: center;
    height: 16px;
    line-height: 14px;
    margin: 0;
    padding: 0 4px;
    font-size: 10px;

    .ant-select-selection-item-content {
      margin-right: 2px;
    }

    .ant-select-selection-item-remove {
      display: flex;
      align-items: center;
      margin-left: 2px;
      font-size: 10px;
      
      .anticon {
        display: flex;
        align-items: center;
        font-size: 8px;
      }
    }
  }

  &.ant-select-multiple .ant-select-selection-search {
    position: static;
    display: inline-flex;
    align-items: center;
    height: 16px;
    margin: 0;
    
    input {
      height: 16px;
      min-height: 16px;
    }
  }
`;

const UpdateIssueModal = ({ visible, onCancel, onOk, form, issue, issueTypes, issuePriorities }) => {
  const { t } = useTranslation()

  const handleSubmit = async (values) => {
    try {
      // 直接使用 tags 数组
      const tags = Array.isArray(values.tags) ? values.tags : []

      const response = await api.put(`/manage/sys-issue-tracker/update`, {
        ...values,
        id: issue?.id,
        tags, // 传递数组
        updateBy: localStorage.getItem('username') || 'system'
      })
      
        message.success('更新成功')
        onOk()

    } catch (err) {
      console.error('Failed to update issue:', err)
      message.error(err?.response?.data?.message || '更新失败，请稍后重试')
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
          tags: issue?.tags || [], // 直接使用返回的数组
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
          <StyledSelect
            mode="tags"
            placeholder="添加标签"
            style={{ width: '100%' }}
          />
        </Form.Item>

        {/* 描述 */}
        <Form.Item
          name="description"
          label={<><FileTextOutlined style={{ fontSize: '11px' }} /> {t('description')}</>}
          rules={[{ required: true, message: t('pleaseEnterDescription') }]}
        >
          <DescriptionEditor>
            <EditorContent>
              <TextArea
                placeholder={t('enterDescription')}
                autoSize={false}
                style={{ height: '120px' }}
                maxLength={2000}
              />
            </EditorContent>
            <EditorFooter>
              <span className="counter">
                {form.getFieldValue('description')?.length || 0}/2000
              </span>
            </EditorFooter>
          </DescriptionEditor>
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
          height: auto !important;
          min-height: auto !important;
          max-height: none !important;
        }

        textarea.ant-input {
          height: auto;
          min-height: auto;
        }

        .ant-input-textarea {
          display: block;
        }

        .ant-input-textarea-show-count::after {
          display: none;
        }

        .ant-input::placeholder {
          color: #bfbfbf !important;
          font-size: 10px !important;
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

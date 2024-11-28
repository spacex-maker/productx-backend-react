import React from 'react'
import { Modal, Form, Input, Select } from 'antd'
import api from 'src/axiosInstance'

const { TextArea } = Input
const { Option } = Select

const UpdateIssueModal = ({
  visible,
  onCancel,
  onOk,
  form,
  issue,
  issueTypes,
  issuePriorities,
}) => {
  const handleSubmit = async (values) => {
    try {
      await api.put(`/manage/sys-issue-tracker/update`, {
        ...values,
        id: issue?.id,
      })
      message.success('更新成功')
      onCancel()
    } catch (error) {
      console.error('Failed to update issue:', error)
      message.error('更新失败')
    }
  }

  return (
    <Modal
      title="更新问题"
      open={visible}
      onCancel={onCancel}
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
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="type"
          label="类型"
          rules={[{ required: true, message: '请选择类型' }]}
        >
          <Select>
            {issueTypes.map(type => (
              <Option key={type.value} value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="priority"
          label="优先级"
          rules={[{ required: true, message: '请选择优先级' }]}
        >
          <Select>
            {issuePriorities.map(priority => (
              <Option key={priority.value} value={priority.value}>{priority.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="assignee"
          label="处理人"
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

        <Form.Item
          name="tags"
          label="标签"
        >
          <Select mode="tags" placeholder="添加标签" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateIssueModal 
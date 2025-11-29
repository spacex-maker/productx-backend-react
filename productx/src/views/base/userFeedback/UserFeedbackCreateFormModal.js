import React from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { TextArea } = Input;

const UserFeedbackCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title="创建反馈"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={800}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="用户ID"
          name="userId"
        >
          <InputNumber 
            placeholder="留空表示匿名反馈" 
            style={{ width: '100%' }} 
            min={1}
          />
        </Form.Item>

        <Form.Item
          label="反馈类型"
          name="feedbackType"
          rules={[{ required: true, message: '请选择反馈类型' }]}
        >
          <Select placeholder="请选择反馈类型">
            <Option value="suggestion">功能建议</Option>
            <Option value="bug">缺陷反馈</Option>
            <Option value="question">使用咨询</Option>
            <Option value="other">其他</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="反馈标题"
          name="title"
          rules={[{ required: true, message: '请输入反馈标题' }]}
        >
          <Input placeholder="请输入反馈标题" />
        </Form.Item>

        <Form.Item
          label="反馈内容"
          name="content"
          rules={[{ required: true, message: '请输入反馈内容' }]}
        >
          <TextArea 
            placeholder="请输入反馈详细内容" 
            rows={6}
          />
        </Form.Item>

        <Form.Item
          label="优先级"
          name="priority"
          initialValue="MEDIUM"
        >
          <Select placeholder="请选择优先级">
            <Option value="LOW">低</Option>
            <Option value="MEDIUM">中</Option>
            <Option value="HIGH">高</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="联系方式"
          name="contact"
        >
          <Input placeholder="邮箱或手机号（可选）" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFeedbackCreateFormModal;


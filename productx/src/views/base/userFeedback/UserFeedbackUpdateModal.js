import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Divider, Tag, Space, theme } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { TextArea } = Input;

const UserFeedbackUpdateModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateFeedback,
  selectedFeedback,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  useEffect(() => {
    if (isVisible && selectedFeedback) {
      form.setFieldsValue({
        id: selectedFeedback.id,
        feedbackType: selectedFeedback.feedbackType,
        title: selectedFeedback.title,
        content: selectedFeedback.content,
        priority: selectedFeedback.priority,
        contact: selectedFeedback.contact,
        status: selectedFeedback.status,
        adminReply: selectedFeedback.adminReply,
      });
    }
  }, [isVisible, selectedFeedback, form]);

  const getFeedbackTypeLabel = (type) => {
    const typeMap = {
      'suggestion': '功能建议',
      'bug': '缺陷反馈',
      'question': '使用咨询',
      'other': '其他'
    };
    return typeMap[type] || type;
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      'LOW': 'default',
      'MEDIUM': 'processing',
      'HIGH': 'error'
    };
    return colorMap[priority] || 'default';
  };

  return (
    <Modal
      title="更新反馈"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={900}
    >
      <Form 
        form={form} 
        onFinish={handleUpdateFeedback}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* 只读信息区域 */}
        <div style={{ 
          background: token.colorFillQuaternary, 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: `1px solid ${token.colorBorderSecondary}`
        }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ color: token.colorTextSecondary, fontSize: '13px' }}>反馈类型：</span>
            <Tag color="blue" style={{ marginLeft: '8px' }}>
              {selectedFeedback && getFeedbackTypeLabel(selectedFeedback.feedbackType)}
            </Tag>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <span style={{ color: token.colorTextSecondary, fontSize: '13px' }}>反馈标题：</span>
            <span style={{ marginLeft: '8px', fontWeight: 500, color: token.colorText }}>
              {selectedFeedback?.title}
            </span>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <span style={{ color: token.colorTextSecondary, fontSize: '13px' }}>反馈内容：</span>
            <div style={{ 
              marginLeft: '8px', 
              marginTop: '4px',
              padding: '8px',
              background: token.colorBgContainer,
              borderRadius: '4px',
              whiteSpace: 'pre-wrap',
              maxHeight: '150px',
              overflow: 'auto',
              color: token.colorText,
              border: `1px solid ${token.colorBorderSecondary}`
            }}>
              {selectedFeedback?.content}
            </div>
          </div>
          
          {selectedFeedback?.contact && (
            <div>
              <span style={{ color: token.colorTextSecondary, fontSize: '13px' }}>联系方式：</span>
              <span style={{ marginLeft: '8px', color: token.colorText }}>{selectedFeedback.contact}</span>
            </div>
          )}
        </div>

        <Divider style={{ margin: '16px 0', borderColor: token.colorBorderSecondary }} />

        {/* 可编辑字段 */}
        <Form.Item
          label="优先级"
          name="priority"
          rules={[{ required: true, message: '请选择优先级' }]}
        >
          <Select placeholder="请选择优先级" style={{ width: '100%' }}>
            <Option value="LOW">
              <Tag color="default">低</Tag> 低优先级
            </Option>
            <Option value="MEDIUM">
              <Tag color="processing">中</Tag> 中优先级
            </Option>
            <Option value="HIGH">
              <Tag color="error">高</Tag> 高优先级
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="处理状态"
          name="status"
          rules={[{ required: true, message: '请选择处理状态' }]}
        >
          <Select placeholder="请选择处理状态" style={{ width: '100%' }}>
            <Option value="PENDING">
              <Tag color="default">待处理</Tag>
            </Option>
            <Option value="PROCESSING">
              <Tag color="processing">处理中</Tag>
            </Option>
            <Option value="RESOLVED">
              <Tag color="success">已解决</Tag>
            </Option>
            <Option value="CLOSED">
              <Tag color="error">已关闭</Tag>
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="管理员回复"
          name="adminReply"
          extra="回复后会自动更新回复时间"
        >
          <TextArea 
            placeholder="请输入管理员回复内容，用户可以看到此回复" 
            rows={5}
            showCount
            maxLength={1000}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFeedbackUpdateModal;


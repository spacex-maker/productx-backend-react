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
      'suggestion': t('suggestion'),
      'bug': t('bug'),
      'question': t('question'),
      'other': t('other')
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
      title={t('updateFeedback')}
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
            <span style={{ color: token.colorTextSecondary, fontSize: '13px' }}>{t('feedbackType')}：</span>
            <Tag color="blue" style={{ marginLeft: '8px' }}>
              {selectedFeedback && getFeedbackTypeLabel(selectedFeedback.feedbackType)}
            </Tag>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <span style={{ color: token.colorTextSecondary, fontSize: '13px' }}>{t('feedbackTitle')}：</span>
            <span style={{ marginLeft: '8px', fontWeight: 500, color: token.colorText }}>
              {selectedFeedback?.title}
            </span>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <span style={{ color: token.colorTextSecondary, fontSize: '13px' }}>{t('feedbackContent')}：</span>
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
              <span style={{ color: token.colorTextSecondary, fontSize: '13px' }}>{t('contact')}：</span>
              <span style={{ marginLeft: '8px', color: token.colorText }}>{selectedFeedback.contact}</span>
            </div>
          )}
        </div>

        <Divider style={{ margin: '16px 0', borderColor: token.colorBorderSecondary }} />

        {/* 可编辑字段 */}
        <Form.Item
          label={t('priority')}
          name="priority"
          rules={[{ required: true, message: t('pleaseSelectPriority') }]}
        >
          <Select placeholder={t('pleaseSelectPriority')} style={{ width: '100%' }}>
            <Option value="LOW">
              <Tag color="default">{t('low')}</Tag> {t('low')} {t('priority')}
            </Option>
            <Option value="MEDIUM">
              <Tag color="processing">{t('medium')}</Tag> {t('medium')} {t('priority')}
            </Option>
            <Option value="HIGH">
              <Tag color="error">{t('high')}</Tag> {t('high')} {t('priority')}
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t('processingStatus')}
          name="status"
          rules={[{ required: true, message: t('pleaseSelectStatus') }]}
        >
          <Select placeholder={t('pleaseSelectStatus')} style={{ width: '100%' }}>
            <Option value="PENDING">
              <Tag color="default">{t('pending')}</Tag>
            </Option>
            <Option value="PROCESSING">
              <Tag color="processing">{t('processing')}</Tag>
            </Option>
            <Option value="RESOLVED">
              <Tag color="success">{t('resolved')}</Tag>
            </Option>
            <Option value="CLOSED">
              <Tag color="error">{t('closed')}</Tag>
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t('adminReply')}
          name="adminReply"
          extra={t('replyTime')}
        >
          <TextArea 
            placeholder={t('pleaseInputReplyContent')} 
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


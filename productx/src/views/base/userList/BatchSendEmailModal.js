import React, { useMemo } from 'react';
import { Modal, Form, Input, message, Alert, Space, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';

const { TextArea } = Input;
const { Text } = Typography;

/**
 * 批量发邮件模态框
 * @param {boolean} isVisible - 是否显示
 * @param {function} onCancel - 关闭回调
 * @param {function} onSuccess - 发送成功后的回调（如刷新列表）
 * @param {Array} selectedUsers - 当前选中的用户列表 [{ id, email, ... }, ...]
 */
const BatchSendEmailModal = ({ isVisible, onCancel, onSuccess, selectedUsers = [] }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState(null);

  const emails = useMemo(() => {
    const list = (selectedUsers || [])
      .map((u) => (u && u.email ? String(u.email).trim() : null))
      .filter(Boolean);
    return [...new Set(list)];
  }, [selectedUsers]);

  const noEmailCount = useMemo(() => {
    return (selectedUsers || []).filter((u) => !u || !u.email || !String(u.email).trim()).length;
  }, [selectedUsers]);

  const handleSubmit = async (values) => {
    // 从多行文本中解析手动输入的邮箱，支持逗号 / 分号 / 换行分隔
    const manualEmailsRaw = values.manualEmails || '';
    const manualEmails = manualEmailsRaw
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter(Boolean);

    // 合并：选中用户邮箱 + 手动输入邮箱，去重
    const allEmails = [...new Set([...emails, ...manualEmails])];

    if (!allEmails.length) {
      message.warning(t('batchSendEmailNoEmails') || '没有任何有效邮箱，请勾选用户或手动输入邮箱');
      return;
    }

    setSubmitting(true);
    setResult(null);
    try {
      const res = await api.post('/manage/user/batch-send-email', {
        emails: allEmails,
        subject: values.subject || '',
        content: values.content || '',
      });
      // 响应格式: { success, message, data: { successCount, failCount, failedEmails } }
      const payload = res?.data?.data ?? res?.data ?? res;
      const successCount = payload.successCount ?? 0;
      const failCount = payload.failCount ?? 0;
      const failedEmails = payload.failedEmails ?? [];

      setResult({
        successCount,
        failCount,
        failedEmails,
      });

      message.success(res?.data?.message || res?.message || t('batchSendEmailDone') || '批量发送完成');

      // 全部成功时才清空表单；若有失败，保留输入内容方便用户修改后重试
      if (failCount === 0) {
        form.resetFields();
      }

      if (typeof onSuccess === 'function') onSuccess();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || t('errorMessage');
      message.error(msg);
      setResult(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <MailOutlined />
          {t('batchSendEmail')}
        </Space>
      }
      open={isVisible}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okText={t('submit')}
      cancelText={t('cancel')}
      confirmLoading={submitting}
      width={560}
      maskClosable={false}
      destroyOnClose
    >
      {emails.length === 0 && (
        <Alert
          type="warning"
          message={t('batchSendEmailNoEmails')}
          description={t('batchSendEmailNoEmailsDesc')}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      {emails.length > 0 && (
        <Alert
          type="info"
          message={
            <Space>
              <span>{t('batchSendEmailRecipients')}</span>
              <Text strong>{emails.length}</Text>
              <span>{t('batchSendEmailRecipientsUnit')}</span>
              {noEmailCount > 0 && (
                <Text type="secondary">
                  （{t('batchSendEmailSkippedNoEmail')} {noEmailCount}）
                </Text>
              )}
            </Space>
          }
          description={emails.length <= 5 ? emails.join(', ') : `${emails.slice(0, 5).join(', ')} ... 等 ${emails.length} 个`}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label={t('batchSendEmailManualEmails')}
          name="manualEmails"
          tooltip={t('batchSendEmailManualEmailsTip')}
        >
          <TextArea
            rows={4}
            placeholder={t('batchSendEmailManualEmailsPlaceholder')}
            maxLength={3000}
            showCount
          />
        </Form.Item>
        <Form.Item
          label={t('batchSendEmailSubject')}
          name="subject"
          rules={[{ required: true, message: t('batchSendEmailSubjectRequired') }]}
        >
          <Input placeholder={t('batchSendEmailSubjectPlaceholder')} maxLength={200} showCount />
        </Form.Item>
        <Form.Item
          label={t('batchSendEmailContent')}
          name="content"
          rules={[{ required: true, message: t('batchSendEmailContentRequired') }]}
        >
          <TextArea rows={6} placeholder={t('batchSendEmailContentPlaceholder')} maxLength={5000} showCount />
        </Form.Item>
      </Form>

      {result && (
        <Alert
          type={result.failCount === 0 ? 'success' : 'warning'}
          message={
            result.failCount === 0
              ? `${t('batchSendEmailSuccessCount')} ${result.successCount}`
              : `${t('batchSendEmailResultSummary')} ${t('batchSendEmailSuccess')}: ${result.successCount}, ${t('batchSendEmailFail')}: ${result.failCount}`
          }
          description={
            result.failedEmails && result.failedEmails.length > 0 ? (
              <div>
                <Text type="secondary">{t('batchSendEmailFailedEmails')}: </Text>
                <div style={{ marginTop: 4 }}>{result.failedEmails.join(', ')}</div>
              </div>
            ) : null
          }
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </Modal>
  );
};

export default BatchSendEmailModal;

import React, { useMemo } from 'react';
import { Modal, Form, Input, message, Alert, Space, Typography, Tabs, Select, Pagination, Tag, Button } from 'antd';
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

  // 日志 Tab 状态
  const [activeTab, setActiveTab] = React.useState('send');
  const [logLoading, setLogLoading] = React.useState(false);
  const [logList, setLogList] = React.useState([]);
  const [logTotal, setLogTotal] = React.useState(0);
  const [logPage, setLogPage] = React.useState(1);
  const [logPageSize, setLogPageSize] = React.useState(10);
  const [logFilters, setLogFilters] = React.useState({
    toEmail: '',
    status: undefined,
  });

  const emails = useMemo(() => {
    const list = (selectedUsers || [])
      .map((u) => (u && u.email ? String(u.email).trim() : null))
      .filter(Boolean);
    return [...new Set(list)];
  }, [selectedUsers]);

  const noEmailCount = useMemo(() => {
    return (selectedUsers || []).filter((u) => !u || !u.email || !String(u.email).trim()).length;
  }, [selectedUsers]);

  const fetchLogs = async (page = logPage, pageSize = logPageSize, filters = logFilters) => {
    setLogLoading(true);
    try {
      const params = {
        currentPage: page,
        pageSize,
      };
      if (filters.toEmail) params.toEmail = filters.toEmail;
      if (filters.status !== undefined && filters.status !== null && filters.status !== '') {
        params.status = filters.status;
      }

      const res = await api.get('/manage/user-email-send-log/list', { params });
      const list = res?.data ?? [];
      const total = res?.totalNum ?? 0;
      setLogList(Array.isArray(list) ? list : []);
      setLogTotal(Number(total) || 0);
      setLogPage(page);
      setLogPageSize(pageSize);
    } catch (e) {
      console.error('Failed to fetch email send logs', e);
      message.error(t('fetchFailed') || '获取邮件发送记录失败');
    } finally {
      setLogLoading(false);
    }
  };

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
    setActiveTab('send');
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
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          if (key === 'logs') {
            fetchLogs(1, logPageSize);
          }
        }}
        items={[
          {
            key: 'send',
            label: t('batchSendEmailTabSend') || '发送邮件',
            children: (
              <>
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
                    description={
                      emails.length <= 5
                        ? emails.join(', ')
                        : `${emails.slice(0, 5).join(', ')} ... 等 ${emails.length} 个`
                    }
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
                    <Input
                      placeholder={t('batchSendEmailSubjectPlaceholder')}
                      maxLength={200}
                      showCount
                    />
                  </Form.Item>
                  <Form.Item
                    label={t('batchSendEmailContent')}
                    name="content"
                    rules={[{ required: true, message: t('batchSendEmailContentRequired') }]}
                  >
                    <TextArea
                      rows={6}
                      placeholder={t('batchSendEmailContentPlaceholder')}
                      maxLength={5000}
                      showCount
                    />
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
              </>
            ),
          },
          {
            key: 'logs',
            label: t('batchSendEmailTabLogs') || '发送记录',
            children: (
              <>
                <div className="search-container" style={{ marginBottom: 16 }}>
                  <Space wrap>
                    <Input
                      style={{ width: 220 }}
                      placeholder={t('email')}
                      value={logFilters.toEmail}
                      onChange={(e) =>
                        setLogFilters((prev) => ({ ...prev, toEmail: e.target.value }))
                      }
                      allowClear
                    />
                    <Select
                      style={{ width: 160 }}
                      placeholder={t('status')}
                      allowClear
                      value={logFilters.status}
                      onChange={(value) =>
                        setLogFilters((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <Select.Option value={0}>{t('emailStatusPending') || '待发送'}</Select.Option>
                      <Select.Option value={1}>{t('emailStatusSuccess') || '成功'}</Select.Option>
                      <Select.Option value={2}>{t('emailStatusFail') || '失败'}</Select.Option>
                    </Select>
                    <Button
                      type="primary"
                      size="middle"
                      onClick={() => fetchLogs(1, logPageSize, logFilters)}
                    >
                      {t('search')}
                    </Button>
                  </Space>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>{t('email')}</th>
                        <th>{t('batchSendEmailSubject')}</th>
                        <th style={{ width: 120 }}>{t('status')}</th>
                        <th style={{ width: 180 }}>{t('createTime') || '创建时间'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!logLoading && (!logList || logList.length === 0) && (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center' }}>
                            {t('noData')}
                          </td>
                        </tr>
                      )}
                      {logList.map((item) => (
                        <tr key={item.id || `${item.toEmail}-${item.createTime}`}>
                          <td className="text-truncate" title={item.toEmail}>
                            {item.toEmail || '—'}
                          </td>
                          <td className="text-truncate" title={item.subject}>
                            {item.subject || '—'}
                          </td>
                          <td>
                            {item.status === 0 && (
                              <Tag color="default">{t('emailStatusPending') || '待发送'}</Tag>
                            )}
                            {item.status === 1 && (
                              <Tag color="success">{t('emailStatusSuccess') || '成功'}</Tag>
                            )}
                            {item.status === 2 && (
                              <Tag color="error">{t('emailStatusFail') || '失败'}</Tag>
                            )}
                            {item.status !== 0 && item.status !== 1 && item.status !== 2 && (item.status ?? '—')}
                          </td>
                          <td className="text-truncate" title={item.createTime}>
                            {item.createTime || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                  <Pagination
                    size="small"
                    current={logPage}
                    pageSize={logPageSize}
                    total={logTotal}
                    showSizeChanger
                    onChange={(page, pageSize) => fetchLogs(page, pageSize, logFilters)}
                  />
                </div>
              </>
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default BatchSendEmailModal;

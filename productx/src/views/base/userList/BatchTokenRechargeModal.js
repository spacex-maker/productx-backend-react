import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Alert,
  Space,
  Typography,
  Tag,
  Button,
  List,
} from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';

const { TextArea } = Input;
const { Text } = Typography;

/**
 * 批量充值 Token
 */
const BatchTokenRechargeModal = ({ isVisible, onCancel, onSuccess, selectedUsers = [] }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [templates, setTemplates] = useState([]);

  const userIds = useMemo(() => {
    return (selectedUsers || []).map((u) => u?.id).filter(Boolean);
  }, [selectedUsers]);

  useEffect(() => {
    if (!isVisible) return;
    setResult(null);
    form.resetFields();
    api.get('/manage/user/batch-token-recharge/remark-templates')
      .then((list) => {
        setTemplates(Array.isArray(list) ? list : []);
      })
      .catch(() => setTemplates([]));
  }, [isVisible, form]);

  const handleTemplateClick = (text) => {
    form.setFieldsValue({ remark: text });
  };

  const handleSubmit = async (values) => {
    if (!userIds.length) {
      message.warning(t('batchTokenRechargeNoUsers'));
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const data = await api.post('/manage/user/batch-token-recharge', {
        userIds,
        amount: values.amount,
        remark: values.remark?.trim(),
      });
      setResult(data);
      if (data?.failCount === 0) {
        message.success(t('batchTokenRechargeSuccess', { count: data.successCount }));
        onSuccess?.();
      } else if (data?.successCount > 0) {
        message.warning(
          t('batchTokenRechargePartial', {
            success: data.successCount,
            fail: data.failCount,
          }),
        );
        onSuccess?.();
      } else {
        message.error(t('batchTokenRechargeAllFailed'));
      }
    } catch (e) {
      message.error(e?.response?.data?.message || e?.message || t('batchTokenRechargeFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <ThunderboltOutlined />
          {t('batchTokenRecharge')}
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      width={640}
      footer={null}
      destroyOnClose
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message={t('batchTokenRechargeHint')}
      />

      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">{t('batchTokenRechargeRecipients')}: </Text>
        <Tag color="blue">{userIds.length} {t('batchTokenRechargeRecipientsUnit')}</Tag>
        {userIds.length === 0 && (
          <Text type="danger">{t('batchTokenRechargeNoUsers')}</Text>
        )}
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="amount"
          label={t('batchTokenRechargeAmount')}
          rules={[
            { required: true, message: t('batchTokenRechargeAmountRequired') },
          ]}
        >
          <InputNumber
            min={0.01}
            max={1000000}
            precision={2}
            style={{ width: '100%' }}
            placeholder={t('batchTokenRechargeAmountPlaceholder')}
          />
        </Form.Item>

        <Form.Item label={t('batchTokenRechargeRemarkTemplates')}>
          <Space wrap size={[8, 8]}>
            {templates.map((tpl) => (
              <Button key={tpl} size="small" onClick={() => handleTemplateClick(tpl)}>
                {tpl}
              </Button>
            ))}
          </Space>
        </Form.Item>

        <Form.Item
          name="remark"
          label={t('batchTokenRechargeRemark')}
          rules={[
            { required: true, message: t('batchTokenRechargeRemarkRequired') },
            { min: 2, message: t('batchTokenRechargeRemarkMin') },
            { max: 200, message: t('batchTokenRechargeRemarkMax') },
          ]}
        >
          <TextArea
            rows={4}
            placeholder={t('batchTokenRechargeRemarkPlaceholder')}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={onCancel}>{t('cancel')}</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              disabled={userIds.length === 0}
            >
              {t('batchTokenRechargeSubmit')}
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {result && (
        <Alert
          style={{ marginTop: 8 }}
          type={result.failCount > 0 ? 'warning' : 'success'}
          message={t('batchTokenRechargeResultSummary')}
          description={
            <div>
              <div>
                {t('batchTokenRechargeSuccessCount')}: {result.successCount}，
                {t('batchTokenRechargeFailCount')}: {result.failCount}
              </div>
              {result.failures?.length > 0 && (
                <List
                  size="small"
                  style={{ marginTop: 8 }}
                  dataSource={result.failures}
                  renderItem={(item) => (
                    <List.Item>
                      <Text type="danger">
                        用户 {item.userId}: {item.reason}
                      </Text>
                    </List.Item>
                  )}
                />
              )}
            </div>
          }
        />
      )}
    </Modal>
  );
};

export default BatchTokenRechargeModal;

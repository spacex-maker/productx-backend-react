import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, Typography, Row, Col, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CloudOutlined,
  KeyOutlined,
  GlobalOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const UpdateObjectStorageModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateStorage,
  selectedStorage
}) => {
  const { t } = useTranslation();

  const styles = {
    icon: {
      color: '#1890ff',
      marginRight: '8px'
    },
    modalTitle: {
      display: 'flex',
      alignItems: 'center'
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px'
    }
  };

  useEffect(() => {
    if (isVisible && selectedStorage) {
      form.setFieldsValue({
        id: selectedStorage.id,
        accessKey: selectedStorage.accessKey,
        secretKey: selectedStorage.secretKey,
        region: selectedStorage.region,
        bucketName: selectedStorage.bucketName,
        endpoint: selectedStorage.endpoint,
        isActive: selectedStorage.isActive,
        isDefault: selectedStorage.isDefault,
        description: selectedStorage.description,
        tags: selectedStorage.tags
      });
    }
  }, [isVisible, selectedStorage, form]);

  return (
    <Modal
      title={
        <span style={styles.modalTitle}>
          <CloudOutlined style={styles.icon} />
          {t('updateStorage')}
        </span>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      width={800}
      maskClosable={false}
    >
      <Form form={form} onFinish={handleUpdateStorage} layout="vertical">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Title level={5} style={styles.sectionTitle}>
          <KeyOutlined style={styles.icon} />
          {t('credentials')}
        </Title>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={t('accessKey')}
              name="accessKey"
              rules={[{ required: true, message: t('pleaseEnterAccessKey') }]}
            >
              <Input placeholder={t('enterAccessKey')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('secretKey')}
              name="secretKey"
              rules={[{ required: true, message: t('pleaseEnterSecretKey') }]}
            >
              <Input.Password placeholder={t('enterSecretKey')} />
            </Form.Item>
          </Col>
        </Row>

        <Title level={5} style={styles.sectionTitle}>
          <GlobalOutlined style={styles.icon} />
          {t('configuration')}
        </Title>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label={t('region')}
              name="region"
              rules={[{ required: true, message: t('pleaseEnterRegion') }]}
            >
              <Input placeholder={t('enterRegion')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('bucketName')}
              name="bucketName"
              rules={[{ required: true, message: t('pleaseEnterBucketName') }]}
            >
              <Input placeholder={t('enterBucketName')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('endpoint')}
              name="endpoint"
              rules={[{ required: true, message: t('pleaseEnterEndpoint') }]}
            >
              <Input placeholder={t('enterEndpoint')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label={t('tags')}
              name="tags"
            >
              <Input placeholder={t('enterTags')} />
            </Form.Item>
          </Col>
          <Col span={16}>
            <div style={{ display: 'flex', gap: '24px', marginTop: '29px' }}>
              <Form.Item
                name="isActive"
                label={t('isActive')}
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch 
                  checkedChildren={t('yes')} 
                  unCheckedChildren={t('no')} 
                />
              </Form.Item>
              <Form.Item
                name="isDefault"
                label={t('isDefault')}
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch 
                  checkedChildren={t('yes')} 
                  unCheckedChildren={t('no')} 
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Form.Item
          label={t('description')}
          name="description"
        >
          <Input.TextArea 
            placeholder={t('enterDescription')} 
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateObjectStorageModal; 
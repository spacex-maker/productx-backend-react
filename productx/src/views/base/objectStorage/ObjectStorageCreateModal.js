import React from 'react';
import { Modal, Form, Input, Switch, Typography, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CloudOutlined,
  KeyOutlined,
  GlobalOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const ObjectStorageCreateModal = ({
  isVisible,
  onCancel,
  onFinish,
  form
}) => {
  const { t } = useTranslation();

  const styles = {
    formItem: {
      marginBottom: '8px'
    },
    icon: {
      fontSize: '12px',
      color: '#1890ff',
      marginRight: '4px'
    }
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: '12px' }}>
          <CloudOutlined style={styles.icon} />
          {t('createStorage')}
        </span>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={500}
      maskClosable={false}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Title level={5} style={{ fontSize: '12px', marginBottom: '8px' }}>
          <DatabaseOutlined style={styles.icon} />
          {t('basicInfo')}
        </Title>
        <Divider style={{ margin: '8px 0' }} />

        <Form.Item
          label={t('storageProvider')}
          name="storageProvider"
          rules={[{ required: true, message: t('pleaseEnterStorageProvider') }]}
          style={styles.formItem}
        >
          <Input placeholder={t('enterStorageProvider')} />
        </Form.Item>

        <Form.Item
          label={t('storageType')}
          name="storageType"
          rules={[{ required: true, message: t('pleaseEnterStorageType') }]}
          style={styles.formItem}
        >
          <Input placeholder={t('enterStorageType')} />
        </Form.Item>

        <Title level={5} style={{ fontSize: '12px', marginBottom: '8px' }}>
          <KeyOutlined style={styles.icon} />
          {t('credentials')}
        </Title>
        <Divider style={{ margin: '8px 0' }} />

        <Form.Item
          label={t('accessKey')}
          name="accessKey"
          rules={[{ required: true, message: t('pleaseEnterAccessKey') }]}
          style={styles.formItem}
        >
          <Input placeholder={t('enterAccessKey')} />
        </Form.Item>

        <Form.Item
          label={t('secretKey')}
          name="secretKey"
          rules={[{ required: true, message: t('pleaseEnterSecretKey') }]}
          style={styles.formItem}
        >
          <Input.Password placeholder={t('enterSecretKey')} />
        </Form.Item>

        <Title level={5} style={{ fontSize: '12px', marginBottom: '8px' }}>
          <GlobalOutlined style={styles.icon} />
          {t('configuration')}
        </Title>
        <Divider style={{ margin: '8px 0' }} />

        <Form.Item
          label={t('region')}
          name="region"
          rules={[{ required: true, message: t('pleaseEnterRegion') }]}
          style={styles.formItem}
        >
          <Input placeholder={t('enterRegion')} />
        </Form.Item>

        <Form.Item
          label={t('bucketName')}
          name="bucketName"
          rules={[{ required: true, message: t('pleaseEnterBucketName') }]}
          style={styles.formItem}
        >
          <Input placeholder={t('enterBucketName')} />
        </Form.Item>

        <Form.Item
          label={t('endpoint')}
          name="endpoint"
          rules={[{ required: true, message: t('pleaseEnterEndpoint') }]}
          style={styles.formItem}
        >
          <Input placeholder={t('enterEndpoint')} />
        </Form.Item>

        <Form.Item
          label={t('accountName')}
          name="accountName"
          rules={[{ required: true, message: t('pleaseEnterAccountName') }]}
          style={styles.formItem}
        >
          <Input placeholder={t('enterAccountName')} />
        </Form.Item>

        <Form.Item
          label={t('description')}
          name="description"
          style={styles.formItem}
        >
          <Input.TextArea placeholder={t('enterDescription')} />
        </Form.Item>

        <Form.Item
          label={t('tags')}
          name="tags"
          style={styles.formItem}
        >
          <Input placeholder={t('enterTags')} />
        </Form.Item>

        <Form.Item
          label={t('isActive')}
          name="isActive"
          style={styles.formItem}
        >
          <Switch 
            checkedChildren={t('yes')} 
            unCheckedChildren={t('no')} 
          />
        </Form.Item>

        <Form.Item
          label={t('isDefault')}
          name="isDefault"
          style={styles.formItem}
        >
          <Switch 
            checkedChildren={t('yes')} 
            unCheckedChildren={t('no')} 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ObjectStorageCreateModal; 
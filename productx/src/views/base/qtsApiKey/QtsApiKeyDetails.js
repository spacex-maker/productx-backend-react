import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import moment from 'moment';

const QtsApiKeyDetails = ({ isVisible, onCancel, apiKeyData }) => {
  return (
    <Modal
      title="API密钥详情"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="交易所">{apiKeyData?.exchangeName}</Descriptions.Item>
        <Descriptions.Item label="API密钥标识">{apiKeyData?.apiKeyName}</Descriptions.Item>
        <Descriptions.Item label="API密钥">{apiKeyData?.apiKey}</Descriptions.Item>
        <Descriptions.Item label="API密钥秘钥">******</Descriptions.Item>
        <Descriptions.Item label="备注">{apiKeyData?.remark || '-'}</Descriptions.Item>
        <Descriptions.Item label="权限">
          {apiKeyData?.permissions?.split(',').map(permission => (
            <Tag color="blue" key={permission}>
              {permission}
            </Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="IP白名单">
          {apiKeyData?.ipWhitelist ? (
            apiKeyData.ipWhitelist.split(',').map(ip => (
              <Tag color="green" key={ip}>
                {ip}
              </Tag>
            ))
          ) : (
            '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={apiKeyData?.status ? 'success' : 'error'}>
            {apiKeyData?.status ? '启用' : '禁用'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="最后使用时间">
          {apiKeyData?.lastUsedTime ? moment(apiKeyData.lastUsedTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {moment(apiKeyData?.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {moment(apiKeyData?.updateTime).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default QtsApiKeyDetails; 
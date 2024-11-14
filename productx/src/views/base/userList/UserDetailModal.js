import React from 'react';
import { Modal, Button, Descriptions, Typography, Space } from 'antd';
import { useTranslation } from 'react-i18next'; // 导入 useTranslation
import { formatDate } from 'src/components/common/Common';

const { Text } = Typography;

const UserDetailModal = ({
                           isVisible,
                           onCancel,
                           selectedUser,
                         }) => {

  const { t } = useTranslation(); // 使用 useTranslation 获取 t 函数

  const textStyle = { fontSize: '10px' }; // 统一的文本样式

  return (
    <Modal
      title={<span style={{ fontSize: '10px' }}>{t('detail')}</span>}
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button 
          key="back" 
          onClick={onCancel}
          size="small"
          style={{ 
            fontSize: '8px',
            height: '20px',
            padding: '0 6px'
          }}
        >
          {t('close')}
        </Button>,
      ]}
      width={400}
      bodyStyle={{ padding: '6px' }}
    >
      {selectedUser && (
        <div style={{ fontSize: '8px' }}>
          <Space style={{ marginBottom: '8px' }}>
            <img
              src={selectedUser.avatar}
              alt={`${selectedUser.nickname}的头像`}
              style={{ width: '24px', height: '24px', borderRadius: '25%' }}
            />
            <Text style={{ fontSize: '8px' }}>
              {selectedUser.status ? t('statusActive') : t('statusInactive')}
            </Text>
          </Space>
          
          <Descriptions 
            bordered 
            size="small" 
            column={1} 
            labelStyle={{ fontSize: '8px', padding: '4px 6px' }}
            contentStyle={{ fontSize: '8px', padding: '4px 6px' }}
          >
            <Descriptions.Item label={t('addressInfo')}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <Text style={textStyle}><strong>{t('country')}：</strong> {selectedUser.country}</Text>
                  <Text style={textStyle}><strong>{t('state')}：</strong> {selectedUser.state}</Text>
                  <Text style={textStyle}><strong>{t('city')}：</strong> {selectedUser.city}</Text>
                </Space>
                <Text style={textStyle}><strong>{t('defaultAddress')}：</strong> {selectedUser.address}</Text>
                <Text style={textStyle}><strong>{t('postalCode')}：</strong> {selectedUser.postalCode}</Text>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label={t('financialInfo')}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text style={textStyle}><strong>{t('balance')}：</strong> {selectedUser.balance}</Text>
                <Text style={textStyle}><strong>{t('usdtAddress')}：</strong> {selectedUser.usdtAddress}</Text>
                <Text style={textStyle}><strong>{t('usdtAmount')}：</strong> {selectedUser.usdtAmount}</Text>
                <Text style={textStyle}><strong>{t('usdtFrozenAmount')}：</strong> {selectedUser.usdtFrozenAmount}</Text>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label={t('otherInfo')}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text style={textStyle}><strong>{t('creditScore')}：</strong> {selectedUser.creditScore}</Text>
                <Text style={textStyle}><strong>{t('registrationTime')}：</strong> {formatDate(selectedUser.createTime)}</Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );
};

export default UserDetailModal;

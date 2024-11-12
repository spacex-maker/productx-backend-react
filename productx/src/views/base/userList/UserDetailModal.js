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
      title={t('detail')} // 使用 t 函数进行翻译
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          {t('close')} {/* 使用 t 函数进行翻译 */}
        </Button>,
      ]}
      width={500} // 调整宽度以适应内容
      style={{ zIndex: 1050 }} // 设置较高的 z-index
    >
      {selectedUser && (
        <div>
          <Space style={{ marginBottom: 20, width: '100%', justifyContent: 'space-between' }}>
            <Space style={{ width: 30 }}>
              <img
                src={selectedUser.avatar}
                alt={`${selectedUser.nickname}的头像`}
                style={{ width: '50px', height: '50px', borderRadius: '25%' }}
              />
              <Space direction="vertical" style={{ width: '100px' }}>
                <Text type={selectedUser.status ? 'success' : 'danger'}>
                  {selectedUser.status ? t('statusActive') : t('statusInactive')}
                </Text>
              </Space>
            </Space>
            <br />
            <Space direction="vertical" style={{ width: 300 }}>
              <Space direction="vertical">
                <Space>
                  <Text style={textStyle}><strong>{t('username')}：</strong>{selectedUser.username}</Text>
                  <Text style={textStyle}><strong>{t('nickname')}：</strong> {selectedUser.nickname}</Text>
                  <Text style={textStyle}><strong>{t('fullName')}：</strong> {selectedUser.fullName}</Text>
                </Space>
                <Text style={textStyle}><strong>{t('phoneNumber')}：</strong> {selectedUser.phoneNumber}</Text>
              </Space>
            </Space>
          </Space>

          <Descriptions bordered size="small" column={1} style={{ fontSize: '14px' }}>
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

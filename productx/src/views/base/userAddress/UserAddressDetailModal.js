import React from 'react';
import { Modal, Typography, Space, Row, Col, Card, Watermark, message, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import { formatDate } from 'src/components/common/Common';
import {
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  HomeOutlined,
  GlobalOutlined,
  AimOutlined,
  ClockCircleOutlined,
  NumberOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Text } = Typography;

const UserAddressDetailModal = ({ isVisible, onCancel, selectedAddress }) => {
  const { t } = useTranslation();

  const currentUser = useSelector((state) => state.user?.currentUser || {});
  const watermarkContent = `ID: ${currentUser?.id || ''} ${currentUser?.username || ''}`;

  const IconText = ({ icon, text }) => (
    <Space size={4}>
      {icon}
      <Typography.Text>{text}</Typography.Text>
    </Space>
  );

  const handleCopy = (text) => {
    if (!text) {
      message.error(t('copyFailed'));
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      message.success(t('copySuccess'));
    }).catch(() => {
      message.error(t('copyFailed'));
    });
  };

  return (
    <Modal
      title={
        <Space>
          <HomeOutlined />
          {t('addressDetails')}
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={700}
      maskClosable={false}
    >
      {selectedAddress && (
        <Watermark content={watermarkContent}>
          <Space direction="vertical" size={8}>
            {/* 基本信息卡片 */}
            <Card 
              size="small" 
              title={
                <Space>
                  <UserOutlined />
                  {t('basicInfo')}
                </Space>
              }
            >
              <Descriptions size="small" column={2}>
                <Descriptions.Item label={t('contactName')}>
                  <IconText icon={<UserOutlined />} text={selectedAddress.contactName} />
                </Descriptions.Item>
                <Descriptions.Item label={t('phoneNum')}>
                  <IconText icon={<PhoneOutlined />} text={selectedAddress.phoneNum} />
                </Descriptions.Item>
                <Descriptions.Item label={t('userId')} span={2}>
                  <IconText icon={<NumberOutlined />} text={selectedAddress.userId} />
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 地址信息卡片 */}
            <Card 
              size="small" 
              title={
                <Space>
                  <EnvironmentOutlined />
                  {t('addressInfo')}
                </Space>
              }
            >
              <Descriptions size="small" column={2}>
                <Descriptions.Item label={t('province')}>
                  <IconText icon={<GlobalOutlined />} text={selectedAddress.province || '-'} />
                </Descriptions.Item>
                <Descriptions.Item label={t('city')}>
                  <IconText icon={<AimOutlined />} text={selectedAddress.city || '-'} />
                </Descriptions.Item>
                <Descriptions.Item label={t('contactAddress')} span={2}>
                  <Space>
                    <IconText 
                      icon={<HomeOutlined />} 
                      text={selectedAddress.contactAddress} 
                    />
                    <CopyOutlined onClick={() => handleCopy(selectedAddress.contactAddress)} />
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 其他信息卡片 */}
            <Card 
              size="small" 
              title={
                <Space>
                  <ClockCircleOutlined />
                  {t('otherInfo')}
                </Space>
              }
            >
              <Descriptions size="small" column={2}>
                <Descriptions.Item label={t('createTime')}>
                  <IconText icon={<ClockCircleOutlined />} text={formatDate(selectedAddress.createTime)} />
                </Descriptions.Item>
                <Descriptions.Item label={t('updateTime')}>
                  <IconText icon={<ClockCircleOutlined />} text={formatDate(selectedAddress.updateTime)} />
                </Descriptions.Item>
                <Descriptions.Item label={t('useCount')}>
                  <IconText icon={<NumberOutlined />} text={selectedAddress.useCount} />
                </Descriptions.Item>
                <Descriptions.Item label={t('isDefault')}>
                  <IconText icon={<HomeOutlined />} text={selectedAddress.currentUse ? t('yes') : t('no')} />
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        </Watermark>
      )}
    </Modal>
  );
};

export default UserAddressDetailModal;

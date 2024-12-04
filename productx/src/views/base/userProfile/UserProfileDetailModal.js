import React from 'react';
import { Modal, Descriptions, Tag, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { UserOutlined, EnvironmentOutlined, ShoppingCartOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';

const UserProfileDetailModal = ({ isVisible, onCancel, selectedProfile }) => {
  const { t } = useTranslation();

  const formatArrayString = (str) => {
    try {
      return JSON.parse(str).join(', ');
    } catch {
      return str;
    }
  };

  const formatArrayToTags = (str, color = '') => {
    try {
      const items = JSON.parse(str);
      return (
        <Space size={[0, 4]} wrap>
          {items.map((item, index) => (
            <Tag color={color} key={index}>
              {item}
            </Tag>
          ))}
        </Space>
      );
    } catch {
      return str;
    }
  };

  return (
    <Modal
      title={t('userProfileDetail')}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      {selectedProfile && (
        <Descriptions bordered column={3} size="small">
          <Descriptions.Item label={<><UserOutlined /> {t('userId')}</>}>
            {selectedProfile.userId}
          </Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined /> {t('name')}</>}>
            {selectedProfile.name}
          </Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined /> {t('age')}</>}>
            {selectedProfile.age}
          </Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined /> {t('gender')}</>}>
            <Tag color={selectedProfile.gender === 'male' ? 'blue' : selectedProfile.gender === 'female' ? 'pink' : 'default'}>
              {t(selectedProfile.gender)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={<><EnvironmentOutlined /> {t('location')}</>}>
            {selectedProfile.location}
          </Descriptions.Item>
          <Descriptions.Item label={<><ShoppingCartOutlined /> {t('totalOrders')}</>}>
            {selectedProfile.totalOrders}
          </Descriptions.Item>
          <Descriptions.Item label={<><ShoppingCartOutlined /> {t('avgOrderValue')}</>}>
            {selectedProfile.avgOrderValue}
          </Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined /> {t('followersCount')}</>}>
            {selectedProfile.followersCount}
          </Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined /> {t('followingCount')}</>}>
            {selectedProfile.followingCount}
          </Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined /> {t('registrationDate')}</>} span={1.5}>
            {selectedProfile.registrationDate}
          </Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined /> {t('lastLogin')}</>} span={1.5}>
            {selectedProfile.lastLogin}
          </Descriptions.Item>
          <Descriptions.Item label={<><ShoppingCartOutlined /> {t('preferredPriceRange')}</>} span={1.5}>
            {selectedProfile.preferredPriceRange}
          </Descriptions.Item>
          <Descriptions.Item label={<><ShoppingCartOutlined /> {t('preferredCategories')}</>} span={3}>
            {formatArrayToTags(selectedProfile.preferredCategories, 'purple')}
          </Descriptions.Item>
          <Descriptions.Item label={<><ShoppingCartOutlined /> {t('preferredBrands')}</>} span={3}>
            {formatArrayToTags(selectedProfile.preferredBrands, 'blue')}
          </Descriptions.Item>
          <Descriptions.Item label={<><ShoppingCartOutlined /> {t('recentSearchKeywords')}</>} span={3}>
            {formatArrayToTags(selectedProfile.recentSearchKeywords, 'green')}
          </Descriptions.Item>
          <Descriptions.Item label={<><HeartOutlined /> {t('likedProducts')}</>} span={3}>
            {formatArrayString(selectedProfile.likedProducts)}
          </Descriptions.Item>
          <Descriptions.Item label={<><ShareAltOutlined /> {t('sharedProducts')}</>} span={3}>
            {formatArrayString(selectedProfile.sharedProducts)}
          </Descriptions.Item>
        </Descriptions>
      )}
      
      <style jsx>{`
        :global(.ant-descriptions) {
          margin-bottom: 0;
        }
        :global(.ant-descriptions-item-label) {
          width: 120px;
          font-size: 10px;
          padding: 6px 10px !important;
        }
        :global(.ant-descriptions-item-content) {
          font-size: 10px;
          padding: 6px 10px !important;
        }
        :global(.ant-tag) {
          margin: 0 4px 4px 0;
          font-size: 10px;
        }
        :global(.ant-space) {
          width: 100%;
        }
      `}</style>
    </Modal>
  );
};

export default UserProfileDetailModal;

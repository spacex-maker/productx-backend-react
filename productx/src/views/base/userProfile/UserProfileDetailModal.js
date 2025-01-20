import React from 'react';
import { Modal, Descriptions, Tag, Space, Typography, Row, Col, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  EnvironmentOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  TeamOutlined,
  FieldTimeOutlined,
  TagOutlined,
  SearchOutlined
} from '@ant-design/icons';

const { Title } = Typography;

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
        <Space size={[0, 8]} wrap>
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

  if (!selectedProfile) return null;

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          {t('userProfileDetail')} - {selectedProfile.name}
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card  title={t('basicInfo')}>
            <Descriptions column={3} >
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
              <Descriptions.Item label={<><FieldTimeOutlined /> {t('registrationDate')}</>}>
                {selectedProfile.registrationDate}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card  title={t('activityInfo')}>
            <Descriptions column={3} >
              <Descriptions.Item label={<><ShoppingCartOutlined /> {t('totalOrders')}</>}>
                {selectedProfile.totalOrders}
              </Descriptions.Item>
              <Descriptions.Item label={<><ShoppingCartOutlined /> {t('avgOrderValue')}</>}>
                {selectedProfile.avgOrderValue}
              </Descriptions.Item>
              <Descriptions.Item label={<><FieldTimeOutlined /> {t('lastLogin')}</>}>
                {selectedProfile.lastLogin}
              </Descriptions.Item>
              <Descriptions.Item label={<><TeamOutlined /> {t('followersCount')}</>}>
                {selectedProfile.followersCount}
              </Descriptions.Item>
              <Descriptions.Item label={<><TeamOutlined /> {t('followingCount')}</>}>
                {selectedProfile.followingCount}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card  title={t('preferences')}>
            <Descriptions column={1} >
              <Descriptions.Item label={<><TagOutlined /> {t('preferredPriceRange')}</>}>
                {selectedProfile.preferredPriceRange}
              </Descriptions.Item>
              <Descriptions.Item label={<><TagOutlined /> {t('preferredCategories')}</>}>
                {formatArrayToTags(selectedProfile.preferredCategories, 'purple')}
              </Descriptions.Item>
              <Descriptions.Item label={<><TagOutlined /> {t('preferredBrands')}</>}>
                {formatArrayToTags(selectedProfile.preferredBrands, 'blue')}
              </Descriptions.Item>
              <Descriptions.Item label={<><SearchOutlined /> {t('recentSearchKeywords')}</>}>
                {formatArrayToTags(selectedProfile.recentSearchKeywords, 'green')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card  title={t('interactions')}>
            <Descriptions column={1} >
              <Descriptions.Item label={<><HeartOutlined /> {t('likedProducts')}</>}>
                {formatArrayString(selectedProfile.likedProducts)}
              </Descriptions.Item>
              <Descriptions.Item label={<><ShareAltOutlined /> {t('sharedProducts')}</>}>
                {formatArrayString(selectedProfile.sharedProducts)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default UserProfileDetailModal;

import React from 'react';
import { Button, Space, Tooltip, Tag, Spin, Switch } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const WebsiteListTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleStatusChange,
  handleEditClick,
  handleViewClick,
  countries,
  loadingStatus,
}) => {
  const { t } = useTranslation();

  const getCountryInfo = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    if (!country) return { name: countryCode, flagImageUrl: '' };
    return country;
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
          </th>
          <th>{t('websiteName')}</th>
          <th>{t('websiteLink')}</th>
          <th>{t('classification')}</th>
          <th>{t('subClassification')}</th>
          <th>{t('countryRegion')}</th>
          <th>{t('status')}</th>
          <th>{t('characteristics')}</th>
          <th>{t('statisticalData')}</th>
          <th>{t('createTime')}</th>
          <th>{t('operation')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>
              <input
                type="checkbox"
                checked={selectedRows.includes(item.id)}
                onChange={() => handleSelectRow(item.id)}
              />
            </td>
            <td>
              <Space>
                {item.logoUrl && (
                  <img
                    src={item.logoUrl}
                    alt={item.name}
                    style={{ 
                      width: 32,
                      height: 32,
                      objectFit: 'contain',
                      padding: 3,
                      backgroundColor: '#fff',
                      borderRadius: 4
                    }}
                  />
                )}
                {item.name}
              </Space>
            </td>
            <td>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.url}
              </a>
            </td>
            <td>{item.category}</td>
            <td>{item.subCategory}</td>
            <td>
              {item.countryCode && (
                <Space>
                  <img
                    src={getCountryInfo(item.countryCode).flagImageUrl}
                    alt={item.countryCode}
                    style={{ width: 20, height: 15, borderRadius: 0 }}
                  />
                  {getCountryInfo(item.countryCode).name}
                </Space>
              )}
            </td>
            <td>
              <Switch
                checked={item.status}
                onChange={(checked) => handleStatusChange(item.id, checked)}
                loading={loadingStatus[item.id]}
              />
            </td>
            <td>
              <Space wrap>
                {item.isFeatured && <Tag color="blue">{t('recommended')}</Tag>}
                {item.isPopular && <Tag color="blue">{t('popular')}</Tag>}
                {item.isNew && <Tag color="blue">{t('newOnline')}</Tag>}
                {item.isVerified && <Tag color="blue">{t('verified')}</Tag>}
              </Space>
            </td>
            <td>
              <Space wrap>
                <Tag>{t('pageViews')}: {item.views || 0}</Tag>
                <Tag>{t('numberOfLikes')}: {item.likes || 0}</Tag>
              </Space>
            </td>
            <td>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</td>
            <td>
              <Space>
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => handleViewClick(item)}
                >
                  {t('details')}
                </Button>
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(item)}
                >
                  {t('edit')}
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WebsiteListTable;


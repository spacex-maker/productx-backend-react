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
    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="select_all"
                  checked={selectAll}
                  onChange={(event) => handleSelectAll(event, data)}
                />
                <label className="custom-control-label" htmlFor="select_all"></label>
              </div>
            </th>
            <th style={{ width: '150px' }}>{t('websiteName')}</th>
            <th style={{ width: '200px' }}>{t('websiteLink')}</th>
            <th style={{ width: '120px' }}>{t('classification')}</th>
            <th style={{ width: '120px' }}>{t('subClassification')}</th>
            <th style={{ width: '150px' }}>{t('countryRegion')}</th>
            <th style={{ width: '80px' }}>{t('status')}</th>
            <th style={{ width: '200px' }}>{t('characteristics')}</th>
            <th style={{ width: '200px' }}>{t('statisticalData')}</th>
            <th style={{ width: '150px' }}>{t('createTime')}</th>
            <th style={{ width: '120px' }}>{t('operation')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`td_checkbox_${item.id}`}
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleSelectRow(item.id, data)}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={`td_checkbox_${item.id}`}
                  ></label>
                </div>
              </td>
              <td>
                <Space>
                  {item.logoUrl && (
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      style={{
                        width: 24,
                        height: 24,
                        objectFit: 'contain',
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
                      style={{
                        width: 16,
                        height: 12,
                        objectFit: 'cover',
                        borderRadius: 2
                      }}
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
                <Space size={4}>
                  {item.isFeatured && <Tag color="blue">{t('recommended')}</Tag>}
                  {item.isPopular && <Tag color="blue">{t('popular')}</Tag>}
                  {item.isNew && <Tag color="blue">{t('newOnline')}</Tag>}
                  {item.isVerified && <Tag color="blue">{t('verified')}</Tag>}
                </Space>
              </td>
              <td>
                <Space size={4}>
                  <Tag>{t('pageViews')}: {item.views || 0}</Tag>
                  <Tag>{t('numberOfLikes')}: {item.likes || 0}</Tag>
                </Space>
              </td>
              <td>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</td>
              <td>
                <Space size={8}>
                  <Button
                    type="link"

                    icon={<EyeOutlined />}
                    onClick={() => handleViewClick(item)}
                  >
                    {t('details')}
                  </Button>
                  <Button
                    type="link"

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
    </div>
  );
};

export default WebsiteListTable;


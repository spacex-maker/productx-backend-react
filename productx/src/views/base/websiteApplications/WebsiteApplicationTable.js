import React from 'react';
import { Button, Space, Tooltip, Tag } from 'antd';
import { EyeOutlined, EditOutlined, AuditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const WebsiteApplicationTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleViewClick,
  handleReviewClick,
  countries,
}) => {
  const { t } = useTranslation();

  const getCountryInfo = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    if (!country) return { name: countryCode, flagImageUrl: '' };
    return country;
  };

  const countryDisplay = (countryCode) => (
    <Space>
      <img
        src={getCountryInfo(countryCode).flagImageUrl}
        alt={countryCode}
        style={{
          width: 20,
          height: 15,
          objectFit: 'cover',
          borderRadius: 2,
          border: '1px solid #f0f0f0',
          verticalAlign: 'middle'
        }}
      />
      <span>{getCountryInfo(countryCode).name}</span>
      <span style={{ color: '#999' }}>({countryCode})</span>
    </Space>
  );

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'warning', text: t('pending') },
      approved: { color: 'success', text: t('approved') },
      rejected: { color: 'error', text: t('rejected') }
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>
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
          {[
            t('websiteName'),
            t('websiteUrl'),
            t('contactEmail'),
            t('contactPhone'),
            t('country'),
            t('status'),
            t('createTime'),
            t('actions')
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font">
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.id}`}
                ></label>
              </div>
            </td>
            <td className="text-truncate">{item.websiteName}</td>
            <td className="text-truncate">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.url}
              </a>
            </td>
            <td className="text-truncate">{item.contactEmail}</td>
            <td className="text-truncate">{item.contactPhone}</td>
            <td className="text-truncate">
              {item.countryCode && countryDisplay(item.countryCode)}
            </td>
            <td>{getStatusTag(item.status)}</td>
            <td>{item.createTime}</td>
            <td>
              <Space  >
                <Tooltip title={t('detail')}>
                  <Button
                    type="link"

                    className="p-0 m-0 d-inline-flex align-items-center"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewClick(item)}
                  >
                    {t('detail')}
                  </Button>
                </Tooltip>
                <Tooltip title={t('edit')}>
                  <Button
                    type="link"

                    className="p-0 m-0 d-inline-flex align-items-center"
                    icon={<EditOutlined />}
                    onClick={() => handleEditClick(item)}
                  >
                    {t('edit')}
                  </Button>
                </Tooltip>
                {item.status === 'pending' && (
                  <Tooltip title={t('review')}>
                    <Button
                      type="link"

                      className="p-0 m-0 d-inline-flex align-items-center"
                      icon={<AuditOutlined />}
                      onClick={() => handleReviewClick(item)}
                    >
                      {t('review')}
                    </Button>
                  </Tooltip>
                )}
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WebsiteApplicationTable;

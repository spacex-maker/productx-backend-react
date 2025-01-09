import React from 'react';
import { Button, Space, Tooltip, Tag, Spin } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const BankTable = ({
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
            t('country'),
            t('bankName'),
            t('swiftCode'),
            t('systemSupport'),
            t('status'),
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
            <td className="text-truncate">
              <Space>
                {item.countryCode && (
                  <img 
                    src={getCountryInfo(item.countryCode).flagImageUrl} 
                    alt={item.countryCode}
                    style={{ 
                      width: 20, 
                      height: 15, 
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: '1px solid #f0f0f0',
                      verticalAlign: 'middle'
                    }}
                  />
                )}
                <span>{getCountryInfo(item.countryCode).name}</span>
              </Space>
            </td>
            <td className="text-truncate">{item.bankName}</td>
            <td className="text-truncate">{item.swiftCode}</td>
            <td>
              <Tag color={item.supported ? 'success' : 'default'}>
                {item.supported ? t('supported') : t('unsupported')}
              </Tag>
            </td>
            <td>
              <Spin spinning={loadingStatus === item.id} size="small">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={item.status}
                    onChange={(e) => handleStatusChange(item.id, e)}
                  />
                  <span className="toggle-switch-slider"></span>
                </label>
              </Spin>
            </td>
            <td>
              <Space size="small">
                <Tooltip title={t('detail')}>
                  <Button 
                    type="link" 
                    size="small"
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
                    size="small"
                    className="p-0 m-0 d-inline-flex align-items-center"
                    icon={<EditOutlined />} 
                    onClick={() => handleEditClick(item)}
                  >
                    {t('edit')}
                  </Button>
                </Tooltip>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BankTable;

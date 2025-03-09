import React from 'react';
import { Button, Tag, Space } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const MsxCloudProvidersTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleRegionsClick,
  t,
  countries
}) => {
  const getStatusTag = (status) => {
    const statusMap = {
      'ACTIVE': { color: 'success', text: t('active') },
      'INACTIVE': { color: 'warning', text: t('inactive') },
      'DISCONTINUED': { color: 'error', text: t('discontinued') }
    };
    const { color, text } = statusMap[status] || { color: 'default', text: status };
    return <Tag color={color}>{text}</Tag>;
  };

  const getCountryInfo = (countryCode) => {
    const country = countries?.find(c => c.code === countryCode);
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
            t('providerName'),
            t('country'),
            t('serviceType'),
            t('status'),
            t('website'),
            t('createTime'),
            t('updateTime'),
            t('operations')
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
            <td className="text-truncate">{item.providerName}</td>
            <td className="text-truncate">
              {item.countryCode && (
                <Space>
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
                  <span>{getCountryInfo(item.countryCode).name}</span>
                </Space>
              )}
            </td>
            <td className="text-truncate">{item.serviceType}</td>
            <td className="text-truncate">{getStatusTag(item.status)}</td>
            <td className="text-truncate">
              <a href={item.website} target="_blank" rel="noopener noreferrer">
                {item.website}
              </a>
            </td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="text-truncate">{item.updateTime}</td>
            <td className="fixed-column">
              <Space>
                <Button type="link" onClick={() => handleEditClick(item)}>
                  {t('edit')}
                </Button>
                <Button 
                  type="link" 
                  onClick={() => handleRegionsClick(item)}
                  icon={<EnvironmentOutlined />}
                >
                  {t('regions')}
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

MsxCloudProvidersTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  handleRegionsClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  countries: PropTypes.array.isRequired
};

export default MsxCloudProvidersTable;

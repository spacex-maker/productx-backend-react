import React from 'react';
import { Button, Space, Tag } from 'antd';
import PropTypes from 'prop-types';

const MsxCloudProviderRegionsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  countries,
  providers,
  t,
}) => {
  const getCountryInfo = (countryCode) => {
    const country = countries.find((c) => c.code === countryCode);
    if (!country) return { name: countryCode, flagImageUrl: '' };
    return country;
  };

  const getProviderInfo = (providerId) => {
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return { providerName: `ID: ${providerId}`, iconImg: '' };
    return provider;
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
            t('providerAndCountry'),
            t('regionCode'),
            t('regionName'),
            t('status'),
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
            <td className="text-truncate">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '12px', color: '#999' }}>ID: {item.id}</div>
                <Space>
                  {getProviderInfo(item.providerId).iconImg && (
                    <img
                      src={getProviderInfo(item.providerId).iconImg}
                      alt={getProviderInfo(item.providerId).providerName}
                      style={{
                        width: 20,
                        height: 20,
                        objectFit: 'contain',
                        verticalAlign: 'middle'
                      }}
                    />
                  )}
                  <span>{getProviderInfo(item.providerId).providerName}</span>
                </Space>
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
              </div>
            </td>
            <td className="text-truncate">{item.regionCode}</td>
            <td className="text-truncate">{item.regionName}</td>
            <td className="text-truncate">
              {item.status === 'ACTIVE' ? (
                <Tag color="success">{t('active')}</Tag>
              ) : (
                <Tag color="warning">{t('inactive')}</Tag>
              )}
            </td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="text-truncate">{item.updateTime}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                {t('edit')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

MsxCloudProviderRegionsTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  countries: PropTypes.array.isRequired,
  providers: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default MsxCloudProviderRegionsTable;

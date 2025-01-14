import React from 'react';
import { Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const ExpressTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleStatusChange,
  handleEditClick,
  handleDetailClick,
  countries,
  loadingStatus,
}) => {
  const { t } = useTranslation();

  const getCountryInfo = (countryCode) => {
    return countries.find(country => country.code === countryCode);
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
        <th>ID</th>
        <th>{t('country')}</th>
        <th>{t('companyName')}</th>
        <th>{t('trackingNumberFormat')}</th>
        <th>{t('website')}</th>
        <th>{t('contactNumber')}</th>
        <th>{t('status')}</th>
        <th className="fixed-column">{t('actions')}</th>
      </tr>
      </thead>
      <tbody>
      {data.map((item) => {
        const countryInfo = getCountryInfo(item.countryCode);
        
        return (
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
            <td className="text-truncate">{item.id}</td>
            <td className="text-truncate">
              <Space>
                {countryInfo && (
                  <img 
                    src={countryInfo.flagImageUrl} 
                    alt={countryInfo.name}
                    style={{ 
                      width: 20, 
                      height: 15, 
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: '1px solid #f0f0f0'
                    }}
                  />
                )}
                <span>{countryInfo ? countryInfo.name : item.countryCode}</span>
              </Space>
            </td>
            <td className="text-truncate">{item.name}</td>
            <td className="text-truncate">{item.trackingNumberFormat}</td>
            <td className="text-truncate">
              <a href={item.website} target="_blank" rel="noopener noreferrer">
                {item.website}
              </a>
            </td>
            <td className="text-truncate">{item.contactNumber}</td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={(e) => handleStatusChange(item.id, e)}
                  disabled={loadingStatus === item.id}
                />
                <span className="toggle-switch-slider"></span>
              </label>
            </td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                {t('edit')}
              </Button>
              {handleDetailClick && (
                <Button type="link" onClick={() => handleDetailClick(item)}>
                  {t('details')}
                </Button>
              )}
            </td>
          </tr>
        );
      })}
      </tbody>
    </table>
  );
};

export default ExpressTable;

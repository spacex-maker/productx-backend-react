import React from 'react';
import { Button, Space } from 'antd';

const UserProductHotSearchTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  t,
  countries = []
}) => {
  // 获取国家名称和图标的辅助函数
  const getCountryInfo = (countryCode) => {
    if (!countries || !countryCode) {
      return { name: countryCode || '', flagImageUrl: '' };
    }
    const country = countries.find(c => c.code === countryCode);
    return country || { name: countryCode, flagImageUrl: '' };
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
          <th>{t('searchTerm')}</th>
          <th>{t('totalSearchCount')}</th>
          <th>{t('mobileSearchCount')}</th>
          <th>{t('desktopSearchCount')}</th>
          <th>{t('tabletSearchCount')}</th>
          <th>{t('lastSearchedAt')}</th>
          <th>{t('countryCode')}</th>
          <th>{t('language')}</th>
          <th>{t('categoryId')}</th>
          <th>{t('operations')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          const country = getCountryInfo(item.countryCode);
          return (
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
              <td>{item.searchTerm}</td>
              <td>{item.totalSearchCount}</td>
              <td>{item.mobileSearchCount}</td>
              <td>{item.desktopSearchCount}</td>
              <td>{item.tabletSearchCount}</td>
              <td>{item.lastSearchedAt}</td>
              <td>
                <Space>
                  {country.flagImageUrl && (
                    <img 
                      src={country.flagImageUrl} 
                      alt={country.name}
                      style={{ 
                        width: 20, 
                        height: 15, 
                        objectFit: 'cover',
                        borderRadius: 2,
                        border: '1px solid #f0f0f0'
                      }}
                    />
                  )}
                  <span>{country.name || item.countryCode}</span>
                  {country.name && <span style={{ color: '#999' }}>({item.countryCode})</span>}
                </Space>
              </td>
              <td>{item.language}</td>
              <td>{item.categoryId}</td>
              <td>
                <Button type="link" onClick={() => handleEditClick(item)}>
                  {t('edit')}
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UserProductHotSearchTable;

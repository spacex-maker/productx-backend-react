import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import CountryDetailModal from './CountryDetailModal';
import { useTranslation } from 'react-i18next';

const CountryTable = ({
                        allData,
                        data,
                        selectAll,
                        selectedRows,
                        handleSelectAll,
                        handleSelectRow,
                        handleStatusChange,
                        handleEditClick,
                      }) => {
  const { t } = useTranslation();
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const showDetail = (country) => {
    setSelectedCountry(country);
    setDetailVisible(true);
  };

  const tableColumns = [
    { key: 'name', label: t('countryName') },
    { key: 'code', label: t('countryCode') },
    { key: 'continent', label: t('continent') },
    { key: 'capital', label: t('capital') },
    { key: 'population', label: t('population'), 
      render: (val) => val ? `${(val / 10000).toFixed(2)}万` : '-' 
    },
    { key: 'area', label: t('area'),
      render: (val) => val ? `${val.toLocaleString()} km²` : '-'
    },
    { key: 'gdp', label: t('gdp'),
      render: (val) => val ? `$${(val/100000000).toFixed(2)}亿` : '-'
    },
    { key: 'officialLanguages', label: t('officialLanguages') },
    { key: 'currency', label: t('currency') },
    { key: 'status', label: t('status') },
    { key: 'actions', label: t('actions') },
  ];

  return (
    <>
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
            {tableColumns.map((column) => (
              <th key={column.key}>{column.label}</th>
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
              <td className="text-truncate">{item.name}</td>
              <td className="text-truncate">{item.code}</td>
              <td className="text-truncate">{item.continent}</td>
              <td className="text-truncate">{item.capital}</td>
              <td className="text-truncate">{item.population ? `${(item.population / 10000).toFixed(2)}万` : '-'}</td>
              <td className="text-truncate">{item.area ? `${item.area.toLocaleString()} km²` : '-'}</td>
              <td className="text-truncate">{item.gdp ? `$${(item.gdp / 100000000).toFixed(2)}亿` : '-'}</td>
              <td className="text-truncate">{item.officialLanguages}</td>
              <td className="text-truncate">{item.currency}</td>
              <td>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={item.status}
                    onChange={(e) => handleStatusChange(item.id, e)}
                  />
                  <span className="toggle-switch-slider"></span>
                </label>
              </td>
              <td>
                <Space size="small">
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => showDetail(item)}
                  >
                    {t('detail')}
                  </Button>
                  <Button
                    type="link"
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

      <CountryDetailModal
        visible={detailVisible}
        country={selectedCountry}
        onCancel={() => setDetailVisible(false)}
      />
    </>
  );
};

export default CountryTable;

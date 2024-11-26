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
    { 
      key: 'checkbox',
      width: '30px',
      align: 'center',
      render: (_, item) => (
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            checked={selectedRows.includes(item.id)}
            onChange={() => handleSelectRow(item.id, data)}
          />
          <label className="custom-control-label" htmlFor={`td_checkbox_${item.id}`}></label>
        </div>
      )
    },
    { 
      key: 'flagImageUrl', 
      label: t('flag'),
      width: '40px',
      align: 'center',
      render: (url) => url ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '2px 0'
        }}>
          <img 
            src={url} 
            alt="flag"
            style={{
              width: '24px',
              height: '16px',
              objectFit: 'cover',
              border: '1px solid #eee',
              borderRadius: '2px'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-flag.png';
            }}
          />
        </div>
      ) : '-'
    },
    { key: 'name', label: t('countryName'), align: 'left', width: '120px' },
    { key: 'code', label: t('countryCode'), align: 'left', width: '80px' },
    { key: 'continent', label: t('continent'), align: 'left', width: '100px' },
    { key: 'capital', label: t('capital'), align: 'left', width: '100px' },
    { 
      key: 'population', 
      label: t('population'), 
      align: 'right',
      width: '100px',
      render: (val) => val ? `${(val / 10000).toFixed(2)}万` : '-' 
    },
    { 
      key: 'area', 
      label: t('area'),
      align: 'right',
      width: '120px',
      render: (val) => val ? `${val.toLocaleString()} km²` : '-'
    },
    { 
      key: 'gdp', 
      label: t('gdp'),
      align: 'right',
      width: '120px',
      render: (val) => val ? `$${(val/100000000).toFixed(2)}亿` : '-'
    },
    { key: 'officialLanguages', label: t('officialLanguages'), align: 'left', width: '120px' },
    { key: 'currency', label: t('currency'), align: 'left', width: '100px' },
    { 
      key: 'status', 
      label: t('status'), 
      align: 'center',
      width: '80px',
      render: (status, item) => (
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => handleStatusChange(item.id, e)}
          />
          <span className="toggle-switch-slider"></span>
        </label>
      )
    },
    { 
      key: 'actions', 
      label: t('actions'), 
      align: 'center',
      width: '180px',
      render: (_, item) => (
        <Space size={4}>
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDetail(item)}
            style={{ 
              padding: '2px 4px',
              height: '24px',
              lineHeight: '20px'
            }}
          >
            {t('detail')}
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(item)}
            style={{ 
              padding: '2px 4px',
              height: '24px',
              lineHeight: '20px'
            }}
          >
            {t('edit')}
          </Button>
        </Space>
      )
    }
  ];

  return (
    <>
      <div style={{ width: '100%', overflow: 'auto' }}>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              {tableColumns.slice(0, -1).map((column) => (
                <th 
                  key={column.key} 
                  style={{ 
                    width: column.width,
                    textAlign: column.align,
                    padding: '8px'
                  }}
                >
                  {column.label}
                </th>
              ))}
              <th 
                style={{ 
                  width: '140px',
                  textAlign: 'center',
                  padding: '8px',
                  position: 'sticky',
                  right: 0,
                }}
              >
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {tableColumns.slice(0, -1).map((column) => (
                  <td 
                    key={`${item.id}-${column.key}`}
                    style={{ 
                      width: column.width,
                      textAlign: column.align,
                      padding: '4px 8px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
                <td 
                  style={{ 
                    width: '140px',
                    textAlign: 'center',
                    padding: '4px 8px',
                    position: 'sticky',
                    right: 0,
                  }}
                >
                  {tableColumns[tableColumns.length - 1].render(null, item)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <style jsx global>{`
          .table {
            width: 100%;
            table-layout: fixed;
          }
          .table td {
            vertical-align: middle;
          }
        `}</style>
      </div>

      <CountryDetailModal
        visible={detailVisible}
        country={selectedCountry}
        onCancel={() => setDetailVisible(false)}
      />
    </>
  );
};

export default CountryTable;

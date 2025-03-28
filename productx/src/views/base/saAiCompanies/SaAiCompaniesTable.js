import React from 'react';
import { Button, Avatar, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const SaAiCompaniesTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleEnableStatusChange,
}) => {
  const { t } = useTranslation();

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
          <th>{t('companyInfo')}</th>
          <th>{t('headquarters')}</th>
          <th>{t('defaultModel')}</th>
          <th>{t('foundedYear')}</th>
          <th>{t('enableStatus')}</th>
          <th>{t('operation')}</th>
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
            <td>
              <Space align="center" size={12}>
                <Avatar 
                  src={item.logoPath} 
                  shape="square" 
                  size={40}
                  style={{ 
                    backgroundColor: '#f0f2f5',
                    verticalAlign: 'middle' 
                  }}
                />
                <div>
                  <div style={{ fontWeight: 500 }}>{item.companyName}</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>{item.companyCode}</div>
                </div>
              </Space>
            </td>
            <td>{item.headquarters}</td>
            <td>{item.defaultModel}</td>
            <td>{item.foundedYear}</td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={(e) => handleEnableStatusChange(item.id, e)}
                />
                <span className="toggle-switch-slider"></span>
              </label>
            </td>
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

export default SaAiCompaniesTable;

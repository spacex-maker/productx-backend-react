import React from 'react';
import { Button, Image } from 'antd';
import { useTranslation } from 'react-i18next';

const PartnersTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleStatusChange,
  handleEditClick,
  handleDetailClick,
}) => {
  const { t } = useTranslation();

  const columns = [
    'ID',
    t('partnerInfo'),
    t('websiteUrl'),
    t('description'),
    t('businessStatus'),
    t('createTime'),
    t('updateTime'),
    t('createBy'),
    t('updateBy'),
  ];

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th className="align-middle">
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
          {columns.map((field) => (
            <th key={field} className="align-middle">{field}</th>
          ))}
          <th className="fixed-column align-middle">{t('operation')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font">
            <td className="align-middle">
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
            <td className="text-truncate align-middle">{item.id}</td>
            <td className="align-middle">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Image
                  src={item.logoUrl}
                  alt={item.name}
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
                <span style={{ fontWeight: '500' }}>{item.name}</span>
              </div>
            </td>
            <td className="text-truncate align-middle">
              <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">
                {item.websiteUrl}
              </a>
            </td>
            <td className="text-truncate align-middle">{item.description}</td>
            <td className="align-middle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={(e) => handleStatusChange(item.id, e)}
                />
                <span className="toggle-switch-slider"></span>
              </label>
            </td>
            <td className="text-truncate align-middle">{item.createTime}</td>
            <td className="text-truncate align-middle">{item.updateTime}</td>
            <td className="text-truncate align-middle">{item.createBy}</td>
            <td className="text-truncate align-middle">{item.updateBy}</td>
            <td className="fixed-column align-middle">
              <Button type="link" onClick={() => handleEditClick(item)}>
                {t('edit')}
              </Button>
              <Button type="link" onClick={() => handleDetailClick(item)}>
                {t('details')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PartnersTable;


import React from 'react';
import { Button, Space, Avatar, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

const SaProjectTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleStatusChange,
  handleDetailClick
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
          <th>{t('userInfo')}</th>
          <th>{t('projectName')}</th>
          <th>{t('description')}</th>
          <th>{t('visibility')}</th>
          <th>{t('status')}</th>
          <th>{t('createTime')}</th>
          <th>{t('updateTime')}</th>
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
                <Avatar src={item.avatar} size={40} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Tooltip title={`ID: ${item.userId}`}>
                    <span style={{ fontWeight: 'bold' }}>{item.nickname}</span>
                  </Tooltip>
                  <span style={{ fontSize: '12px', color: '#666' }}>{item.username}</span>
                </div>
              </Space>
            </td>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>{t(item.visibility)}</td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.status === 'active'}
                  onChange={(e) => handleStatusChange(item.id, e.target.checked ? 'active' : 'inactive')}
                />
                <span className="toggle-switch-slider"></span>
              </label>
            </td>
            <td>{item.createTime}</td>
            <td>{item.updateTime}</td>
            <td className="fixed-column">
              <Space>
                <Button type="link" onClick={() => handleDetailClick(item)}>
                  {t('detail')}
                </Button>
                <Button type="link" onClick={() => handleEditClick(item)}>
                  {t('edit')}
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SaProjectTable;

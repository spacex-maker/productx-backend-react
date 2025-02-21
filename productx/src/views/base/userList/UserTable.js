import React from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import DefaultAvatar from 'src/components/DefaultAvatar';

const UserTable = ({
                     data,
                     selectAll,
                     selectedRows,
                     handleSelectAll,
                     handleSelectRow,
                     handleStatusChange,
                     handleEditClick,
                     handleDetailClick
                   }) => {
  const { t } = useTranslation(); // 使用 useTranslation 获取 t 函数

  const columns = [
    t('userInfo'), // 移除独立的 ID 列
    t('nickname'),
    t('email'),
    t('address'),
    t('status')
  ];

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
        {columns.map((field) => (
          <th key={field}>{field}</th>
        ))}
        <th className="fixed-column" key='操作'>{t('action')}</th>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt={`${item.username}的头像`}
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                <DefaultAvatar name={item.username} size={40} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '500' }}>{item.username}</span>
                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>ID: {item.id}</span>
              </div>
            </div>
          </td>
          <td className="text-truncate">{item.nickname}</td>
          <td className="text-truncate">{item.email}</td>
          <td className="address-cell">
            <div className="address-content" title={item.address}>
              {item.address}
            </div>
          </td>
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
          <td className="fixed-column">
            <Button type="link" onClick={() => handleEditClick(item)}>
              {t('update')} {/* 翻译修改按钮 */}
            </Button>
            <Button type="link" onClick={() => handleDetailClick(item)}>
              {t('detail')} {/* 翻译详情按钮 */}
            </Button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default UserTable;

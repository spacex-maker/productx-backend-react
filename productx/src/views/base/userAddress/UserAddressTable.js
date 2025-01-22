import React from 'react';
import { Button, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

const UserAddressTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleStatusChange,
  handleEditClick,
  handleDetailClick,
  handleDelete,
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
          {[
            'username',
            'contactName',
            'phoneNum',
            'contactAddress',
            'currentUse',
            'useCount',
            'createTime',
            'updateTime',
          ].map((field) => (
            <th key={field}>{t(field)}</th>
          ))}
          <th className="fixed-column">{t('action')}</th>
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
                <label className="custom-control-label" htmlFor={`td_checkbox_${item.id}`}></label>
              </div>
            </td>
            <td>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                whiteSpace: 'nowrap', 
                minWidth: '150px',
                overflow: 'visible'
              }}>
                {item.avatar ? (
                  <img 
                    src={item.avatar} 
                    alt="用户头像"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px rgba(135, 208, 104, 0.8)',
                      border: '2px solid #87d068',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#87d068',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '16px',
                      boxShadow: '0 0 8px rgba(135, 208, 104, 0.8)',
                      border: '2px solid #87d068'
                    }}
                  >
                    {item.username?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div>
                  <span style={{ fontWeight: '500' }}>{item.username}</span>
                  {item.isBelongSystem && (
                    <Tag color="blue" style={{ marginLeft: '8px' }}>
                      {t('systemUser')}
                    </Tag>
                  )}
                </div>
              </div>
            </td>
            <td className="text-truncate" style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
              {item.contactName}
            </td>
            <td className="text-truncate" style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
              {item.phoneNum}
            </td>
            <td className="address-cell" style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
              <div className="address-content" title={item.contactAddress}>
                {item.contactAddress}
              </div>
            </td>
            <td className="text-center">
              <Tag color={item.currentUse ? 'blue' : 'default'}>
                {item.currentUse ? t('yes') : t('no')}
              </Tag>
            </td>
            <td className="text-truncate">{item.useCount}</td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="text-truncate">{item.updateTime}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                {t('edit')}
              </Button>
              <Button type="link" onClick={() => handleDetailClick(item)}>
                {t('detail')}
              </Button>
              <Button 
                type="link" 
                danger 
                onClick={() => {
                  if (window.confirm(t('confirmDelete'))) {
                    handleDelete(item.id);
                  }
                }}
              >
                {t('delete')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserAddressTable;

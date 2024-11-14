import React from 'react';
import { Button, Space, Switch } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { commonStyles } from './styles';

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
  const { t } = useTranslation();

  return (
    <table className="table table-bordered table-striped compact-table" style={commonStyles.tableStyle}>
      <thead>
        <tr>
          <th style={{ width: '40px', padding: '4px' }}>
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
          {['ID', 'avatar', 'username', 'nickname', 'email', 'address', 'status'].map((field) => (
            <th key={field} style={{ padding: '4px 8px', fontSize: '12px' }}>{t(field)}</th>
          ))}
          <th className="fixed-column" style={{ padding: '4px 8px', fontSize: '12px' }} key='操作'>{t('action')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font" style={{ fontSize: '12px' }}>
            <td style={{ padding: '4px' }}>
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
            <td className="text-truncate" style={{ padding: '4px 8px' }}>{item.id}</td>
            <td className="text-truncate" style={{ padding: '4px 8px' }}>
              <img
                src={item.avatar}
                alt={`${item.nickname}的头像`}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '25%',
                  objectFit: 'cover'
                }}
              />
            </td>
            <td className="text-truncate" style={{ padding: '4px 8px' }}>{item.username}</td>
            <td className="text-truncate" style={{ padding: '4px 8px' }}>{item.nickname}</td>
            <td className="text-truncate" style={{ padding: '4px 8px' }}>{item.email}</td>
            <td className="text-truncate" style={{ padding: '4px 8px' }}>{item.address}</td>
            <td style={{ padding: '4px 8px' }}>
              <Switch
                checked={item.status}
                size="small"
                onChange={(checked) => handleStatusChange(item.id, checked)}
                style={{ 
                  transform: 'scale(0.8)',
                  marginTop: '-2px',
                  minWidth: '32px',
                  height: '16px'
                }}
              />
            </td>
            <td className="fixed-column" style={{ padding: '4px 8px' }}>
              <Space size={4}>
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined style={{ fontSize: '12px' }} />}
                  onClick={() => handleDetailClick(item)}
                  style={{ 
                    fontSize: '12px', 
                    padding: '0 4px',
                    height: '20px',
                    lineHeight: '20px'
                  }}
                >
                  {t('detail')}
                </Button>
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined style={{ fontSize: '12px' }} />}
                  onClick={() => handleEditClick(item)}
                  style={{ 
                    fontSize: '12px', 
                    padding: '0 4px',
                    height: '20px',
                    lineHeight: '20px'
                  }}
                >
                  {t('update')}
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// 添加样式
const styles = `
  .compact-table {
    font-size: 12px;
  }

  .compact-table th,
  .compact-table td {
    padding: 4px 8px;
  }

  .compact-table .custom-checkbox {
    padding: 0;
    margin: 0;
  }

  .compact-table .custom-control-input {
    width: 14px;
    height: 14px;
  }

  .compact-table .text-truncate {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .compact-table .ant-btn {
    font-size: 12px;
    padding: 0 4px;
    height: 20px;
    line-height: 20px;
  }

  .compact-table .ant-space {
    gap: 4px !important;
  }

  .compact-table .ant-switch {
    min-width: 32px;
    height: 16px;
  }

  .compact-table .ant-switch-handle {
    width: 14px;
    height: 14px;
    top: 1px;
  }

  .compact-table .ant-switch-checked .ant-switch-handle {
    left: calc(100% - 15px);
  }
`;

// 将样式添加到文档中
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default UserTable;

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
          {[
            'id',
            'userId',
            'username',
            'contactName',
            'phoneNum',
            'contactAddress',
            'currentUse',
            'useCount',
            'createTime',
            'updateTime'
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
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.id}`}
                ></label>
              </div>
            </td>
            <td className="text-truncate">{item.id}</td>
            <td className="text-truncate">{item.userId}</td>
            <td className="text-truncate">{item.username}</td>
            <td className="text-truncate">{item.contactName}</td>
            <td className="text-truncate">{item.phoneNum}</td>
            <td className="address-cell">
              <div className="address-content" title={item.contactAddress}>
                {item.contactAddress}
              </div>
            </td>
            <td className="text-center">
              <Tag color={item.currentUse ? "blue" : "default"}>
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
            </td>
          </tr>
        ))}
      </tbody>
      <style jsx>{`
        .address-cell {
          max-width: 200px;
          overflow: hidden;
        }
        .address-content {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .text-truncate {
          max-width: 150px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .record-font {
          font-size: 10px;
        }
        .fixed-column {
          width: 120px;
          white-space: nowrap;
        }
        th {
          font-size: 10px;
          white-space: nowrap;
        }
        .ant-input-search .ant-input {
          color: var(--text-color);
        }

        .ant-input-search .ant-input::placeholder {
          color: var(--text-secondary-color);
        }

        .ant-input-search .ant-input-group-addon .ant-btn {
          color: var(--text-color);
        }

        /* 暗色主题下的样式 */
        [data-theme='dark'] .ant-input-search .ant-input {
          background-color: var(--component-background);
          color: var(--text-color);
        }

        [data-theme='dark'] .ant-input-search .ant-input::placeholder {
          color: var(--text-secondary-color);
        }

        [data-theme='dark'] .ant-input-search .ant-input-group-addon .ant-btn {
          color: var(--text-color);
        }

        /* 增加选择器优先级 */
        .table-container .ant-input-search .ant-input {
          color: var(--text-color) !important;
        }

        .table-container .ant-input-search .ant-input::placeholder {
          color: var(--text-secondary-color) !important;
        }

        .table-container .ant-input-search .ant-input-group-addon .ant-btn {
          color: var(--text-color) !important;
        }

        /* 暗色主题下的样式 */
        .table-container[data-theme='dark'] .ant-input-search .ant-input {
          background-color: var(--component-background) !important;
          color: var(--text-color) !important;
        }

        .table-container[data-theme='dark'] .ant-input-search .ant-input::placeholder {
          color: var(--text-secondary-color) !important;
        }

        .table-container[data-theme='dark'] .ant-input-search .ant-input-group-addon .ant-btn {
          color: var(--text-color) !important;
        }
      `}</style>
    </table>
  );
};

export default UserAddressTable;

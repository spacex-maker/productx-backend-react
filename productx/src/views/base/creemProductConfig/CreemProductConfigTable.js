import React from 'react';
import { Button, Tag, Switch } from 'antd';

const CreemProductConfigTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleStatusChange,
  t
}) => {
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
            t('productName'),
            t('creemProductId'),
            t('coinType'),
            t('amount'),
            t('baseToken'),
            t('bonusToken'),
            t('totalToken'),
            t('tag'),
            t('status'),
            t('sortOrder'),
            t('createTime'),
            t('updateTime')
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th className="fixed-column">{t('operations')}</th>
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
            <td className="text-truncate" style={{ fontWeight: 'bold' }}>{item.productName}</td>
            <td className="text-truncate" style={{ fontSize: '12px', color: '#666' }}>{item.creemProductId}</td>
            <td>
              <Tag color="blue">{item.coinType || 'USD'}</Tag>
            </td>
            <td className="text-truncate">{item.amount}</td>
            <td className="text-truncate">{item.baseToken?.toLocaleString() || 0}</td>
            <td className="text-truncate">{item.bonusToken?.toLocaleString() || 0}</td>
            <td className="text-truncate" style={{ fontWeight: 'bold', color: '#1890ff' }}>
              {((item.baseToken || 0) + (item.bonusToken || 0)).toLocaleString()}
            </td>
            <td>
              {item.tag ? (
                <Tag color="gold">{item.tag}</Tag>
              ) : '-'}
            </td>
            <td>
              <Switch
                checked={item.status === 'ACTIVE'}
                onChange={(checked) => handleStatusChange(item.id, checked ? 'ACTIVE' : 'INACTIVE')}
                checkedChildren={t('active')}
                unCheckedChildren={t('inactive')}
              />
            </td>
            <td className="text-truncate">{item.sortOrder}</td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="text-truncate">{item.updateTime}</td>
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

export default CreemProductConfigTable;

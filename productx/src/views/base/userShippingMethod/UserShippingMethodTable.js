import React from 'react';
import { Switch, Tooltip, message, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';

const ShippingMethodTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  t
}) => {
  const handleStatusChange = async (ids, status) => {
    try {
      await api.post('/manage/user-shipping-method/change-status', {
        ids: Array.isArray(ids) ? ids : [ids],
        status
      });
      message.success(t('statusUpdateSuccess'));
    } catch (error) {
      message.error(t('statusUpdateFailed') + ': ' + (error.response?.data?.message || error.message));
    }
  };

  const columns = [
    'ID',
    t('shippingMethodName'),
    <span key="description">
      {t('shippingMethodDesc')}
      <Tooltip title={t('i18nFieldTip')}>
        <InfoCircleOutlined style={{ marginLeft: '4px' }} />
      </Tooltip>
    </span>,
    t('status'),
    t('operations')
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
          {columns.map((column) => (
            <th key={typeof column === 'string' ? column : 'description'}>{column}</th>
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
            <td className="text-truncate">{item.shippingMethod}</td>
            <td className="text-truncate">{t(item.description)}</td>
            <td>
              <Switch
                checked={item.status}
                onChange={(checked) => handleStatusChange(item.id, checked)}
                checkedChildren={t('enabled')}
                unCheckedChildren={t('disabled')}
              />
            </td>
            <td>
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

export default ShippingMethodTable;

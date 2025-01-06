import React from 'react';
import { Switch, Tooltip, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { InfoCircleOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';

const ShippingMethodTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  onStatusChange,
}) => {
  const { t } = useTranslation();

  const handleStatusChange = async (ids, status) => {
    try {
      await api.post('/manage/user-shipping-method/change-status', {
        ids: Array.isArray(ids) ? ids : [ids],
        status
      });
      message.success('状态修改成功');
      onStatusChange?.();
    } catch (error) {
      message.error('状态修改失败：' + (error.response?.data?.message || error.message));
    }
  };

  const columns = [
    'ID',
    '配送方式名称',
    <span key="description">
      配送方式描述 
      <Tooltip title="此字段已做国际化处理">
        <InfoCircleOutlined style={{ marginLeft: '4px' }} />
      </Tooltip>
    </span>,
    '状态',
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
            <td className="text-truncate">{t(`${item.description}`)}</td>
            <td>
              <Switch
                checked={item.status}
                onChange={(checked) => handleStatusChange(item.id, checked)}
                checkedChildren="启用"
                unCheckedChildren="禁用"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ShippingMethodTable;

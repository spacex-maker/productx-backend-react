import React from 'react';
import { Button, Space, Tag } from 'antd';
import moment from 'moment';

const QtsApiKeyTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleViewDetails,
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
            '交易所', 'API密钥标识', 'API密钥', '备注',
            '权限', '状态', '更新时间'
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th className="fixed-column">操作</th>
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
            <td>{item.exchangeName}</td>
            <td>{item.apiKeyName}</td>
            <td>{item.apiKey.substring(0, 8)}...</td>
            <td>{item.remark || '-'}</td>
            <td>
              {item.permissions.split(',').map(permission => (
                <Tag color="blue" key={permission}>
                  {permission}
                </Tag>
              ))}
            </td>
            <td>
              <Tag color={item.status ? 'success' : 'error'}>
                {item.status ? '启用' : '禁用'}
              </Tag>
            </td>
            <td>{moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')}</td>
            <td className="fixed-column">
              <Space>
                <Button type="link" onClick={() => handleEditClick(item)}>
                  修改
                </Button>
                <Button type="link" onClick={() => handleViewDetails(item)}>
                  查看详情
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QtsApiKeyTable;

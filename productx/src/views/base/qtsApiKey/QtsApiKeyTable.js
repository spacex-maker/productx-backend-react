import React from 'react';
import { Button } from 'antd';

const QtsApiKeyTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
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
            '交易所', 'API密钥标识', 'API密钥', 'API密钥秘钥', '备注',
            '权限', 'IP白名单', '最后使用时间', '状态',
            '创建时间', '更新时间'
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
            <td>{item.apiKey}</td>
            <td>{item.apiSecret}</td>
            <td>{item.remark}</td>
            <td>{item.permissions}</td>
            <td>{item.ipWhitelist}</td>
            <td>{item.lastUsedTime}</td>
            <td>{item.status ? '启用' : '禁用'}</td>
            <td>{item.createTime}</td>
            <td>{item.updateTime}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                修改
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QtsApiKeyTable;
